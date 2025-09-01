import { Injectable } from '@angular/core';
import { PlaceholderImageService } from './placeholder-image.service';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  // Using generated placeholder images instead of file references
  private imageAssets: { [key: string]: string };
  private defaultImage: string;

  constructor(private placeholderService: PlaceholderImageService) {
    // Create default image placeholder
    this.defaultImage = this.placeholderService.generatePlaceholderImage('Product', 'default');

    // Generate placeholders for all our product types
    this.imageAssets = {
      'birthday-gift': this.placeholderService.generatePlaceholderImage('Birthday Gift', 'birthday'),
      'anniversary-gift': this.placeholderService.generatePlaceholderImage('Anniversary Gift', 'anniversary'),
      'wedding-gift': this.placeholderService.generatePlaceholderImage('Wedding Gift', 'wedding'),
      'farewell-gift': this.placeholderService.generatePlaceholderImage('Farewell Gift', 'farewell'),
      'congrats-gift': this.placeholderService.generatePlaceholderImage('Congratulations Gift', 'congrats'),
      'newyear-gift': this.placeholderService.generatePlaceholderImage('New Year Gift', 'newyear'),
      'valentine-gift': this.placeholderService.generatePlaceholderImage('Valentine Gift', 'valentine'),
      'christmas-gift': this.placeholderService.generatePlaceholderImage('Christmas Gift', 'christmas'),
      'default': this.defaultImage
    };
  }

  /**
   * Get image data URL for a given key
   */
  getImagePath(key: string): string {
    return this.imageAssets[key] || this.defaultImage;
  }

  /**
   * Get product image data URL based on product name
   */
  getProductImage(productName: string): string {
    if (!productName) return this.defaultImage;

    // Try to find an image key based on the product name
    const imageKey = Object.keys(this.imageAssets).find(key =>
      productName.toLowerCase().includes(key)
    );

    if (imageKey) {
      return this.imageAssets[imageKey];
    } else {
      // Generate a custom image for this product
      return this.placeholderService.generatePlaceholderImage(productName, this.detectProductType(productName));
    }
  }

  /**
   * Get random product image from available assets
   */
  getRandomProductImage(): string {
    const productImages = Object.keys(this.imageAssets)
      .filter(key => key !== 'default')
      .map(key => this.imageAssets[key]);

    const randomIndex = Math.floor(Math.random() * productImages.length);
    return productImages[randomIndex] || this.defaultImage;
  }

  /**
   * Detect the most likely product type from the name
   */
  private detectProductType(productName: string): string {
    const lowerName = productName.toLowerCase();
    const types = ['birthday', 'anniversary', 'wedding', 'farewell',
                  'congrats', 'newyear', 'valentine', 'christmas'];

    for (const type of types) {
      if (lowerName.includes(type)) {
        return type;
      }
    }

    return 'default';
  }

  /**
   * Handle image error and provide fallback
   */
  handleImageError(event: any): void {
    console.warn('Image failed to load:', event.target.src);
    // Generate a new placeholder image for this element
    const altText = event.target.alt || 'Product';
    event.target.src = this.placeholderService.generatePlaceholderImage(
      altText,
      this.detectProductType(altText)
    );
  }
}
