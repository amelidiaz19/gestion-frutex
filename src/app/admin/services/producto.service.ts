import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = environment.API_URL + '/api/system';

  constructor(private http: HttpClient) { }

  getProductos(page: number, limit: number, searchTerm: string = '', orderStock: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm)
      .set('orderStock', orderStock.toString());
  
    console.log('API URL:', `${this.apiUrl}`);
    console.log('Request Params:', params.toString());
  
    return this.http.get<any>(`${this.apiUrl}`, { params }).pipe(
      tap(response => {
        console.log('Raw API Response:', response);
        // Transform the response if needed
        if (response && response.productos) {
          const transformed = {
            productos: response.productos,
            total: response.totalProductos,
            currentPage: response.currentPage,
            totalPages: response.totalPages
          };
          console.log('Transformed Response:', transformed);
          return transformed;
        }
        console.log('Invalid Response:', response);
        return {
          productos: [],
          total: 0,
          currentPage: 1,
          totalPages: 1
        };
      }),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  getProductosECINFO(page: number, limit: number, searchTerm: string = ''): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm)

    return this.http.get<any>(`${this.apiUrl}/sis`, { params }).pipe(
      tap(response => {
        if (response && response.productos) {
          const transformed = {
            productos: response.productos,
            total: response.totalProductos,
            currentPage: response.currentPage,
            totalPages: response.totalPages
          };
          return transformed;
        }
        return {
          productos: [],
          total: 0,
          currentPage: 1,
          totalPages: 1
        };
      }),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  updateProducto(producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar/${producto.id}`, producto);
  }

  updateProductStock(requestBody: {
    productos: Array<{
      id: number,
      cantidad: number,
      precio_unitario: number,
      tipo_precio: string
    }>,
    detalleVenta: {
      tipo_venta: string,
      tipo_entrega: string,
      dni_cliente: string,
      pagos: Array<{
        metodo: string,
        monto: number,
        estado: string
      }>
    }
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/stock`, requestBody);
  }
  
}