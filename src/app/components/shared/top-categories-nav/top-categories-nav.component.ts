import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService, Category } from '../../../services/product.service';

interface NavigationCategory extends Category {
  routePath: any[];
  exact: boolean;
}

@Component({
  selector: 'app-top-categories-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './top-categories-nav.component.html',
  styleUrls: ['./top-categories-nav.component.scss']
})
export class TopCategoriesNavComponent implements OnInit {
  topCategories: NavigationCategory[] = [];
  activeCategory: string = 'Home'; // Default active category is Home

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Map the categories to include route paths
    this.topCategories = this.productService.getTopCategories().map(category => {
      return {
        ...category,
        routePath: this.getCategoryPath(category.name),
        exact: category.name === 'Home'
      };
    });

    // Subscribe to the selected category from the service
    this.productService.selectedCategory$.subscribe(category => {
      this.activeCategory = category === 'All' ? 'Home' : category;
    });
  }

  /**
   * Get the router path for a category
   */
  getCategoryPath(categoryName: string): any[] {
    if (categoryName === 'Home') {
      return ['/'];
    } else {
      // Replace spaces with dashes for URL-friendly paths
      const urlFriendlyName = categoryName.toLowerCase().replace(/\s+/g, '-');
      return ['/category', urlFriendlyName];
    }
  }

  selectCategory(categoryName: string): void {
    // Update active category locally
    this.activeCategory = categoryName;

    // Navigate to the category (handled by router link in template)
    console.log(`Category selected: ${categoryName}`);

    // Update the selected category in the service
    if (categoryName === 'Home') {
      this.productService.setSelectedCategory('All');
    } else {
      this.productService.setSelectedCategory(categoryName);
    }
  }

  // Scroll the categories container left or right
  scrollCategories(direction: string): void {
    const container = document.querySelector('.categories-container') as HTMLElement;
    if (container) {
      const scrollAmount = 200; // pixels to scroll
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  }
}
