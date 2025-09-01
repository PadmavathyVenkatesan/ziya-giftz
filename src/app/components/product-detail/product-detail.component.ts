import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService, Product } from '../../services/cart.service';
import { AssetService } from '../../services/asset.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss', './product-detail-fixes.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity: number = 1;
  loading: boolean = true;
  addingToCart: boolean = false;
  maxQuantityReached: boolean = false;
  relatedProducts: Product[] = [];
  isInWishlist: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private assetService: AssetService,
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.loading = false;
          this.loadRelatedProducts();

          // Check if product is in wishlist
          this.isInWishlist = this.wishlistService.isInWishlist(product.id);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.loading = false;
        this.router.navigate(['/home']);
      }
    });
  }

  loadRelatedProducts(): void {
    if (this.product) {
      this.productService.getFilteredProducts('All').subscribe(products => {
        this.relatedProducts = products
          .filter(p => p.id !== this.product!.id)
          .slice(0, 4);
      });
    }
  }

  incrementQuantity(): void {
    if (this.quantity < this.cartService.MAX_QUANTITY) {
      this.quantity++;
      this.maxQuantityReached = false;
    } else {
      this.maxQuantityReached = true;
      setTimeout(() => {
        this.maxQuantityReached = false;
      }, 2000);
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.maxQuantityReached = false;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.addingToCart = true;
      setTimeout(() => {
        const success = this.cartService.addToCart(this.product!, this.quantity);
        this.addingToCart = false;

        if (success) {
          // Show success message
          this.toastService.success('Product added to cart!', 'Cart Updated');
        } else {
          // Show max quantity reached message
          this.maxQuantityReached = true;
          setTimeout(() => {
            this.maxQuantityReached = false;
          }, 2000);
          this.toastService.warning('Maximum quantity limit reached (25 items per product)!', 'Quantity Limit');
        }
      }, 500);
    }
  }

  buyNow(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.router.navigate(['/checkout']);
    }
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  handleImageError(event: any): void {
    // Use asset service to handle the error and get a placeholder image
    this.assetService.handleImageError(event);
  }

  toggleWishlist(): void {
    if (this.product) {
      this.isInWishlist = this.wishlistService.toggleWishlistItem(this.product);
    }
  }
}
