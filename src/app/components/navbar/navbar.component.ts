import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0;
  isLoggedIn = false;
  isAdminLoggedIn = false;
  currentUser: any = null;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });

    // Subscribe to auth state changes
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      // Check if user is admin
      this.isAdminLoggedIn = user?.role === 'admin' || user?.isAdmin === true;
    });

    // Check localStorage for admin status on init
    const isAdminFromStorage = localStorage.getItem('isAdmin') === 'true';
    if (isAdminFromStorage) {
      this.isAdminLoggedIn = true;
    }

    // Subscribe to router events to scroll to top on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.scrollToTop();
    });
  }

  isActive(route: string): boolean {
    if (route === 'home') {
      return this.router.url === '/' || this.router.url === '/home';
    }
    if (route === 'profile') {
      return this.router.url === '/profile';
    }
    if (route === 'admin') {
      return this.router.url.includes('/admin');
    }
    return this.router.url.includes(route);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navigate and ensure we scroll to top
  navigateTo(route: string): void {
    if (route === 'logout') {
      this.logout();
      return;
    }

    if (this.router.url === '/' + route || (route === 'home' && this.router.url === '/')) {
      // If we're already on this route, just scroll to top
      this.scrollToTop();
    } else {
      // Otherwise navigate to the route (which will trigger scrollToTop via the subscription)
      this.router.navigate([route]);
    }
  }

  logout(): void {
    this.authService.logout();
    // Navigation will be handled by the auth service
  }
}
