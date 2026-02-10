import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip adding token for login endpoint
  if (req.url.includes('/api/auth/login')) {
    return next(req);
  }

  // Get token from AuthService
  const token = authService.getToken();

  // Clone request and add Authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch 401 errors
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token expired or invalid - logout and redirect to login
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
