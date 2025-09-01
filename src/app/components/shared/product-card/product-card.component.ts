import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Interface for product data
export interface DisplayProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  imageUrl: string;
  badge?: string | null;
  badgeIcon?: string | null;
  quantity: number;
  showQuantity: boolean;
  isWishlisted?: boolean;
  productFeatures: {
    icon: string;
    text: string;
  }[];
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: DisplayProduct;

  @Output() addToCartClicked = new EventEmitter<DisplayProduct>();
  @Output() incrementQuantityClicked = new EventEmitter<DisplayProduct>();
  @Output() decrementQuantityClicked = new EventEmitter<DisplayProduct>();
  @Output() viewDetailsClicked = new EventEmitter<DisplayProduct>();
  @Output() toggleWishlistClicked = new EventEmitter<{product: DisplayProduct, event: Event}>();

  constructor(private router: Router) {}

  addToCart(): void {
    this.addToCartClicked.emit(this.product);
  }

  incrementQuantity(): void {
    this.incrementQuantityClicked.emit(this.product);
  }

  decrementQuantity(): void {
    this.decrementQuantityClicked.emit(this.product);
  }

  viewProductDetails(): void {
    this.viewDetailsClicked.emit(this.product);
  }

  toggleWishlist(event: Event): void {
    this.toggleWishlistClicked.emit({product: this.product, event});
  }

  getBadgeClass(badge: string | null): string {
    if (!badge) return '';

    switch (badge.toLowerCase()) {
      case 'new':
        return 'badge-new';
      case 'popular':
        return 'badge-popular';
      case 'sale':
        return 'badge-sale';
      case 'limited':
        return 'badge-limited';
      case 'best seller':
        return 'badge-bestseller';
      default:
        return '';
    }
  }
}
