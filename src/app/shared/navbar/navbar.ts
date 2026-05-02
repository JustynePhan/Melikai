import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  translations = {
    en: { saveTheDate: 'Save the Date', timeline: 'Timeline', details: 'Details', rsvp: 'RSVP' },
    fr: { saveTheDate: 'Marquez la Date', timeline: 'Chronologie', details: 'Détails', rsvp: 'RSVP' }
  };

  constructor(public languageService: LanguageService) {}

  get t() {
    return this.translations[this.languageService.language];
  }
}
