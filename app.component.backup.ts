import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/shared/toast/toast.component';
import { FloatingThemeButtonComponent } from './components/shared/floating-theme-button/floating-theme-button.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    TopNavbarComponent,
    FooterComponent,
    ToastComponent,
    FloatingThemeButtonComponent,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'padma-giftz';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Initialize theme service (this will load saved theme)
    console.log('App initialized - theme service loaded');
    console.log('Current theme:', this.themeService.getCurrentTheme());

    // Subscribe to theme changes to verify they're working
    this.themeService.theme$.subscribe(theme => {
      console.log('Theme changed to:', theme);
    });

    // Check authentication status on app load
    console.log("App initialization - Auth status:", this.authService.isAuthenticated());

    // Check for authentication state consistency
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('currentUser');

    if (this.authService.isAuthenticated()) {
      console.log("User is authenticated, refreshing user data");
      // Refresh user data to ensure consistency
      this.authService.getCurrentUser().subscribe({
        next: (userData) => {
          console.log("User data refreshed successfully:", userData);
        },
        error: (error) => {
          console.error("Error refreshing user data:", error);
          // If there's an error fetching user data with a valid token,
          // it might mean the token is expired or invalid
          if (error.status === 401) {
            console.log("Invalid token detected, logging out");
            this.authService.logout();
          }
        }
      });
    } else if (token) {
      console.warn("Token exists but auth check failed, clearing inconsistent state");
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  }
}
