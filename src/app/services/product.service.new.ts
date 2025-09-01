import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from './cart.service';
import { AssetService } from './asset.service';
import { environment } from '../../environments/environment';

export interface Category {
  _id?: string;
  name: string;
  imageUrl: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api`;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  // Initialize with 'All' which corresponds to 'Home' in the nav
  private selectedCategorySubject = new BehaviorSubject<string>('All');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  // Fallback categories if API fails
  private fallbackCategories: string[] = [
    'All', 'Wooden Plaques', 'Return Gifts', 'Name Customized Items',
    'Customized Wallet', 'Fridge Magnets', 'Photo Customized Gifts', 'Combo Gifts'
  ];

  // Fallback top categories
  private fallbackTopCategories: Category[] = [];

  constructor(
    private http: HttpClient,
    private assetService: AssetService
  ) {
    // Initialize fallback categories with placeholder images
    this.fallbackTopCategories = this.fallbackCategories.map(name => ({
      name,
      imageUrl: this.assetService.getProductImage(name)
    }));

    // Fetch categories on initialization
    this.fetchAllCategories().subscribe();
  }

  // Fetch all categories from API
  fetchAllCategories(): Observable<Category[]> {
    return this.http.get<{ success: boolean, data: Category[] }>(`${this.apiUrl}/categories`)
      .pipe(
        map(response => {
          // Add 'All' category if not already present
          const allCategory = response.data.find(c => c.name === 'All');
          let categories = [...response.data];

          if (!allCategory) {
            categories = [
              {
                name: 'All',
                imageUrl: this.assetService.getProductImage('All'),
                description: 'All products'
              },
              ...categories
            ];
          }

          this.categoriesSubject.next(categories);
          return categories;
        }),
        catchError(error => {
          console.error('Error fetching categories:', error);
          // Use fallback categories if API fails
          const fallbackCats = this.fallbackTopCategories;
          this.categoriesSubject.next(fallbackCats);
          return of(fallbackCats);
        })
      );
  }

  // Get stored categories
  getCategories(): string[] {
    const categories = this.categoriesSubject.value;
    return categories.length ? categories.map(c => c.name) : this.fallbackCategories;
  }

  // Get top categories for display
  getTopCategories(): Category[] {
    return this.categoriesSubject.value.length ?
      this.categoriesSubject.value :
      this.fallbackTopCategories;
  }

  // Create a new category
  createCategory(category: Category): Observable<Category> {
    return this.http.post<{ success: boolean, data: Category }>(
      `${this.apiUrl}/categories`,
      category
    ).pipe(
      map(response => response.data),
      tap(newCategory => {
        const currentCategories = this.categoriesSubject.value;
        this.categoriesSubject.next([...currentCategories, newCategory]);
      }),
      catchError(error => {
        console.error('Error creating category:', error);
        return throwError(() => error);
      })
    );
  }

  // Update an existing category
  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<{ success: boolean, data: Category }>(
      `${this.apiUrl}/categories/${id}`,
      category
    ).pipe(
      map(response => response.data),
      tap(updatedCategory => {
        const currentCategories = this.categoriesSubject.value;
        const index = currentCategories.findIndex(c => c._id === id);

        if (index !== -1) {
          currentCategories[index] = updatedCategory;
          this.categoriesSubject.next([...currentCategories]);
        }
      }),
      catchError(error => {
        console.error(`Error updating category ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Delete a category
  deleteCategory(id: string): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(
      `${this.apiUrl}/categories/${id}`
    ).pipe(
      tap(() => {
        const currentCategories = this.categoriesSubject.value;
        const filteredCategories = currentCategories.filter(c => c._id !== id);
        this.categoriesSubject.next(filteredCategories);
      }),
      catchError(error => {
        console.error(`Error deleting category ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Get all products with optional filters
  getAllProducts(params: any = {}): Observable<{
    data: Product[],
    pagination: any
  }> {
    return this.http.get<{
      success: boolean,
      data: Product[],
      pagination: any
    }>(`${this.apiUrl}/products`, { params })
    .pipe(
      map(response => ({
        data: response.data.map(product => this.ensureValidImagePath(product)),
        pagination: response.pagination
      })),
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => error);
      })
    );
  }

  // Get a single product by ID
  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<{ success: boolean, data: Product }>(
      `${this.apiUrl}/products/${id}`
    ).pipe(
      map(response => this.ensureValidImagePath(response.data)),
      catchError(error => {
        console.error(`Error fetching product ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Get filtered products by category
  getFilteredProducts(category: string): Observable<Product[]> {
    if (category === 'All') {
      return this.getAllProducts().pipe(map(response => response.data));
    }

    return this.getAllProducts({ category }).pipe(map(response => response.data));
  }

  // Set selected category
  setSelectedCategory(category: string): void {
    this.selectedCategorySubject.next(category);
  }

  // Search products by query
  searchProducts(query: string): Observable<Product[]> {
    if (!query || query.trim() === '') {
      return this.getAllProducts().pipe(map(response => response.data));
    }

    return this.getAllProducts({ search: query }).pipe(map(response => response.data));
  }

  // Create a new product
  createProduct(product: Product): Observable<Product> {
    return this.http.post<{ success: boolean, data: Product }>(
      `${this.apiUrl}/products`,
      product
    ).pipe(
      map(response => this.ensureValidImagePath(response.data)),
      catchError(error => {
        console.error('Error creating product:', error);
        return throwError(() => error);
      })
    );
  }

  // Update an existing product
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<{ success: boolean, data: Product }>(
      `${this.apiUrl}/products/${id}`,
      product
    ).pipe(
      map(response => this.ensureValidImagePath(response.data)),
      catchError(error => {
        console.error(`Error updating product ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Delete a product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<{ success: boolean, message: string }>(
      `${this.apiUrl}/products/${id}`
    ).pipe(
      catchError(error => {
        console.error(`Error deleting product ${id}:`, error);
        return throwError(() => error);
      })
    );
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
