import { 
  HttpInterceptorFn, 
  HttpRequest, 
  HttpHandlerFn, 
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './admin/services/auth.service';
import { Router } from '@angular/router';

function handleSessionExpiration(authService: AuthService, router: Router) {
  // Clear all storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Logout user
  authService.logout();
  
  // Force redirect to login
  router.navigate(['/'], {
    queryParams: { 
      sessionExpired: 'true',
      message: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.'
    },
    replaceUrl: true
  });
}

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAuthToken();
  const loginTime = localStorage.getItem('loginTime');

  // Check if 12 hours have passed since login
  if (loginTime && token) {
    const timeElapsed = Date.now() - parseInt(loginTime);
    const hoursElapsed = timeElapsed / (1000 * 60 * 60);

    if (hoursElapsed >= 12) {
      handleSessionExpiration(authService, router);
      return throwError(() => new Error('Token expirado'));
    }

    // Verify token structure and expiration
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (tokenData.exp * 1000 < Date.now()) {
        handleSessionExpiration(authService, router);
        return throwError(() => new Error('Token expirado'));
      }
    } catch (e) {
      console.error('Error al verificar token:', e);
      handleSessionExpiration(authService, router);
      return throwError(() => new Error('Token inválido'));
    }

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', {
        status: error.status,
        message: error.message,
        url: error.url
      });

      if (error.status === 401 || error.status === 403) {
        handleSessionExpiration(authService, router);
      }
      
      return throwError(() => error);
    })
  );
};