import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Product } from './cart.service';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, filter, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = environment.apiUrl;
  private wishlistItemsSubject = new BehaviorSubject<Product[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    // Load wishlist from localStorage if available
    this.loadWishlist();
    
    // Subscribe to auth state changes
    this.authService.currentUser.pipe(
      filter(user => user === null) // Only react to logout
    ).subscribe(() => {
      // Clear wishlist when user logs out
      this.clearWishlist();
    });
  }

  private loadWishlist(): void {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistItemsSubject.next(JSON.parse(savedWishlist));
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItemsSubject.value));
  }

  getWishlistItems(): Product[] {
    return this.wishlistItemsSubject.value;
  }

  getWishlistItemCount(): number {
    return this.wishlistItemsSubject.value.length;
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItemsSubject.value.some(item => item.id === productId);
  }

  addToWishlist(product: Product): boolean {
    const currentWishlist = this.wishlistItemsSubject.value;
    
    // Check if product is already in wishlist
    if (currentWishlist.some(item => item.id === product.id)) {
      return false;
    }

    const updatedWishlist = [...currentWishlist, product];
    this.wishlistItemsSubject.next(updatedWishlist);
    this.saveToLocalStorage();
    
    // If user is logged in, sync with server
    if (this.authService.isAuthenticated()) {
      this.syncWishlistToServer().subscribe({
        error: (err) => console.log('Failed to sync wishlist, but item was added locally')
      });
    }
    
    return true;
  }

  removeFromWishlist(productId: number): void {
    const updatedWishlist = this.wishlistItemsSubject.value.filter(item => item.id !== productId);
    this.wishlistItemsSubject.next(updatedWishlist);
    this.saveToLocalStorage();
    
    // If user is logged in, sync with server
    if (this.authService.isAuthenticated()) {
      this.syncWishlistToServer().subscribe({
        error: (err) => console.log('Failed to sync wishlist, but item was removed locally')
      });
    }
  }

  clearWishlist(): void {
    this.wishlistItemsSubject.next([]);
    this.saveToLocalStorage();
    
    // If user is logged in, sync with server, but don't wait for result
    if (this.authService.isAuthenticated()) {
      // Use silent error handling here since this is often called during logout
      this.syncWishlistToServer().subscribe({
        error: () => {} // Silent error handling
      });
    }
  }

  // Sync wishlist to server
  syncWishlistToServer() {
    // Skip if no items or if API isn't implemented yet
    if (this.wishlistItemsSubject.value.length === 0) {
      return of({ success: true, message: 'No items to sync' });
    }
    
    const wishlistItems = this.wishlistItemsSubject.value;
    const productIds = wishlistItems.map(item => item.id);
    
    return this.http.post<any>(`${this.apiUrl}/wishlist/sync`, { items: productIds })
      .pipe(
        tap(response => {
          console.log('Wishlist synced with server:', response);
        }),
        catchError(error => {
          // Gracefully handle 404 errors (endpoint not implemented yet)
          console.log('Note: Wishlist sync API returned error (may not be implemented yet):', error.status);
          return of({ success: false, message: 'API not implemented yet' });
        })
      );
  }

  // Fetch wishlist from server
  fetchWishlistFromServer() {
    return this.http.get<any>(`${this.apiUrl}/wishlist`)
      .pipe(
        tap(response => {
          if (response && response.data && Array.isArray(response.data.items)) {
            this.wishlistItemsSubject.next(response.data.items);
            this.saveToLocalStorage();
          }
        }),
        catchError(error => {
          // Gracefully handle 404 errors (endpoint not implemented yet)
          console.log('Note: Wishlist fetch API returned error (may not be implemented yet):', error.status);
          return of({ success: false, message: 'API not implemented yet' });
        })
      );
  }

  // Toggle wishlist item (add if not in wishlist, remove if already there)
  toggleWishlistItem(product: Product): boolean {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
      return false;
    } else {
      this.addToWishlist(product);
      return true;
    }
  }
}
