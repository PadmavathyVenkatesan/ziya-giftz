import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
class AdminGuardService {
  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.adminService.isAdminLoggedIn()) {
      return true;
    }

    // If not admin, redirect to admin login
    this.router.navigate(['/admin/login']);
    return false;
  }
}

export const adminGuard: CanActivateFn = (route, state) => {
  return inject(AdminGuardService).canActivate();
};
