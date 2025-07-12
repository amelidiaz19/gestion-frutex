import { Component } from '@angular/core';
import { TipocambioService } from '../../services/tipocambio.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipo-cambio',
  imports: [FormsModule],
  templateUrl: './tipo-cambio.component.html',
  styleUrl: './tipo-cambio.component.css'
})
export class TipoCambioComponent {

  valor?: number;

  constructor(private tipocambioService: TipocambioService,
    private router: Router) { }

  actualizarTipoCambio() {
    if (this.valor) {
      this.tipocambioService.updateTipoCambio(this.valor).subscribe({
        next: (response) => {
          console.log('Tipo de cambio actualizado:', response);
          alert('Tipo de cambio actualizado correctamente.');
          localStorage.setItem('tipoCambioIngresado', 'true'); // Marca como ingresado
          this.router.navigate(['/dashboard']); // Redirige al Dashboard
        },
        error: (error) => {
          console.error('Error al actualizar el tipo de cambio:', error);
          alert('Error al actualizar el tipo de cambio.');
        }
      });
    } else {
      alert('Por favor, ingrese un tipo de cambio válido.');
    }
  }

}
