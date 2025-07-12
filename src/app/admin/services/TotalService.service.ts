// src/app/admin/services/total-items.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TotalService {
  private cotizacionTotalSubject = new BehaviorSubject<number>(0);
  
  cotizacionTotal$ = this.cotizacionTotalSubject.asObservable();

  updateCotizacionTotal(total: number) {
    this.cotizacionTotalSubject.next(total);
  }

  updateCotizacionTotalItems(total: number) {
    this.cotizacionTotalSubject.next(total);
  }
}