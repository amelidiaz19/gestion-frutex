import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  private apiUrl = environment.API_URL + '/api/cotizaciones';

  constructor(private http: HttpClient) {}

  getCotizaciones(page: number = 1, limit: number = 50, searchTerm: string = ''): Observable<{
    success: boolean;
    totalCotizaciones: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    cotizaciones: Array<{
      id: number;
      cliente_documento: string;
      cliente_nombre: string;
      cliente_telefono: string;
      fecha_creacion: string;
      fecha_actualizacion: string;
      total_amount: string;
      vendedor_id: number;
      vendedor_nombre: string;
    }>;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm);

    return this.http.get<any>(this.apiUrl, { params });
  }

  getDetalleCotizacion(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  guardarCotizacion(cotizacion: {
    productos: Array<{
      producto_id: number;
      cantidad: number;
      tipo_venta: 'unidad' | 'docena' | 'caja';
      precio_unitario: number;
      precio_total: number;
      descripcion_personalizada?: string;
      product: {
        precio_unidad: number;
        precio_docena: number;
        precio_caja: number;
        precio_costo_soles: number;
      };
    }>;
    dni_cliente: string;
    vendedor_id: number;
    cliente_nombre: string;
    cliente_telefono: string;
    observaciones?: string;
  }): Observable<any> {
    return this.http.post<{
      success: boolean;
      message?: string;
      error?: string;
      data?: {
        id: number;
        cliente_documento: string;
        cliente_nombre: string;
        total_amount: number;
        productos: number;
      };
    }>(this.apiUrl, cotizacion);
  }
}
