import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TipoCambioGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const tipoCambioIngresado = localStorage.getItem('tipoCambioIngresado') === 'true';
    if (!tipoCambioIngresado) {
      this.router.navigate(['/tipo-cambio']); 
      return false;
    }
    return true;
  }
}