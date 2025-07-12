import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface HistorialResponse {
  success: boolean;
  totalRegistros: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: Array<{
    id: number;
    fecha_ingreso: string;
    cantidad_cajas: number;
    cantidad_por_caja: number;
    precio_unitario: number;
    total_valor: number;
    producto_codigo: string;
    producto_nombre: string;
    empleado_nombre: string;
    empleado_apellido: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private apiUrl = environment.API_URL + '/api/almacen';
  private productos: Array<any> = [];
  
  constructor(private http: HttpClient) { }

  agregarProductoTemp(producto: any) {
    this.productos.push(producto);
    console.log(this.productos);
  }

  limpiarProductosTemp() {
    this.productos = [];
  }

  obtenerProductosTemp() {
    return this.productos;
  }

  registrarProductos(empleado_id: number): Observable<any> {
    const data = {
      empleado_id,
      productos: this.productos
    };
    return this.http.post(`${this.apiUrl}/`, data);
  }

  obtenerHistorial(page: number = 1, limit: number = 50, searchTerm: string = ''): Observable<HistorialResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
      
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
  
    return this.http.get<HistorialResponse>(`${this.apiUrl}/historial`, { params });
  }
}
