import { Injectable } from '@angular/core';import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface VentaResponse {
  success: boolean;
  totalVentas: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  ventas: Venta[];
}

export interface Venta {
  id_venta: number;
  fecha_venta: string;
  tipo_venta: string;
  total: string;
  estado: string;
  dni_cliente: number;
  nombre_cliente: string;
  id_usuario: number;
  nombre_usuario: string;
  metodos_pago: string;
  productos: Producto[];
  pagos: Pago[];
}

interface Producto {
  id: number;
  id_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: string;
  tipo_precio: string;
  subtotal: string;
  stock_anterior: number;
  stock_nuevo: number;
  codigo: string;
  nombre: string;
}

interface Pago {
  metodo_pago: string;
  monto: string;
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = `${environment.API_URL}/api/ventas`;

  constructor(private http: HttpClient) {}

  getVentas(page: number, limit: number, searchTerm: string = ''): Observable<VentaResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<VentaResponse>(this.apiUrl, { params });
  }

  getVentaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
