import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Category } from '../../services/product.service';
import { CartService, Product } from '../../services/cart.service';
import { MinimumOrderBannerComponent } from '../shared/minimum-order-banner/minimum-order-banner.component';
import { AssetService } from '../../services/asset.service';
import { WishlistService } from '../../services/wishlist.service';
import { switchMap } from 'rxjs/operators';

interface DisplayProduct {
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
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MinimumOrderBannerComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss', './product-fixes.scss']
})
export class ProductListComponent implements OnInit {
  selectedCategory: string = 'All';
  categories: string[] = [];
  topCategories: Category[] = [];
  products: DisplayProduct[] = [];
  isLoading: boolean = false;
  isLoadingMore: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private assetService: AssetService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.categories = this.productService.getCategories();
    this.topCategories = this.productService.getTopCategories();

    // Process route params (for category routes)
    this.route.url.subscribe(segments => {
      if (segments.length > 1 && segments[0].path === 'category') {
        // Convert URL format back to display format (e.g., 'wooden-plaques' -> 'Wooden Plaques')
        const categoryFromUrl = segments[1].path
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Set the category in the service
        this.productService.setSelectedCategory(categoryFromUrl);
      }
    });

    // Subscribe to route query params to handle search
    this.route.queryParams.pipe(
      switchMap(params => {
        const searchQuery = params['search'];
        if (searchQuery) {
          return this.productService.searchProducts(searchQuery);
        } else {
          return this.productService.getFilteredProducts(this.selectedCategory);
        }
      })
    ).subscribe(products => {
      this.products = products.map(product => this.mapToDisplayProduct(product));
    });

    // Subscribe to category changes
    this.productService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category;
      this.productService.getFilteredProducts(category).subscribe(products => {
        this.products = products.map(product => this.mapToDisplayProduct(product));
      });
    });

    // Subscribe to cart changes to update product quantities
    this.cartService.cartItems$.subscribe(cartItems => {
      // Update quantities for all displayed products
      this.products.forEach(product => {
        const cartItem = cartItems.find(item => item.id === product.id);
        product.quantity = cartItem ? cartItem.quantity : 0;
        product.showQuantity = product.quantity > 0;
      });
    });
  }

  mapToDisplayProduct(product: Product): DisplayProduct {
    // Use the product's discount and original price if available, otherwise calculate fake ones
    let discount = 10; // Default discount
    if (product.discount) {
      // Remove any non-numeric characters and parse as integer
      discount = parseInt(product.discount.replace(/\D/g, ''));
    }
    const originalPrice = product.originalPrice || Math.round(product.price * (100 / (100 - discount)));

    // Get quantity from cart if exists
    const cartItem = this.cartService.getCartItems().find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    // Add product features with emoji icons instead of SVG files
    const productFeatures = [
      {
        icon: '🎁', // Gift box emoji
        text: 'Premium Packaging'
      },
      {
        icon: '🚚', // Truck emoji
        text: 'Free Shipping'
      },
      {
        icon: '⏱️', // Stopwatch emoji
        text: '24-48 hr Delivery'
      }
    ];

    // Add customization feature for specific products
    if (product.name.includes('Custom') || product.name.includes('Birthday') || product.name.includes('Wedding') || product.name.includes('Personalized') || product.name.includes('Engraved')) {
      productFeatures.push({
        icon: '✏️', // Pencil emoji
        text: 'Customization Available'
      });
    }

    // Check if product is in wishlist
    const isWishlisted = this.wishlistService.isInWishlist(product.id);

    // Validate image URL before assigning
    const imageUrl = product.image || this.assetService.getImagePath('default');

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: originalPrice,
      discount: `${discount}%`,
      imageUrl: imageUrl, // Make sure this matches the image field from the Product model
      badge: product.badge,
      badgeIcon: null,
      quantity: quantity,
      showQuantity: quantity > 0,
      isWishlisted: isWishlisted,
      productFeatures: productFeatures
    };
  }

  selectCategory(category: string): void {
    // If category doesn't exist in our filter pills, default to 'All'
    if (!this.categories.includes(category)) {
      category = 'All';
    }
    this.selectedCategory = category;
    this.productService.setSelectedCategory(category);

    // Scroll to products section
    setTimeout(() => {
      document.querySelector('.product-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  navigateToCategory(categoryName: string): void {
    // Map the category name from the top categories to a category in our filter
    // For now, we'll just set to 'All' since we don't have an exact match
    this.selectCategory('All');

    // In a real application, you would implement logic to map the top category
    // to one of your filter categories, or create a dedicated route/filter for it
  }

  addToCart(product: DisplayProduct): void {
    // If first time adding, set quantity to 1 and show controls
    if (product.quantity === 0) {
      product.quantity = 1;
      product.showQuantity = true;

      // Convert DisplayProduct back to Product format
      const cartProduct: Product = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        badge: product.badge,
        discount: product.discount,
        originalPrice: product.originalPrice
      };

      this.cartService.addToCart(cartProduct);
    } else {
      // Product already in cart, increment quantity if possible
      this.incrementQuantity(product);
    }
  }

  incrementQuantity(product: DisplayProduct): void {
    if (product.quantity < this.cartService.MAX_QUANTITY) {
      product.quantity++;
      this.cartService.updateQuantity(product.id, product.quantity);
    }
  }

  decrementQuantity(product: DisplayProduct): void {
    if (product.quantity > 0) {
      product.quantity--;

      if (product.quantity === 0) {
        // Hide quantity controls when quantity reaches zero
        product.showQuantity = false;
        this.cartService.removeFromCart(product.id);
      } else {
        this.cartService.updateQuantity(product.id, product.quantity);
      }
    }
  }

  viewProductDetails(product: DisplayProduct): void {
    this.router.navigate(['/product', product.id]);
  }

  loadMore(): void {
    this.isLoadingMore = true;

    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would fetch more products from an API
      this.isLoadingMore = false;
    }, 1000);
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

  toggleWishlist(product: DisplayProduct, event: Event): void {
    // Stop the event from propagating to prevent navigation to product detail
    event.stopPropagation();

    // Convert DisplayProduct to Product for the wishlist service
    const wishlistProduct: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      badge: product.badge,
      discount: product.discount,
      originalPrice: product.originalPrice
    };

    // Toggle the wishlist using the service
    product.isWishlisted = this.wishlistService.toggleWishlistItem(wishlistProduct);

    // Show a notification for better UX
    const action = product.isWishlisted ? 'added to' : 'removed from';
    console.log(`Product ${product.name} ${action} wishlist!`);
  }

  // Handle image loading errors by replacing with a placeholder image
  handleImageError(event: Event): void {
    // Use asset service to handle the error and get a placeholder image
    this.assetService.handleImageError(event);
  }
}
