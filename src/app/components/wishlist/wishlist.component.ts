import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WishlistService } from '../../services/wishlist.service';
import { CartService, Product } from '../../services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];
  
  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Get wishlist items
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItems = items;
    });
  }
  
  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.id);
  }
  
  addToCart(product: Product): void {
    const success = this.cartService.addToCart(product);
    if (success) {
      // Optionally remove from wishlist after adding to cart
      // this.wishlistService.removeFromWishlist(product.id);
    }
  }
  
  viewProductDetails(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }
  
  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      this.wishlistService.clearWishlist();
    }
  }
}
