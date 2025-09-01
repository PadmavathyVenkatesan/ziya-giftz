import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const toastService = inject(ToastService);

  // Skip authentication for login/register endpoints
  const isAuthEndpoint = req.url.includes('/auth/login') ||
                          req.url.includes('/auth/signup') ||
                          req.url.includes('/auth/send-otp') ||
                          req.url.includes('/auth/verify-otp');

  if (token && !isAuthEndpoint) {
    console.log(`Adding auth token to ${req.url} (token starts with: ${token.substring(0, 10)}...)`);

    // Always add Bearer prefix consistently
    const authHeader = `Bearer ${token}`;

    req = req.clone({
      setHeaders: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Final Authorization header: ${authHeader.substring(0, 20)}...`);
  } else if (!isAuthEndpoint) {
    console.warn(`No token available for authenticated request to ${req.url}`);
  }

  return next(req).pipe(
    tap(response => {
      if (req.url.includes('/auth/verify-otp') || req.url.includes('/auth/login') || req.url.includes('/auth/signup')) {
        console.log(`Auth request to ${req.url} completed successfully`);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error(`HTTP error for ${req.url}:`, error);

      // Handle 401 Unauthorized errors - typically expired or invalid token
      if (error.status === 401) {
        console.log("401 Unauthorized error - clearing auth data", error.error);

        // Only clear auth data and redirect if this wasn't an initial auth request
        if (!isAuthEndpoint) {
          // Clear local storage
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');

          // Redirect to login page with return URL
          const currentUrl = router.url;
          router.navigate(['/login'], {
            queryParams: { returnUrl: currentUrl !== '/login' ? currentUrl : '/profile' }
          });

          // Show toast to user
          setTimeout(() => {
            toastService.error('Your session has expired. Please log in again.', 'Session Expired');
          }, 100);
        }
      }

      return throwError(() => error);
    })
  );
};
