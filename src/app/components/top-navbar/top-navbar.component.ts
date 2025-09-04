import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { WishlistService } from '../../services/wishlist.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  wishlistItemCount = 0;
  private wishlistSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    // Set up search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value) {
          this.search(value);
        }
      });
  }

  ngOnInit(): void {
    console.log('🔄 TopNavbar ngOnInit - initializing');

    // Subscribe to wishlist changes
    this.wishlistSubscription = this.wishlistService.wishlistItems$.subscribe(items => {
      console.log('🛍️ Wishlist items received:', items);
      console.log('🔢 Setting wishlistItemCount to:', items.length);
      this.wishlistItemCount = items.length;

      // Force change detection
      this.cdr.detectChanges();
      console.log('🔄 Change detection triggered');
    });

    // Get initial count
    const initialCount = this.wishlistService.getWishlistItemCount();
    console.log('🔢 Initial wishlist count:', initialCount);
    this.wishlistItemCount = initialCount;

    // Check localStorage for debugging
    const savedWishlist = localStorage.getItem('wishlist');
    console.log('💾 localStorage wishlist:', savedWishlist);

    // If user is logged in, fetch wishlist from server
    if (this.authService.isAuthenticated()) {
      this.wishlistService.fetchWishlistFromServer().subscribe({
        next: (response) => {
          console.log('✅ Wishlist synced from server');
        },
        error: (error) => {
          console.warn('❌ Could not sync wishlist from server, using local data');
        }
      });
    }
  }  ngOnDestroy(): void {
    // Clean up subscription
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  // Navigate to a route
  navigateTo(route: string): void {
    this.router.navigate(['/' + route]);
  }

  // Search functionality
  search(query: string | null): void {
    // Only navigate if query is not null or empty
    if (query && query.trim()) {
      // Navigate to home with search parameter
      this.router.navigate(['/home'], {
        queryParams: { search: query }
      });
    }
  }

  // Toggle search bar visibility
  toggleSearch(): void {
    // Implement search toggle functionality if needed
    console.log('Toggle search');
  }
}
