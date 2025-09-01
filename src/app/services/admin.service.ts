import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalRevenue: number;
  recentOrders: any[];
}

export interface AdminCategory {
  _id?: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt?: Date;
}

export interface AdminProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  image: string;
  images?: string[];
  isActive: boolean;
  inStock: boolean;
  stockQuantity: number;
  features?: string[];
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;
  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('currentAdmin');
    if (token && admin) {
      this.currentAdminSubject.next(JSON.parse(admin));
    }
  }

  // Authentication
  login(email: string, password: string): Observable<any> {
    // For demo purposes, allow admin@ziya.com / admin123
    if (email === 'admin@ziya.com' && password === 'admin123') {
      const mockResponse = {
        success: true,
        admin: {
          id: '1',
          name: 'Admin User',
          email: 'admin@ziya.com',
          role: 'admin'
        },
        token: 'mock-admin-token-' + Date.now()
      };
      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockResponse);
          observer.complete();
        }, 500);
      });
    }

    // Try API first, fallback to mock if fails
    return this.http.post(`${this.apiUrl}/admin/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('currentAdmin');
    this.currentAdminSubject.next(null);
  }

  setCurrentAdmin(admin: AdminUser, token: string): void {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('currentAdmin', JSON.stringify(admin));
    this.currentAdminSubject.next(admin);
  }

  getCurrentAdmin(): AdminUser | null {
    return this.currentAdminSubject.value;
  }

  isAdminLoggedIn(): boolean {
    return this.currentAdminSubject.value !== null;
  }

  // Dashboard
  getDashboardStats(): Observable<{ success: boolean; stats: DashboardStats }> {
    return this.http.get<{ success: boolean; stats: DashboardStats }>(`${this.apiUrl}/admin/dashboard`);
  }

  // Category Management
  getCategories(): Observable<{ success: boolean; categories: AdminCategory[] }> {
    return this.http.get<{ success: boolean; categories: AdminCategory[] }>(`${this.apiUrl}/admin/categories`);
  }

  createCategory(category: Omit<AdminCategory, '_id' | 'createdAt'>): Observable<{ success: boolean; category: AdminCategory }> {
    return this.http.post<{ success: boolean; category: AdminCategory }>(`${this.apiUrl}/admin/categories`, category);
  }

  updateCategory(id: string, category: Partial<AdminCategory>): Observable<{ success: boolean; category: AdminCategory }> {
    return this.http.put<{ success: boolean; category: AdminCategory }>(`${this.apiUrl}/admin/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/admin/categories/${id}`);
  }

  // Product Management
  getProducts(): Observable<{ success: boolean; products: AdminProduct[] }> {
    return this.http.get<{ success: boolean; products: AdminProduct[] }>(`${this.apiUrl}/admin/products`);
  }

  createProduct(product: Omit<AdminProduct, '_id'>): Observable<{ success: boolean; product: AdminProduct }> {
    return this.http.post<{ success: boolean; product: AdminProduct }>(`${this.apiUrl}/admin/products`, product);
  }

  updateProduct(id: string, product: Partial<AdminProduct>): Observable<{ success: boolean; product: AdminProduct }> {
    return this.http.put<{ success: boolean; product: AdminProduct }>(`${this.apiUrl}/admin/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/admin/products/${id}`);
  }

  // User Management
  getUsers(): Observable<{ success: boolean; users: any[] }> {
    return this.http.get<{ success: boolean; users: any[] }>(`${this.apiUrl}/admin/users`);
  }

  updateUserStatus(id: string, isActive: boolean): Observable<{ success: boolean; user: any }> {
    return this.http.put<{ success: boolean; user: any }>(`${this.apiUrl}/admin/users/${id}/status`, { isActive });
  }

  // Order Management
  getOrders(): Observable<{ success: boolean; orders: any[] }> {
    return this.http.get<{ success: boolean; orders: any[] }>(`${this.apiUrl}/admin/orders`);
  }

  updateOrderStatus(id: string, status: string): Observable<{ success: boolean; order: any }> {
    return this.http.put<{ success: boolean; order: any }>(`${this.apiUrl}/admin/orders/${id}/status`, { status });
  }
}
