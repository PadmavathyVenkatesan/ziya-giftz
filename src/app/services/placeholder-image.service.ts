import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaceholderImageService {
  // Map product types to colors for our SVG placeholders
  private colors: { [key: string]: string } = {
    birthday: '#FF9999',
    anniversary: '#99CCFF',
    wedding: '#FFCCFF',
    farewell: '#CCFFCC',
    congrats: '#FFFFCC',
    newyear: '#FFCC99',
    valentine: '#FF99CC',
    christmas: '#CC9999',
    default: '#CCCCCC'
  };

  // Static image URLs for different product types
  private staticImages: { [key: string]: string } = {};

  constructor() {
    // Initialize static images
    this.initStaticImages();
  }

  /**
   * Initialize static placeholder images
   */
  private initStaticImages(): void {
    // Create static images for each product type
    Object.keys(this.colors).forEach(type => {
      this.staticImages[type] = this.createSvgPlaceholder(type.charAt(0).toUpperCase() + type.slice(1), this.colors[type]);
    });

    // Ensure we have default images for specific gift types
    this.staticImages['birthday-gift'] = this.createSvgPlaceholder('Birthday Gift', this.colors['birthday']);
    this.staticImages['anniversary-gift'] = this.createSvgPlaceholder('Anniversary Gift', this.colors['anniversary']);
    this.staticImages['wedding-gift'] = this.createSvgPlaceholder('Wedding Gift', this.colors['wedding']);
    this.staticImages['farewell-gift'] = this.createSvgPlaceholder('Farewell Gift', this.colors['farewell']);
    this.staticImages['congrats-gift'] = this.createSvgPlaceholder('Congratulations', this.colors['congrats']);
    this.staticImages['newyear-gift'] = this.createSvgPlaceholder('New Year Gift', this.colors['newyear']);
    this.staticImages['valentine-gift'] = this.createSvgPlaceholder('Valentine Gift', this.colors['valentine']);
    this.staticImages['christmas-gift'] = this.createSvgPlaceholder('Christmas Gift', this.colors['christmas']);
    this.staticImages['default'] = this.createSvgPlaceholder('Gift Item', this.colors['default']);
  }

  /**
   * Create an SVG placeholder with text
   * SVGs are more reliable than canvas-generated images
   */
  private createSvgPlaceholder(text: string, bgColor: string): string {
    // Prepare the text safely for SVG
    const safeText = text.replace(/[<>&"']/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return c;
      }
    });

    // Create darker color for border
    const borderColor = this.darkenColor(bgColor);

    // Simple SVG with background, border, and text - with all values explicitly defined
    // We're using a more basic SVG to ensure better compatibility
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">' +
        '<rect width="300" height="300" fill="' + bgColor + '"/>' +
        '<rect x="10" y="10" width="280" height="280" fill="none" stroke="' + borderColor + '" stroke-width="5"/>' +
        '<text x="150" y="100" font-family="Arial" font-size="22" text-anchor="middle" fill="#333333" font-weight="bold">' + safeText + '</text>' +
        '<text x="150" y="150" font-family="Arial" font-size="16" text-anchor="middle" fill="#333333">Padma Giftz</text>' +
        '<rect x="110" y="180" width="80" height="70" fill="' + borderColor + '"/>' +
        '<rect x="140" y="180" width="20" height="70" fill="#FFFFFF" opacity="0.6"/>' +
        '<rect x="110" y="205" width="80" height="20" fill="#FFFFFF" opacity="0.6"/>' +
      '</svg>';

    try {
      // Convert SVG to a data URL
      return 'data:image/svg+xml;base64,' + btoa(svg);
    } catch (e) {
      console.error('Error creating SVG data URL:', e);
      // Fallback to a simpler SVG if there's an error
      const simpleSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">' +
          '<rect width="300" height="300" fill="' + bgColor + '"/>' +
          '<text x="150" y="150" font-family="Arial" font-size="20" text-anchor="middle" fill="#333333">Padma Giftz</text>' +
        '</svg>';
      return 'data:image/svg+xml;base64,' + btoa(simpleSvg);
    }
  }

  /**
   * Darken a color by a percentage
   */
  private darkenColor(color: string): string {
    // Convert hex to RGB
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    // Darken by 30%
    const darker = {
      r: Math.max(0, Math.floor(r * 0.7)),
      g: Math.max(0, Math.floor(g * 0.7)),
      b: Math.max(0, Math.floor(b * 0.7))
    };

    // Convert back to hex
    return '#' +
      darker.r.toString(16).padStart(2, '0') +
      darker.g.toString(16).padStart(2, '0') +
      darker.b.toString(16).padStart(2, '0');
  }

  /**
   * Generate a placeholder image with text
   */
  generatePlaceholderImage(text: string, type: string = 'default'): string {
    // Try to match the type to one of our static images
    const lowerType = type.toLowerCase();

    // Find matching image by checking if type contains any of our keys
    for (const key of Object.keys(this.staticImages)) {
      if (lowerType.includes(key)) {
        return this.staticImages[key];
      }
    }

    // If no match, create a new SVG with the provided text
    return this.createSvgPlaceholder(text, this.colors['default']);
  }

  /**
   * Get image URL for a product based on its name
   */
  getProductImage(productName: string): string {
    if (!productName) return this.staticImages['default'];
    return this.generatePlaceholderImage(productName, productName);
  }
}
