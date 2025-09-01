import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  badge?: string | null;
  discount?: string;
  originalPrice?: number;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private authService: AuthService) {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
    
    // Subscribe to auth state changes
    this.authService.currentUser.pipe(
      filter(user => user === null) // Only react to logout
    ).subscribe(() => {
      // Clear cart when user logs out
      this.clearCart();
    });
  }

  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Maximum quantity allowed per item
  readonly MAX_QUANTITY = 25;

  addToCart(product: Product, quantity: number = 1): boolean {
    const currentCart = this.cartItemsSubject.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    let updatedCart: CartItem[];
    let success = true;

    if (existingItem) {
      // Check if adding would exceed limit
      if (existingItem.quantity + quantity > this.MAX_QUANTITY) {
        // Set to maximum and return false to indicate limit reached
        updatedCart = currentCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: this.MAX_QUANTITY } 
            : item
        );
        success = false;
      } else {
        // Update quantity of existing item
        updatedCart = currentCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
    } else {
      // Add new item (capped at MAX_QUANTITY)
      const newQuantity = Math.min(quantity, this.MAX_QUANTITY);
      success = newQuantity === quantity;
      
      updatedCart = [
        ...currentCart,
        { ...product, quantity: newQuantity }
      ];
    }

    this.cartItemsSubject.next(updatedCart);
    this.saveToLocalStorage();
    return success;
  }

  updateQuantity(productId: number, quantity: number): boolean {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return true;
    }

    // Enforce maximum quantity
    if (quantity > this.MAX_QUANTITY) {
      quantity = this.MAX_QUANTITY;
      // Return false to indicate limit reached
      return false;
    }

    const updatedCart = this.cartItemsSubject.value.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );

    this.cartItemsSubject.next(updatedCart);
    this.saveToLocalStorage();
    return true;
  }

  removeFromCart(productId: number): void {
    const updatedCart = this.cartItemsSubject.value.filter(item => item.id !== productId);
    this.cartItemsSubject.next(updatedCart);
    this.saveToLocalStorage();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveToLocalStorage();
  }
}
