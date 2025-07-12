import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  login(email: string, passwd: string): Observable<Usuario> {
    return this.http.post<{
      token: string, 
      usuario: Usuario
    }>(`${environment.API_URL}/api/empleados/login`, { email, passwd })
      .pipe(
        map(response => {
          console.log('Login Response:', response);
          
          if (!response.token || !response.usuario) {
            throw new Error('Invalid login response');
          }
  
          // Store token, user and login time
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          localStorage.setItem('token', response.token);
          localStorage.setItem('loginTime', Date.now().toString());
          
          // Parse token to get expiration
          const tokenData = JSON.parse(atob(response.token.split('.')[1]));
          localStorage.setItem('tokenExpiration', (tokenData.exp * 1000).toString());
          
          this.currentUserSubject.next(response.usuario);
          return response.usuario;
        }),
        catchError(error => {
          console.error('Login Error:', error);
          localStorage.clear(); // Clear any partial data on error
          return throwError(() => error);
        })
      );
  }
  

  logout() {
    // Eliminar usuario del localStorage y resetear el current user
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // Método para obtener el token de autenticación
  getAuthToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Retrieved Token:', token); // Debug log
    return token;
  }

  // Verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }
}
