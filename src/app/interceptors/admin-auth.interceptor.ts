import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const adminAuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Check if this is an admin API request
  if (req.url.includes('/admin/')) {
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminToken) {
      // Clone the request and add the authorization header
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${adminToken}`)
      });
      return next(authReq);
    }
  }
  
  return next(req);
};
