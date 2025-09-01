import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from './cart.service';
import { AssetService } from './asset.service';

export interface Category {
  name: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Mock categories with images
  private categories: string[] = [
    'All', 'Wooden Plaques', 'Return Gifts', 'Name Customized Items',
    'Customized Wallet', 'Fridge Magnets', 'Photo Customized Gifts', 'Combo Gifts'
  ];

  // Top categories with images for display
  private topCategories: Category[] = [];

  constructor(private assetService: AssetService) {
    // Initialize top categories with placeholder images from the real website
    this.topCategories = [
      {
        name: 'Home',
        imageUrl: this.assetService.getProductImage('Home')
      },
      {
        name: 'Wooden Plaques',
        imageUrl: this.assetService.getProductImage('Wooden Plaques')
      },
      {
        name: 'Return Gifts',
        imageUrl: this.assetService.getProductImage('Return Gifts')
      },
      {
        name: 'Name Customized Items',
        imageUrl: this.assetService.getProductImage('Name Customized Items')
      },
      {
        name: 'Customized Wallet',
        imageUrl: this.assetService.getProductImage('Customized Wallet')
      },
      {
        name: 'Fridge Magnets',
        imageUrl: this.assetService.getProductImage('Fridge Magnets')
      },
      {
        name: 'Photo Customized Gifts',
        imageUrl: this.assetService.getProductImage('Photo Customized Gifts')
      },
      {
        name: 'Combo Gifts',
        imageUrl: this.assetService.getProductImage('Combo Gifts')
      }
    ];
  }

  // Mock products data with SVG placeholders instead of file references
  private products: Product[] = [
    {
      id: 1,
      name: 'Birthday Gift Box',
      price: 1299,
      image: '', // Will be set by ensureValidImagePath
      badge: 'New',
      discount: '12%',
      originalPrice: 1476,
      description: 'A perfect birthday gift for your loved ones with customized items and premium packaging.'
    },
    {
      id: 2,
      name: 'Anniversary Special',
      price: 1599,
      image: '', // Will be set by ensureValidImagePath
      badge: null,
      discount: '15%',
      originalPrice: 1899,
      description: 'Celebrate your special day with our premium anniversary gift package, perfect for couples.'
    },
    {
      id: 3,
      name: 'Wedding Gift Package',
      price: 2999,
      image: '', // Will be set by ensureValidImagePath
      badge: 'Popular',
      discount: '25%',
      originalPrice: 3999,
      description: 'Elegant wedding gift package with customized items for the newly wedded couple.'
    },
    {
      id: 4,
      name: 'Farewell Token',
      price: 999,
      image: '', // Will be set by ensureValidImagePath
      badge: null,
      discount: '10%',
      originalPrice: 1099,
      description: 'A meaningful farewell gift to show your appreciation and good wishes.'
    },
    {
      id: 5,
      name: 'Congratulations Box',
      price: 1499,
      image: '', // Will be set by ensureValidImagePath
      badge: null,
      discount: '15%',
      originalPrice: 1799,
      description: 'Celebrate achievements with our special congratulations gift box with premium items.'
    },
    {
      id: 6,
      name: 'New Year Surprise Box',
      price: 1799,
      image: '', // Will be set by ensureValidImagePath
      badge: 'Limited',
      discount: '30%',
      originalPrice: 2599,
      description: 'Start the year with joy using our specially curated New Year gift collection.'
    },
    {
      id: 7,
      name: 'Valentine Special',
      price: 1999,
      image: '', // Will be set by ensureValidImagePath
      badge: 'Best Seller',
      discount: '20%',
      originalPrice: 2499,
      description: 'Express your love with our premium Valentine\'s Day gift package with customization options.'
    },
    {
      id: 8,
      name: 'Christmas Gift Set',
      price: 2499,
      image: '', // Will be set by ensureValidImagePath
      badge: 'Sale',
      discount: '25%',
      originalPrice: 3299,
      description: 'Celebrate Christmas with our festive gift set, perfect for friends and family.'
    },
    {
      id: 9,
      name: 'Custom Photo Frame',
      price: 899,
      image: '', // Will be set by ensureValidImagePath
      badge: 'New',
      discount: '15%',
      originalPrice: 1059,
      description: 'Personalized photo frame with your favorite memories printed on premium material.'
    },
    {
      id: 10,
      name: 'Personalized Mug Set',
      price: 799,
      image: '', // Will be set by ensureValidImagePath
      badge: null,
      discount: '10%',
      originalPrice: 899,
      description: 'Set of customized mugs with your name, photo or message - perfect for gifting.'
    },
    {
      id: 11,
      name: 'Premium Chocolate Box',
      price: 1299,
      image: '', // Will be set by ensureValidImagePath
      badge: 'Popular',
      discount: '20%',
      originalPrice: 1599,
      description: 'Assorted premium chocolates in an elegant gift box - ideal for all occasions.'
    },
    {
      id: 12,
      name: 'Engraved Wooden Plaque',
      price: 1499,
      image: '', // Will be set by ensureValidImagePath
      badge: 'Limited',
      discount: '15%',
      originalPrice: 1749,
      description: 'Beautifully crafted wooden plaque with customized engraving for special occasions.'
    }
  ];

  // Initialize with 'All' which corresponds to 'Home' in the nav
  private selectedCategorySubject = new BehaviorSubject<string>('All');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  getCategories(): string[] {
    return this.categories;
  }

  getTopCategories(): Category[] {
    return this.topCategories;
  }

  getAllProducts(): Product[] {
    return this.products.map(product => this.ensureValidImagePath(product));
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(product => product.id === id);
    return of(product ? this.ensureValidImagePath({...product}) : undefined);
  }

  getFilteredProducts(category: string): Observable<Product[]> {
    if (category === 'All') {
      return of(this.products.map(product => this.ensureValidImagePath({...product})));
    }

    const filtered = this.products
      .filter(product => product.name.includes(category))
      .map(product => this.ensureValidImagePath({...product}));

    return of(filtered);
  }

  setSelectedCategory(category: string): void {
    this.selectedCategorySubject.next(category);
  }

  searchProducts(query: string): Observable<Product[]> {
    if (!query || query.trim() === '') {
      return of(this.products.map(product => this.ensureValidImagePath({...product})));
    }

    const searchTerm = query.toLowerCase().trim();
    const results = this.products
      .filter(product => product.name.toLowerCase().includes(searchTerm))
      .map(product => this.ensureValidImagePath({...product}));

    return of(results);
  }

  // Ensure product has a valid image
  private ensureValidImagePath(product: Product): Product {
    if (!product.image || product.image.includes('assets/images/')) {
      // Replace file reference with generated placeholder
      product.image = this.assetService.getProductImage(product.name);
    }

    return product;
  }
}
