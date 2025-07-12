import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface Cliente {
  dni_cliente: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  calle: string;
  numero: string;
  distrito: string;
  referencia: string;
  metodo_pago: string;
  tipo_entrega: string;
  notas: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = environment.API_URL + '/api/clientes';

  constructor(private http: HttpClient) { }

  getClientes(page: number = 1, limit: number = 10, searchTerm: string = ''): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchTerm', searchTerm);

    return this.http.get<{
      success: boolean,
      totalClientes: number,
      totalPages: number,
      currentPage: number,
      pageSize: number,
      clientes: Array<{
        dni_cliente: number,
        nombre: string,
        apellido: string,
        email: string,
        telefono: string,
        calle: string,
        numero: string,
        distrito: string,
        referencia: string,
        metodo_pago: string,
        tipo_entrega: string,
        notas: string
      }>
    }>(this.apiUrl, { params });
  }

  createCliente(clienteData: Partial<Cliente>): Observable<any> {
    const cliente = {
      dni_cliente: clienteData.dni_cliente || '',
      nombre: clienteData.nombre || '',
      apellido: clienteData.apellido || '',
      email: clienteData.email || null ,
      telefono: clienteData.telefono || '',
      calle: clienteData.calle || '',
      numero: clienteData.numero || '',
      distrito: clienteData.distrito || '',
      referencia: clienteData.referencia || '',
      metodo_pago: clienteData.metodo_pago || 'efectivo',
      tipo_entrega: clienteData.tipo_entrega || 'recojo',
      notas: clienteData.notas || ''
    };

    return this.http.post(this.apiUrl, cliente);
  }

  editarCliente(dni_cliente: string, clienteData: Partial<Cliente>): Observable<any> {
    const url = `${this.apiUrl}/${dni_cliente}`;
    return this.http.put(url, {
      nombre: clienteData.nombre,
      apellido: clienteData.apellido,
      email: clienteData.email,
      telefono: clienteData.telefono,
      calle: clienteData.calle,
      numero: clienteData.numero,
      distrito: clienteData.distrito,
      referencia: clienteData.referencia,
      metodo_pago: clienteData.metodo_pago,
      tipo_entrega: clienteData.tipo_entrega,
      notas: clienteData.notas
    });
  }

}
