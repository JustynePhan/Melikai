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
    fr: { saveTheDate: 'Bienvenue', timeline: 'Chronologie', details: 'Détails', rsvp: 'RSVP' }
  };

  menuOpen = false;
  hidden = false;
  private lastScrollY = 0;

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
}
