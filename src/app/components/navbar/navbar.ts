import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../shared/language.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  translations = {
    en: { saveTheDate: 'Welcome', timeline: 'Timeline', details: 'Details', rsvp: 'RSVP' },
    fr: { saveTheDate: 'Bienvenue', timeline: 'Chronologie', details: 'Détails', rsvp: 'RSVP' },
    zh: { saveTheDate: '预留佳期', timeline: '日程', details: '详情', rsvp: '出席确认' }
  };

  menuOpen = false;
  langOpen = false;
  hidden = false;
  private lastScrollY = 0;

  readonly languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'zh', label: '中文' }
  ];

  constructor(public languageService: LanguageService) {}

  @HostListener('window:scroll')
  onScroll() {
    const currentY = window.scrollY;
    this.hidden = currentY > this.lastScrollY && currentY > 80;
    this.lastScrollY = currentY;
  }

  get t() {
    return this.translations[this.languageService.language];
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toggleLang() {
    this.langOpen = !this.langOpen;
  }

  setLanguage(code: string) {
    this.languageService.language = code as 'en' | 'fr' | 'zh';
    this.langOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-selector')) {
      this.langOpen = false;
    }
  }
}
