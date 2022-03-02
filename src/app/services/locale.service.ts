import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor() { }

  get locale(): string {
    let locale = localStorage.getItem('locale');
    if (!locale) {
      locale = 'en';
    }
    return locale;
  }

  set locale(l: string) {
    localStorage.setItem('locale', l);
  }
}
