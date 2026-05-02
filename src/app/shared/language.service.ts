import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  language: 'en' | 'fr' = 'en';

  toggleLanguage(): void {
    this.language = this.language === 'en' ? 'fr' : 'en';
  }
}
