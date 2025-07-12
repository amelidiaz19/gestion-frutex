import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    const storedPreference = localStorage.getItem('darkMode');
    if (storedPreference !== null) {
      const isDark = storedPreference === 'true';
      this.darkMode.next(isDark);
      this.applyTheme(isDark);
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.darkMode.next(prefersDark);
      this.applyTheme(prefersDark);
    }
  }

  toggleDarkMode() {
    const isDark = !this.darkMode.value;
    this.darkMode.next(isDark);
    this.applyTheme(isDark);
    localStorage.setItem('darkMode', isDark.toString());
  }

  private applyTheme(isDark: boolean) {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }
}
