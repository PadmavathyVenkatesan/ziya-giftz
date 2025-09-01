import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService, AdminCategory } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="admin-categories">
      <div class="page-header">
        <div class="header-content">
          <button mat-icon-button routerLink="/admin/dashboard" class="back-btn">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Category Management</h1>
          <button mat-raised-button color="primary" routerLink="/admin/categories/new">
            <mat-icon>add</mat-icon>
            Add Category
          </button>
        </div>
      </div>

      <mat-card class="categories-table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="categories" class="categories-table">
              <!-- Image Column -->
              <ng-container matColumnDef="image">
                <th mat-header-cell *matHeaderCellDef>Image</th>
                <td mat-cell *matCellDef="let category">
                  <div class="category-image">
                    <img [src]="category.image" [alt]="category.name" *ngIf="category.image">
                    <div class="no-image" *ngIf="!category.image">
                      <mat-icon>image</mat-icon>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let category">
                  <div class="category-info">
                    <span class="category-name">{{ category.name }}</span>
                    <span class="category-description">{{ category.description }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let category">
                  <mat-slide-toggle 
                    [checked]="category.isActive"
                    (change)="toggleCategoryStatus(category)"
                    color="primary">
                    {{ category.isActive ? 'Active' : 'Inactive' }}
                  </mat-slide-toggle>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let category">
                  <div class="action-buttons">
                    <button 
                      mat-icon-button 
                      color="primary"
                      [routerLink]="['/admin/categories/edit', category._id]"
                      matTooltip="Edit Category">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button 
                      mat-icon-button 
                      color="warn"
                      (click)="deleteCategory(category)"
                      matTooltip="Delete Category">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div class="no-data" *ngIf="categories.length === 0 && !isLoading">
            <mat-icon>category</mat-icon>
            <h3>No Categories Found</h3>
            <p>Start by creating your first category</p>
            <button mat-raised-button color="primary" routerLink="/admin/categories/new">
              <mat-icon>add</mat-icon>
              Add Category
            </button>
          </div>

          <div class="loading" *ngIf="isLoading">
            <mat-icon class="spinner">refresh</mat-icon>
            <p>Loading categories...</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./admin-categories.component.scss']
})
export class AdminCategoriesComponent implements OnInit {
  categories: AdminCategory[] = [];
  displayedColumns: string[] = ['image', 'name', 'status', 'actions'];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.adminService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.categories;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Failed to load categories', 'Error');
        this.isLoading = false;
      }
    });
  }

  toggleCategoryStatus(category: AdminCategory): void {
    const newStatus = !category.isActive;
    this.adminService.updateCategory(category._id!, { isActive: newStatus }).subscribe({
      next: (response) => {
        if (response.success) {
          category.isActive = newStatus;
          this.toastService.success(
            `Category ${newStatus ? 'activated' : 'deactivated'} successfully`,
            'Status Updated'
          );
        }
      },
      error: (error) => {
        this.toastService.error('Failed to update category status', 'Error');
      }
    });
  }

  deleteCategory(category: AdminCategory): void {
    if (confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      this.adminService.deleteCategory(category._id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.categories = this.categories.filter(c => c._id !== category._id);
            this.toastService.success('Category deleted successfully', 'Deleted');
          }
        },
        error: (error) => {
          this.toastService.error(
            error.error?.message || 'Failed to delete category',
            'Delete Failed'
          );
        }
      });
    }
  }
}
