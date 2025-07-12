import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipocambioService {

  private apiUrl = environment.API_URL + '/api/tipocambio';

  constructor(private http: HttpClient) { }

  getTipoCambio(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  updateTipoCambio(valor: number): Observable<any> {
    return this.http.put(`${this.apiUrl}`, { valor });
  }
}
