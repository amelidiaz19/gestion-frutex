import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.API_URL + '/api/empleados';
  private api2Url = environment.API_URL + '/api/historial';
  
  constructor(private http: HttpClient) { }
  
  getUsuarios():Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }

  getHistorial(UsuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api2Url}/${UsuarioId}`);
  }

  registrarUsuario(usuario: {
    dni_empleado: string;
    nombre: string;
    apellido: string;
    email: string;
    passwd: string;
    usuario: {
      id: number;
    }
  }): Observable<{
    success: boolean;
    message: string;
    id_usuario?: number;
    error?: string;
  }> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, usuario);
  }
}
