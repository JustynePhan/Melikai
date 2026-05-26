import { Component, OnInit, Injector, NgZone, runInInjectionContext, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, query, orderBy } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';

interface GuestInfo {
  name: string;
  starter: string;
  mainCourse: string;
}

interface RsvpRecord {
  id: string;
  submitterName: string;
  attending: string;
  totalGuests: number;
  attendees: GuestInfo[];
  dietary?: string;
  message: string;
  submittedAt: string;
  language: string;
}

interface Totals {
  totalSubmissions: number;
  totalAttending: number;
  totalNotAttending: number;
  chicken: number;
  fish: number;
  steak: number;
  vegetarian: number;
  kid: number;
  starterSoup: number;
  starterPasta: number;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  user: User | null = null;
  email = '';
  password = '';
  loginError = '';
  loginLoading = false;

  rsvps: RsvpRecord[] = [];
  loading = false;
  loadError = '';

  expandedRow: string | null = null;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private injector: Injector,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      onAuthStateChanged(this.auth, (user) => {
        this.zone.run(() => {
          this.user = user;
          if (user) this.loadRsvps();
          this.cdr.detectChanges();
        });
      });
    });
  }

  async login(): Promise<void> {
    this.loginError = '';
    this.loginLoading = true;
    try {
      await runInInjectionContext(this.injector, () =>
        signInWithEmailAndPassword(this.auth, this.email, this.password)
      );
    } catch (err: any) {
      console.error('Login failed:', err);
      this.loginError = err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found'
        ? 'Incorrect email or password.'
        : (err?.message ?? 'Login failed.');
    } finally {
      this.loginLoading = false;
    }
  }

  async logout(): Promise<void> {
    await runInInjectionContext(this.injector, () => signOut(this.auth));
    this.rsvps = [];
  }

  async loadRsvps(): Promise<void> {
    this.zone.run(() => {
      this.loading = true;
      this.loadError = '';
      this.cdr.detectChanges();
    });
    try {
      const q = query(collection(this.firestore, 'rsvps'), orderBy('submittedAt', 'desc'));
      const snapshot = await runInInjectionContext(this.injector, () => getDocs(q));
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<RsvpRecord, 'id'>)
      }));
      this.zone.run(() => {
        this.rsvps = records;
        this.loading = false;
        this.cdr.detectChanges();
      });
    } catch (err: any) {
      console.error('Failed to load RSVPs:', err);
      this.zone.run(() => {
        this.loadError = err?.code === 'permission-denied'
          ? 'Permission denied — update Firestore rules to allow authenticated reads.'
          : (err?.message ?? 'Failed to load data.');
        this.loading = false;
        this.cdr.detectChanges();
      });
    }
  }

  toggleRow(id: string): void {
    this.expandedRow = this.expandedRow === id ? null : id;
  }

  formatDate(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('fr-CA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  labelMain(value: string): string {
    const map: Record<string, string> = {
      chicken: 'Suprême de poulet, purée à l\'ail, légumes grillés',
      fish: 'Morue noire laquée au miso, riz sauvage, épinards',
      steak: 'Bifteck de côte sur os 16oz, purée à l\'ail, légumes',
      vegetarian: 'Cavatellia à la truffe, champignons sauvages, roquette',
      kid: 'Menu enfant'
    };
    return map[value] ?? value;
  }

  labelStarter(value: string): string {
    const map: Record<string, string> = {
      soup: 'Soupe du jour',
      pasta: 'Fazzoletti ricotta & épinards, sauce rosée',
      kid: '—'
    };
    return map[value] ?? value;
  }

  exportCsv(): void {
    const escape = (v: string | undefined | null) => {
      if (v == null) return '';
      const s = String(v);
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const headers = [
      'Submitted', 'Submitter Name', 'Attending', 'Total Guests',
      'Dietary', 'Message', 'Language',
      'Guest #', 'Guest Name', 'Starter', 'Main Course'
    ].join(',');

    const rows: string[] = [];
    for (const r of this.rsvps) {
      const base = [
        escape(this.formatDate(r.submittedAt)),
        escape(r.submitterName),
        escape(r.attending),
        escape(String(r.attending === 'yes' ? r.totalGuests : 0)),
        escape(r.dietary),
        escape(r.message),
        escape(r.language)
      ].join(',');

      if (r.attending === 'yes' && r.attendees?.length) {
        r.attendees.forEach((a, i) => {
          rows.push([
            base,
            escape(String(i + 1)),
            escape(a.name),
            escape(this.labelStarter(a.starter)),
            escape(this.labelMain(a.mainCourse))
          ].join(','));
        });
      } else {
        rows.push(`${base},,,,,`);
      }
    }

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  get totals(): Totals {
    const t: Totals = { totalSubmissions: 0, totalAttending: 0, totalNotAttending: 0, chicken: 0, fish: 0, steak: 0, vegetarian: 0, kid: 0, starterSoup: 0, starterPasta: 0 };
    for (const r of this.rsvps) {
      t.totalSubmissions++;
      if (r.attending === 'yes') {
        t.totalAttending += r.totalGuests ?? 1;
        for (const a of (r.attendees ?? [])) {
          if (a.mainCourse === 'chicken') t.chicken++;
          else if (a.mainCourse === 'fish') t.fish++;
          else if (a.mainCourse === 'steak') t.steak++;
          else if (a.mainCourse === 'vegetarian') t.vegetarian++;
          else if (a.mainCourse === 'kid') t.kid++;
          if (a.starter === 'soup') t.starterSoup++;
          else if (a.starter === 'pasta') t.starterPasta++;
        }
      } else {
        t.totalNotAttending++;
      }
    }
    return t;
  }
}
