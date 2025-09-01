import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProductService, Category } from '../../../services/product.service';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss']
})
export class CategoryManagerComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isEditing = false;
  currentCategoryId: string | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      description: [''],
      displayOrder: [0]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.productService.fetchAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load categories. Please try again.';
        this.isLoading = false;
        console.error('Error loading categories:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.isLoading = true;
    const categoryData = this.categoryForm.value;

    if (this.isEditing && this.currentCategoryId) {
      // Update existing category
      this.productService.updateCategory(this.currentCategoryId, categoryData).subscribe({
        next: () => {
          this.successMessage = 'Category updated successfully!';
          this.resetForm();
          this.loadCategories();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to update category. Please try again.';
          this.isLoading = false;
          console.error('Error updating category:', error);
        }
      });
    } else {
      // Create new category
      this.productService.createCategory(categoryData).subscribe({
        next: () => {
          this.successMessage = 'Category created successfully!';
          this.resetForm();
          this.loadCategories();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to create category. Please try again.';
          this.isLoading = false;
          console.error('Error creating category:', error);
        }
      });
    }
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.currentCategoryId = category._id || null;

    this.categoryForm.patchValue({
      name: category.name,
      imageUrl: category.imageUrl,
      description: category.description || '',
      displayOrder: category.displayOrder || 0
    });

    // Scroll to form
    document.querySelector('.category-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  deleteCategory(category: Category): void {
    if (!category._id) return;

    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      this.isLoading = true;

      this.productService.deleteCategory(category._id).subscribe({
        next: () => {
          this.successMessage = 'Category deleted successfully!';
          this.loadCategories();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete category. Please try again.';
          this.isLoading = false;
          console.error('Error deleting category:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.categoryForm.reset({
      name: '',
      imageUrl: '',
      description: '',
      displayOrder: 0
    });
    this.isEditing = false;
    this.currentCategoryId = null;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
