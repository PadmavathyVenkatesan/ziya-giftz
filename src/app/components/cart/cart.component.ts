import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { MinimumOrderBannerComponent } from '../shared/minimum-order-banner/minimum-order-banner.component';
import { OrderConfigService } from '../../services/order-config.service';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MinimumOrderBannerComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', './cart-fixes.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = true;
  minimumOrderAmount: number;

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderConfigService: OrderConfigService,
    private assetService: AssetService
  ) {
    this.minimumOrderAmount = this.orderConfigService.minimumOrderAmount;
  }

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.isLoading = false;
    });
  }

  maxQuantityReached: { [key: number]: boolean } = {};
  
  incrementQuantity(item: CartItem): void {
    if (item.quantity >= this.cartService.MAX_QUANTITY) {
      this.maxQuantityReached[item.id] = true;
      setTimeout(() => {
        this.maxQuantityReached[item.id] = false;
      }, 2000);
      return;
    }
    
    const success = this.cartService.updateQuantity(item.id, item.quantity + 1);
    if (!success) {
      this.maxQuantityReached[item.id] = true;
      setTimeout(() => {
        this.maxQuantityReached[item.id] = false;
      }, 2000);
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
      // Clear any max quantity messages when reducing quantity
      if (this.maxQuantityReached[item.id]) {
        this.maxQuantityReached[item.id] = false;
      }
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  getTotalPrice(): number {
    return this.cartService.getCartTotal();
  }

  getDeliveryCharge(): number {
    // Free delivery over 1000, otherwise 99
    return this.getTotalPrice() > 1000 ? 0 : 99;
  }

  getGrandTotal(): number {
    return this.getTotalPrice() + this.getDeliveryCharge();
  }

  getTotalSavings(): number {
    // Calculate based on a hypothetical 20% discount
    return Math.round(this.getTotalPrice() * 0.2);
  }

  checkout(): void {
    console.log('Proceeding to checkout with items:', this.cartItems);
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/home']);
  }
  
  handleImageError(event: any): void {
    // Use asset service to handle the error and get a placeholder image
    this.assetService.handleImageError(event);
  }
}
