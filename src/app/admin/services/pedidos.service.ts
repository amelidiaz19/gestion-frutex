import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Pedido {
  id: number;
  fecha: Date;
  estado: 'en_proceso' | 'confirmado' | 'entregado' | 'anulado';
  total: number;
  metodoPago: string;
  tipoEntrega: string;
  notas: string;
  cliente: {
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
  items: {
    id_producto: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    tipo_venta: string;
    subtotal: number;
  }[];
}

export interface PedidosResponse {
  success: boolean;
  totalPedidos: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  pedidos: Pedido[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = environment.API_URL + '/api/pedido';

  constructor(private http: HttpClient) { }

  getAllPedidos(page: number = 1, limit: number = 10, searchTerm: string = ''): Observable<PedidosResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PedidosResponse>(`${this.apiUrl}/todos`, { params });
  }

  updatePedidoStatus(id: number, estado: Pedido['estado']): Observable<{success: boolean, message: string}> {
    return this.http.put<{success: boolean, message: string}>(`${this.apiUrl}/actualizar/${id}`, { estado });
  }
}
