import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../shared/language.service';
import { Navbar } from '../navbar/navbar';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Translations {
  saveTheDate: string;
  details: string;
  timeline: string;
  rsvp: string;
  weddingDate: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  saveTheDateSection: string;
  timelineSection: string;
  detailsSection: string;
  rsvpSection: string;
  rsvpSubtitle: string;
  addToCalendar: string;
  googleCalendar: string;
  outlookCalendar: string;
  appleCalendar: string;
  welcomeMessage: string;
  welcomePara1: string;
  welcomePara2: string;
  welcomePara3: string;
  welcomeClosing: string;
  welcomeNames: string;
  rsvpName: string;
  rsvpAttending: string;
  rsvpAttendingYes: string;
  rsvpAttendingNo: string;
  rsvpGuests: string;
  rsvpMeal: string;
  rsvpMealMeat: string;
  rsvpMealFish: string;
  rsvpMealVeg: string;
  rsvpMessage: string;
  rsvpSubmit: string;
  rsvpSuccess: string;
  rsvpError: string;
  rsvpDeadline: string;
  detailsCeremony: string;
  detailsReception: string;
  timelineThe: string;
  timelineWedding: string;
  timelineDay: string;
  timelineScript: string;
  timelineTime1: string;
  timelineTime2: string;
  timelineTime3: string;
  timelineTime4: string;
  timelineEvent1: string;
  timelineEvent2: string;
  timelineEvent3: string;
  timelineEvent4: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  countdown: Countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  rsvpForm = {
    name: '',
    attending: '',
    guests: 1,
    meal: '',
    message: ''
  };
  rsvpSubmitting = false;
  rsvpSubmitted = false;
  rsvpErrored = false;

  translations: { [key: string]: Translations } = {
    en: {
      saveTheDate: 'Save the Date',
      details: 'Details',
      timeline: 'Timeline',
      rsvp: 'RSVP',
      weddingDate: 'October 10, 2026',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      saveTheDateSection: 'Save the Date',
      timelineSection: 'Timeline',
      detailsSection: 'Wedding Details',
      rsvpSection: 'RSVP',
      rsvpSubtitle: 'Please let us know by August 1st, 2026.',
      addToCalendar: 'Add to Your Calendar',
      googleCalendar: 'Google Calendar',
      outlookCalendar: 'Outlook',
      appleCalendar: 'Apple Calendar',
      welcomeMessage: 'You are invited',
      welcomePara1: 'We\'re so delighted you\'re here and can\'t wait to celebrate this special moment with you.',
      welcomePara2: 'This space has been thoughtfully created to guide you through all the details as our wedding approaches, from venue information and RSVP to the event schedule and other essentials.',
      welcomePara3: 'Having you with us on this day means everything, and we\'re truly excited to share these moments, laughter, and memories together.',
      welcomeClosing: 'With all our love,',
      welcomeNames: 'Kai & Melina',
      rsvpName: 'Full Name',
      rsvpAttending: 'Will you be attending?',
      rsvpAttendingYes: 'Joyfully accepts',
      rsvpAttendingNo: 'Regretfully declines',
      rsvpGuests: 'Number of guests (including yourself)',
      rsvpMeal: 'Meal preference',
      rsvpMealMeat: 'Meat',
      rsvpMealFish: 'Fish',
      rsvpMealVeg: 'Vegetarian',
      rsvpMessage: 'Message for the couple (optional)',
      rsvpSubmit: 'Send my RSVP',
      rsvpSuccess: 'Thank you! Your RSVP has been received. We can\'t wait to celebrate with you.',
      rsvpError: 'Something went wrong. Please try again or contact us directly.',
      rsvpDeadline: 'Kindly respond by August 1st, 2026',
      detailsCeremony: 'Ceremony',
      detailsReception: 'Reception',
      timelineThe: 'THE',
      timelineWedding: 'WEDDING',
      timelineDay: 'DAY',
      timelineScript: 'Schedule',
      timelineTime1: '1:30 PM',
      timelineTime2: '3:00 PM',
      timelineTime3: '4:00 PM',
      timelineTime4: '6:00 PM',
      timelineEvent1: 'Chapel Ceremony',
      timelineEvent2: 'Bridal Photo Session',
      timelineEvent3: 'Cocktail Hour',
      timelineEvent4: 'Dinner'
    },
    fr: {
      saveTheDate: 'Marquez la Date',
      details: 'Détails',
      timeline: 'Chronologie',
      rsvp: 'RSVP',
      weddingDate: '10 Octobre 2026',
      days: 'Jours',
      hours: 'Heures',
      minutes: 'Minutes',
      seconds: 'Secondes',
      saveTheDateSection: 'Marquez la Date',
      timelineSection: 'Chronologie',
      detailsSection: 'Détails du Mariage',
      rsvpSection: 'RSVP',
      rsvpSubtitle: 'Merci de nous répondre avant le 1er août 2026.',
      addToCalendar: 'Ajouter à Votre Calendrier',
      googleCalendar: 'Google Agenda',
      outlookCalendar: 'Outlook',
      appleCalendar: 'Calendrier Apple',
      welcomeMessage: 'Vous êtes invités',
      welcomePara1: 'Nous sommes si heureux que vous soyez là et avons hâte de célébrer ce moment spécial avec vous.',
      welcomePara2: 'Cet espace a été soigneusement conçu pour vous guider à travers tous les détails à l\'approche de notre mariage — des informations sur le lieu et le RSVP au programme et autres essentiels.',
      welcomePara3: 'Avoir votre présence en ce jour signifie tout pour nous, et nous sommes vraiment impatients de partager ces moments, ces rires et ces souvenirs ensemble.',
      welcomeClosing: 'Avec tout notre amour,',
      welcomeNames: 'Kai & Melina',
      rsvpName: 'Nom complet',
      rsvpAttending: 'Serez-vous présent(e) ?',
      rsvpAttendingYes: 'Accepte avec joie',
      rsvpAttendingNo: 'Décline à regret',
      rsvpGuests: 'Nombre d\'invités (vous inclus)',
      rsvpMeal: 'Préférence de repas',
      rsvpMealMeat: 'Viande',
      rsvpMealFish: 'Poisson',
      rsvpMealVeg: 'Végétarien',
      rsvpMessage: 'Message pour les mariés (optionnel)',
      rsvpSubmit: 'Envoyer mon RSVP',
      rsvpSuccess: 'Merci ! Votre RSVP a bien été reçu. Nous avons hâte de fêter ça avec vous.',
      rsvpError: 'Une erreur s\'est produite. Veuillez réessayer ou nous contacter directement.',
      rsvpDeadline: 'Merci de répondre avant le 1er août 2026',
      detailsCeremony: 'Cérémonie',
      detailsReception: 'Réception',
      timelineThe: 'LE',
      timelineWedding: 'GRAND',
      timelineDay: 'JOUR',
      timelineScript: 'Programme',
      timelineTime1: '13h30',
      timelineTime2: '15h00',
      timelineTime3: '16h00',
      timelineTime4: '18h00',
      timelineEvent1: 'Cérémonie à la chapelle',
      timelineEvent2: 'Séance photo des mariés',
      timelineEvent3: 'Cocktail',
      timelineEvent4: 'Souper'
    }
  };

  private countdownInterval: any;

  constructor(private cdr: ChangeDetectorRef, private languageService: LanguageService, private firestore: Firestore) {}

  ngOnInit(): void {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
      this.cdr.markForCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  async submitRsvp(): Promise<void> {
    if (!this.rsvpForm.name || !this.rsvpForm.attending) return;
    this.rsvpSubmitting = true;
    this.rsvpErrored = false;
    try {
      await addDoc(collection(this.firestore, 'rsvps'), {
        ...this.rsvpForm,
        submittedAt: new Date().toISOString(),
        language: this.languageService.language
      });
      this.rsvpSubmitted = true;
    } catch {
      this.rsvpErrored = true;
    } finally {
      this.rsvpSubmitting = false;
    }
  }

  addToGoogleCalendar(): void {
    const event = encodeURIComponent('Kai & Melina\'s Wedding');
    const details = encodeURIComponent('Celebrating the wedding of Kai and Melina');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event}&details=${details}&dates=20261010/20261011`;
    window.open(url, '_blank');
  }

  addToOutlook(): void {
    const event = encodeURIComponent('Kai & Melina\'s Wedding');
    const details = encodeURIComponent('Celebrating the wedding of Kai and Melina');
    const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${event}&body=${details}&startdt=2026-10-10&enddt=2026-10-11`;
    window.open(url, '_blank');
  }

  addToAppleCalendar(): void {
    const event = encodeURIComponent('Kai & Melina\'s Wedding');
    const details = encodeURIComponent('Celebrating the wedding of Kai and Melina');
    const url = `data:text/calendar,BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Event//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:20261010
DTEND:20261011
SUMMARY:Kai & Melina's Wedding
DESCRIPTION:Celebrating the wedding of Kai and Melina
UID:1@example.com
END:VEVENT
END:VCALENDAR`;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kai-melina-wedding.ics';
    link.click();
  }

  get t(): Translations {
    return this.translations[this.languageService.language];
  }

  private updateCountdown(): void {
    const weddingDate = new Date('2026-10-10T00:00:00').getTime();
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference > 0) {
      this.countdown.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      this.countdown.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      this.countdown.minutes = Math.floor((difference / 1000 / 60) % 60);
      this.countdown.seconds = Math.floor((difference / 1000) % 60);
    } else {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }
}
