import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css'
})
export class ThemeToggleComponent {

  isDark: boolean = false;

  constructor(private themeService: ThemeService) {
    this.themeService.darkMode$.subscribe((isDark) => (this.isDark = isDark));
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

}
