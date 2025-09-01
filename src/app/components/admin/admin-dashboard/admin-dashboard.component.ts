import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AdminService, DashboardStats } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Admin Dashboard</h1>
          <div class="header-actions">
            <button mat-raised-button color="primary" routerLink="/admin/categories/new">
              <mat-icon>add</mat-icon>
              Add Category
            </button>
            <button mat-raised-button color="primary" routerLink="/admin/products/new">
              <mat-icon>add</mat-icon>
              Add Product
            </button>
            <button mat-button (click)="logout()" class="logout-btn">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div class="stats-grid" *ngIf="stats">
        <mat-card class="stat-card users">
          <div class="stat-content">
            <div class="stat-info">
              <h3>{{ stats.totalUsers }}</h3>
              <p>Total Users</p>
            </div>
            <mat-icon>people</mat-icon>
          </div>
        </mat-card>

        <mat-card class="stat-card orders">
          <div class="stat-content">
            <div class="stat-info">
              <h3>{{ stats.totalOrders }}</h3>
              <p>Total Orders</p>
            </div>
            <mat-icon>shopping_bag</mat-icon>
          </div>
        </mat-card>

        <mat-card class="stat-card products">
          <div class="stat-content">
            <div class="stat-info">
              <h3>{{ stats.totalProducts }}</h3>
              <p>Products</p>
            </div>
            <mat-icon>inventory</mat-icon>
          </div>
        </mat-card>

        <mat-card class="stat-card revenue">
          <div class="stat-content">
            <div class="stat-info">
              <h3>₹{{ stats.totalRevenue | number:'1.0-0' }}</h3>
              <p>Total Revenue</p>
            </div>
            <mat-icon>account_balance_wallet</mat-icon>
          </div>
        </mat-card>
      </div>

      <div class="management-grid">
        <mat-card class="management-card" routerLink="/admin/categories">
          <mat-card-content>
            <div class="card-header">
              <mat-icon>category</mat-icon>
              <h3>Categories</h3>
            </div>
            <p>Manage product categories</p>
            <div class="card-stats">
              <span class="count">{{ stats?.totalCategories || 0 }}</span>
              <span class="label">Total Categories</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="management-card" routerLink="/admin/products">
          <mat-card-content>
            <div class="card-header">
              <mat-icon>inventory_2</mat-icon>
              <h3>Products</h3>
            </div>
            <p>Manage product inventory</p>
            <div class="card-stats">
              <span class="count">{{ stats?.totalProducts || 0 }}</span>
              <span class="label">Total Products</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="management-card" routerLink="/admin/orders">
          <mat-card-content>
            <div class="card-header">
              <mat-icon>receipt_long</mat-icon>
              <h3>Orders</h3>
            </div>
            <p>Manage customer orders</p>
            <div class="card-stats">
              <span class="count">{{ stats?.totalOrders || 0 }}</span>
              <span class="label">Total Orders</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="management-card" routerLink="/admin/users">
          <mat-card-content>
            <div class="card-header">
              <mat-icon>group</mat-icon>
              <h3>Users</h3>
            </div>
            <p>Manage user accounts</p>
            <div class="card-stats">
              <span class="count">{{ stats?.totalUsers || 0 }}</span>
              <span class="label">Total Users</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="recent-orders" *ngIf="stats?.recentOrders?.length">
        <mat-card-header>
          <mat-card-title>Recent Orders</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="orders-list">
            <div class="order-item" *ngFor="let order of (stats?.recentOrders || []).slice(0, 5)">
              <div class="order-info">
                <span class="order-id">#{{ order._id.slice(-6) }}</span>
                <span class="customer-name">{{ order.userId?.name || 'Unknown' }}</span>
              </div>
              <div class="order-details">
                <span class="amount">₹{{ order.totalAmount }}</span>
                <span class="status" [class]="'status-' + order.status">{{ order.status }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.stats;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Failed to load dashboard data', 'Error');
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.adminService.logout();
    this.toastService.success('Logged out successfully', 'Goodbye');
    this.router.navigate(['/admin/login']);
  }
}
