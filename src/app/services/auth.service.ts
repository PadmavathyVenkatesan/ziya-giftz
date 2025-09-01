import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Check if phone number exists in the system
  checkPhoneExists(phone: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/check-phone`, { phone });
  }

  // Phone login - Step 1: Send OTP
  sendOtp(phone: string, countryCode: string = ''): Observable<any> {
    // If countryCode is provided and phone doesn't have it, add it
    const fullPhone = (countryCode && !phone.includes('+')) ? countryCode + phone : phone;
    console.log(`Sending OTP to: ${fullPhone}`);
    return this.http.post<any>(`${this.apiUrl}/auth/send-otp`, { phone: fullPhone });
  }

  // Phone login - Step 2: Verify OTP
  verifyOtp(phone: string, countryCode: string = '', code: string): Observable<any> {
    // If countryCode is provided and phone doesn't have it, add it
    const fullPhone = (countryCode && !phone.includes('+')) ? countryCode + phone : phone;
    console.log(`Verifying OTP for phone: ${fullPhone}`);
    return this.http.post<any>(`${this.apiUrl}/auth/verify-otp`, { phone: fullPhone, code })
      .pipe(
        tap(response => {
          console.log("OTP verification response from API:", response);

          // Special token handling for OTP verification
          if (response && response.token) {
            console.log("Token received in OTP verification, storing it");
            this.handleAuthSuccess(response);

            // If we have a token but no user data in response, try to get user data
            if ((!response.user || !response.data?.user) && localStorage.getItem('token')) {
              console.log("No user data in OTP response, checking if user exists");
              // We'll let the login component handle this based on the response
            }
          } else if (response && response.verified === true) {
            if (response.user === false || response.user === null) {
              console.log("Phone verified but user doesn't exist (needs registration)");
            } else {
              console.warn("Phone verified but no token received (unusual state)");
            }
          } else {
            console.error("Unexpected response format from verify-otp:", response);
          }
        })
      );
  }

  // Traditional login with email/password
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.handleAuthSuccess(response);
          }
        })
      );
  }

  // Register a new user
  register(user: any, isPhoneVerified: boolean = false): Observable<any> {
    console.log("Registering user:", user);
    return this.http.post<any>(`${this.apiUrl}/auth/signup`, user)
      .pipe(
        tap(response => {
          console.log("Registration response:", response);
          if (response && response.token) {
            this.handleAuthSuccess(response);
          }
        })
      );
  }

  // Handle successful authentication
  private handleAuthSuccess(response: any): void {
    console.log("Authentication successful:", response);

    // Check response structure to handle different API response formats
    if (response && response.token) {
      // Store raw token without Bearer prefix
      localStorage.setItem('token', response.token);

      // Handle different response structures
      if (response.data && response.data.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        this.currentUserSubject.next(response.data.user);
      } else if (response.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      } else if (response.status === 'success' && response.data?.user) {
        // Handle nested data structure
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        this.currentUserSubject.next(response.data.user);
      } else {
        // If we don't have user data yet, but we have a token, we'll fetch it later
        console.log("No user data in response, will fetch with token later");
        // Try to immediately fetch user data
        this.refreshUserData().subscribe({
          next: (userData) => console.log("User data fetched successfully"),
          error: (err) => console.error("Failed to fetch user data:", err)
        });
      }

      // Double check token was stored correctly
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        console.log("Token stored in localStorage:", storedToken.substring(0, 20) + '...');
      } else {
        console.error("Failed to store token in localStorage! Retrying...");
        localStorage.setItem('token', response.token);
        // Check again
        if (!localStorage.getItem('token')) {
          console.error("CRITICAL: Still failed to store token after retry!");
        }
      }
    } else {
      console.error("No token found in authentication response");
    }
  }

  // Logout the user
  logout(): void {
    // Optional: Call the backend to invalidate token
    this.http.get(`${this.apiUrl}/auth/logout`).subscribe({
      next: () => this.handleLogout(),
      error: () => this.handleLogout()
    });
  }

  // Handle logout cleanup
  private handleLogout(): void {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');

    // Clear cart and wishlist data from localStorage directly
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');

    // Emit a logout event for other services to react to
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!localStorage.getItem('token');
  }

  // Get current user's token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Debug authentication state
  debugAuthState(): void {
    console.group('Auth State Debug');
    console.log('Token exists:', !!this.getToken());
    if (this.getToken()) {
      console.log('Token (first 20 chars):', this.getToken()?.substring(0, 20) + '...');
    }
    console.log('Current user exists:', !!this.currentUserValue);
    console.log('Is authenticated:', this.isAuthenticated());
    console.groupEnd();
  }

  // Create auth interceptor function
  authInterceptor(req: any, next: any): any {
    const token = this.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next(req);
  }

  // Refresh user data
  refreshUserData(): Observable<any> {
    console.log("Refreshing user data - token:", localStorage.getItem('token')?.substring(0, 20) + '...');
    return this.http.get<any>(`${this.apiUrl}/auth/me`)
      .pipe(
        tap(response => {
          console.log("User data refresh response:", response);

          if (response && response.data && response.data.user) {
            // Standard response format
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
            console.log("User data updated from API response");
          } else if (response && response.user) {
            // Alternative response format
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
            console.log("User data updated from API response (alternative format)");
          } else {
            console.warn("User data not found in API response format");

            // If no user is returned but we still have a token, try to use existing data
            const currentUser = this.currentUserValue;
            if (!currentUser && localStorage.getItem('token')) {
              // We have a token but no user data - try to load from localStorage
              const storedUser = localStorage.getItem('currentUser');
              if (storedUser) {
                console.log("Using locally stored user data");
                this.currentUserSubject.next(JSON.parse(storedUser));
              }
            }
          }
        })
      );
  }

  // Update password
  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/auth/update-password`, {
      currentPassword,
      password: newPassword,
      passwordConfirm: newPassword
    });
  }

  // Reset password (forgot password)
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  // Reset password with token
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, {
      token,
      newPassword
    });
  }

  // Update user profile
  updateProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/auth/profile`, profileData)
      .pipe(
        tap(response => {
          if (response && response.success && response.user) {
            // Update current user data
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }
}
