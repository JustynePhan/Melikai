import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  language: 'en' | 'fr' | 'zh' = 'en';

  toggleLanguage(): void {
    if (this.language === 'en') this.language = 'fr';
    else if (this.language === 'fr') this.language = 'zh';
    else this.language = 'en';
  }
}
