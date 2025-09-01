import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <div class="header-content">
          <div class="admin-title">
            <mat-icon>dashboard</mat-icon>
            <h1>Admin Dashboard</h1>
          </div>
          <button class="logout-btn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div class="admin-content">
        <div class="welcome-section">
          <h2>Welcome to Padma Giftz Admin Panel</h2>
          <p>Manage your e-commerce platform efficiently</p>
        </div>

        <div class="admin-grid">
          <div class="admin-card" (click)="navigateTo('/admin/products')">
            <mat-icon>inventory</mat-icon>
            <h3>Products</h3>
            <p>Manage product catalog</p>
            <div class="coming-soon">Coming Soon</div>
          </div>

          <div class="admin-card" (click)="navigateTo('/admin/orders')">
            <mat-icon>shopping_bag</mat-icon>
            <h3>Orders</h3>
            <p>View and manage orders</p>
            <div class="coming-soon">Coming Soon</div>
          </div>

          <div class="admin-card" (click)="navigateTo('/admin/users')">
            <mat-icon>group</mat-icon>
            <h3>Users</h3>
            <p>Manage customer accounts</p>
            <div class="coming-soon">Coming Soon</div>
          </div>

          <div class="admin-card" (click)="navigateTo('/admin/analytics')">
            <mat-icon>analytics</mat-icon>
            <h3>Analytics</h3>
            <p>View sales analytics</p>
            <div class="coming-soon">Coming Soon</div>
          </div>

          <div class="admin-card" (click)="navigateTo('/admin/categories')">
            <mat-icon>category</mat-icon>
            <h3>Categories</h3>
            <p>Manage product categories</p>
            <div class="coming-soon">Coming Soon</div>
          </div>

          <div class="admin-card" (click)="navigateTo('/admin/settings')">
            <mat-icon>settings</mat-icon>
            <h3>Settings</h3>
            <p>Configure system settings</p>
            <div class="coming-soon">Coming Soon</div>
          </div>
        </div>

        <div class="admin-info">
          <div class="info-card">
            <h3>How to use Admin Panel:</h3>
            <ul>
              <li>Use the navigation cards above to access different admin sections</li>
              <li>Currently, this is a basic admin dashboard</li>
              <li>Features will be added progressively</li>
              <li>To logout, click the logout button in the top right</li>
            </ul>
          </div>

          <div class="info-card">
            <h3>Admin Access:</h3>
            <ul>
              <li><strong>Default Password:</strong> admin123</li>
              <li>You can change this in the navbar component</li>
              <li>Consider implementing proper authentication in production</li>
              <li>Admin status is stored in localStorage for demo purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .admin-header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 1rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .admin-title {
      display: flex;
      align-items: center;
      gap: 1rem;

      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }

      h1 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 600;
      }
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }
    }

    .admin-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;

      h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      p {
        font-size: 1.2rem;
        opacity: 0.9;
      }
    }

    .admin-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .admin-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        background: rgba(255, 255, 255, 0.15);
      }

      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
        color: #ffd700;
      }

      h3 {
        margin: 0 0 1rem 0;
        font-size: 1.4rem;
      }

      p {
        margin: 0;
        opacity: 0.8;
        font-size: 1rem;
      }

      .coming-soon {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ff6b6b;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
      }
    }

    .admin-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .info-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);

      h3 {
        margin-top: 0;
        color: #ffd700;
        font-size: 1.2rem;
      }

      ul {
        margin: 1rem 0;
        padding-left: 1.5rem;

        li {
          margin-bottom: 0.5rem;
          line-height: 1.5;

          strong {
            color: #ffd700;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 0 1rem;
      }

      .admin-content {
        padding: 1rem;
      }

      .welcome-section h2 {
        font-size: 2rem;
      }

      .admin-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .admin-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent {
  constructor(private router: Router, private toastService: ToastService) {}

  logout(): void {
    localStorage.removeItem('isAdmin');
    this.router.navigate(['/']);
  }

  navigateTo(route: string): void {
    // For now, just show a toast since these routes don't exist yet
    this.toastService.info('This feature will be implemented in future updates!', 'Coming Soon');
  }
}
