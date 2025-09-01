import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService, AdminCategory } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="admin-category-form">
      <div class="page-header">
        <div class="header-content">
          <button mat-icon-button (click)="goBack()" class="back-btn">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>{{ isEditMode ? 'Edit Category' : 'Add New Category' }}</h1>
        </div>
      </div>

      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="category-form">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category Name</mat-label>
                <input matInput formControlName="name" placeholder="Enter category name" required>
                <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
                  Category name is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea 
                  matInput 
                  formControlName="description" 
                  placeholder="Enter category description"
                  rows="3">
                </textarea>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Image URL</mat-label>
                <input matInput formControlName="image" placeholder="Enter image URL">
                <mat-icon matSuffix>image</mat-icon>
              </mat-form-field>
            </div>

            <div class="image-preview" *ngIf="categoryForm.get('image')?.value">
              <label>Image Preview:</label>
              <div class="preview-container">
                <img [src]="categoryForm.get('image')?.value" [alt]="categoryForm.get('name')?.value" 
                     (error)="onImageError($event)">
              </div>
            </div>

            <div class="form-row">
              <mat-slide-toggle formControlName="isActive" color="primary">
                Category is active
              </mat-slide-toggle>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()" class="cancel-btn">
                Cancel
              </button>
              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                [disabled]="categoryForm.invalid || isLoading">
                <mat-icon *ngIf="isLoading" class="spinner">refresh</mat-icon>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Category' : 'Create Category') }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./admin-category-form.component.scss']
})
export class AdminCategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  categoryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      image: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.categoryId;

    if (this.isEditMode && this.categoryId) {
      this.loadCategory();
    }
  }

  loadCategory(): void {
    this.adminService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          const category = response.categories.find(c => c._id === this.categoryId);
          if (category) {
            this.categoryForm.patchValue({
              name: category.name,
              description: category.description,
              image: category.image,
              isActive: category.isActive
            });
          } else {
            this.toastService.error('Category not found', 'Error');
            this.goBack();
          }
        }
      },
      error: (error) => {
        this.toastService.error('Failed to load category', 'Error');
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      const categoryData = this.categoryForm.value;

      const operation = this.isEditMode
        ? this.adminService.updateCategory(this.categoryId!, categoryData)
        : this.adminService.createCategory(categoryData);

      operation.subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success(
              `Category ${this.isEditMode ? 'updated' : 'created'} successfully`,
              'Success'
            );
            this.goBack();
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.toastService.error(
            error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} category`,
            'Error'
          );
          this.isLoading = false;
        }
      });
    }
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  goBack(): void {
    this.router.navigate(['/admin/categories']);
  }
}
