import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../admin/services/auth.service';
import { TipocambioService } from '../../services/tipocambio.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, ThemeToggleComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  NtipoCambio: { yuan_dolar: number, dolar_soles: number } = {
    yuan_dolar: 0,
    dolar_soles: 0
  };
  private routerSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tipoCambio: TipocambioService
  ) {
    // Suscribirse a los eventos de navegación
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Cerrar el sidebar cuando se navega a una nueva ruta
      this.isSidebarOpen = false;
    });
  }

  ngOnInit(): void {
    initFlowbite();
    this.loadTipocambio();
  }

  ngOnDestroy() {
    // Desuscribirse para evitar memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadTipocambio() {
    this.tipoCambio.getTipoCambio().subscribe({
      next: (data: any) => {
        console.log('Tipo cambio data:', data);
        if (data && data.yuan_dolar && data.dolar_soles) {
          this.NtipoCambio = {
            yuan_dolar: parseFloat(data.yuan_dolar),
            dolar_soles: parseFloat(data.dolar_soles)
          };
        } else {
          console.error('No se recibieron datos válidos del tipo de cambio:', data);
          this.NtipoCambio = { yuan_dolar: 0, dolar_soles: 0 };
        }
      },
      error: (error) => {
        console.error('Error al cargar el tipo de cambio:', error);
        this.NtipoCambio = { yuan_dolar: 0, dolar_soles: 0 };
      }
    });
  }

  isSidebarOpen = false;
  isHistorialDropdownOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleHistorialDropdown() {
    this.isHistorialDropdownOpen = !this.isHistorialDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
