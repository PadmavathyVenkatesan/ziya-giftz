import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/shared/toast/toast.component';
import { FloatingThemeButtonComponent } from './components/shared/floating-theme-button/floating-theme-button.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    TopNavbarComponent,
    FooterComponent,
    ToastComponent,
    FloatingThemeButtonComponent,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'padma-giftz';
  private cleanupRuns = 0;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // IMMEDIATE CSS TEXT CLEANUP
    this.hideCSSTxtImmediately();

    // Initialize theme service (this will load saved theme)
    console.log('🚀 App initialized - theme service loaded');
    console.log('🎨 Current theme:', this.themeService.getCurrentTheme());

    // Expose theme service globally for easy access
    (window as any).themeService = this.themeService;

    // Auto cleanup CSS txt files every 30 seconds
    setInterval(() => this.hideCSSTxtImmediately(), 30000);
  }

  /**
   * Hide CSS .txt files immediately
   */
  private hideCSSTxtImmediately() {
    this.cleanupRuns++;
    console.log(`🧹 CSS cleanup run #${this.cleanupRuns}`);

    const styleElements = document.querySelectorAll('style');
    let cleanedCount = 0;

    styleElements.forEach(element => {
      // Check if this is a CSS file being displayed as text
      if (element.textContent && element.textContent.length > 1000) {
        const content = element.textContent;
        
        // Look for CSS indicators
        if (content.includes('.') && 
            content.includes('{') && 
            content.includes('}') && 
            (content.includes('color') || content.includes('background') || content.includes('margin') || content.includes('padding'))) {
          
          // Hide by setting display none
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.remove();
          cleanedCount++;
        }
      }
    });

    // Also check for any text nodes that might be CSS content
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      if (textNode.textContent && textNode.textContent.length > 500) {
        const content = textNode.textContent;
        if (content.includes('/* COMPREHENSIVE APPLICATION-WIDE THEME SYSTEM */') ||
            content.includes('.card') ||
            content.includes('data-theme') ||
            content.includes('background-color') ||
            content.includes('!important')) {
          
          // This looks like CSS content, remove it
          if (textNode.parentNode) {
            textNode.parentNode.removeChild(textNode);
            cleanedCount++;
          }
        }
      }
    });

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned ${cleanedCount} CSS elements`);
    }
  }
}
