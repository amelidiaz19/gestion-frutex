import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  showTipoCambioButton = false;

  constructor(private router: Router) {
  }

  updateTipocambio() {
    this.router.navigate(['/tipo-cambio']);
  }

}
