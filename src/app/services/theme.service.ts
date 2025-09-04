import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'default' | 'dark' | 'minimal' | 'colorful';

export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  primary: string;
  secondary: string;
  preview: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('default');
  public theme$ = this.currentThemeSubject.asObservable();

  // Professional theme configurations
  private themeConfigs: Record<Theme, ThemeConfig> = {
    default: {
      name: 'default',
      displayName: 'Default',
      description: 'Clean and professional with brand colors',
      icon: 'palette',
      primary: '#6C63FF',
      secondary: '#F8F9FA',
      preview: 'linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)'
    },
    dark: {
      name: 'dark',
      displayName: 'Dark',
      description: 'Easy on the eyes with dark backgrounds',
      icon: 'dark_mode',
      primary: '#BB86FC',
      secondary: '#1E1E1E',
      preview: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)'
    },
    minimal: {
      name: 'minimal',
      displayName: 'Minimal',
      description: 'Clean and simple with subtle accents',
      icon: 'style',
      primary: '#6B7280',
      secondary: '#F5F5F5',
      preview: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)'
    },
    colorful: {
      name: 'colorful',
      displayName: 'Colorful',
      description: 'Vibrant with professional gradients',
      icon: 'color_lens',
      primary: '#EC4899',
      secondary: '#F0F9FF',
      preview: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #06B6D4 100%)'
    }
  };

  constructor() {
    this.initializeTheme();
  }

  /**
   * Initialize theme from localStorage or default
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('app-theme') as Theme;

    // Define the preferred default theme here - change this to your preferred theme
    const preferredDefaultTheme: Theme = 'default'; // Options: 'default', 'dark', 'minimal', 'colorful'

    console.log('🎨 Initializing theme system...');
    console.log('Saved theme from localStorage:', savedTheme);

    if (savedTheme && this.isValidTheme(savedTheme)) {
      console.log('✅ Loading saved theme:', savedTheme);
      this.applyTheme(savedTheme, false);
    } else {
      console.log('🎨 No saved theme found, applying default theme:', preferredDefaultTheme);
      this.applyTheme(preferredDefaultTheme, false);
    }
  }

  /**
   * Set and apply theme
   */
  setTheme(theme: Theme): void {
    console.log('🎨 ThemeService.setTheme called with:', theme);

    if (!this.isValidTheme(theme)) {
      console.error('❌ Invalid theme:', theme);
      return;
    }

    console.log('✅ Theme validation passed, applying theme...');
    this.applyTheme(theme, true);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  /**
   * Get theme configuration
   */
  getThemeConfig(theme: Theme): ThemeConfig {
    return this.themeConfigs[theme];
  }

  /**
   * Get all available themes
   */
  getAllThemes(): ThemeConfig[] {
    return Object.values(this.themeConfigs);
  }

  /**
   * Toggle between themes (for testing)
   */
  toggleTheme(): void {
    const themes: Theme[] = ['default', 'dark', 'minimal', 'colorful'];
    const currentIndex = themes.indexOf(this.getCurrentTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }


  /**
   * Apply theme to DOM and update state
   */
  private applyTheme(theme: Theme, showNotification: boolean = true): void {
    console.log('🔧 Applying theme:', theme);

    const html = document.documentElement;
    const body = document.body;

    // Remove existing theme attributes
    html.removeAttribute('data-theme');
    body.removeAttribute('data-theme');

    // Remove existing theme classes
    body.classList.remove('theme-default', 'theme-dark', 'theme-minimal', 'theme-colorful');

    // Apply new theme
    html.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);
    body.classList.add(`theme-${theme}`);

    console.log('✅ DOM updated - data-theme attribute set to:', theme);
    console.log('✅ HTML element data-theme:', html.getAttribute('data-theme'));

    // FORCE THEME APPLICATION WITH ULTIMATE METHOD
    this.forceThemeApplication(theme);

    // Add transition class for smooth animations
    body.classList.add('theme-transitioning');
    setTimeout(() => {
      body.classList.remove('theme-transitioning');
    }, 300);

    // Update state and localStorage
    this.currentThemeSubject.next(theme);
    localStorage.setItem('app-theme', theme);

    console.log('✅ Theme state and localStorage updated');

    // Show notification if requested
    if (showNotification) {
      this.showThemeNotification(theme);
    }

    // Dispatch custom event for components that need it
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme, config: this.themeConfigs[theme] }
    }));

    console.log(`🎨 Theme applied successfully: ${theme}`);
  }

  /**
   * Force theme application using direct DOM manipulation
   */
  private forceThemeApplication(themeName: Theme): void {
    console.log('🚀 FORCE APPLYING THEME:', themeName);

    const themes: any = {
      'default': {
        bodyBg: '#ffffff',
        bodyColor: '#111827',
        cardBg: '#f9fafb',
        cardColor: '#111827',
        navBg: '#6C63FF',
        navColor: '#ffffff',
        buttonBg: '#6C63FF',
        buttonColor: '#ffffff'
      },
      'dark': {
        bodyBg: '#121212',
        bodyColor: '#EAEAEA',
        cardBg: '#1E1E1E',
        cardColor: '#EAEAEA',
        navBg: '#BB86FC',
        navColor: '#111827',
        buttonBg: '#BB86FC',
        buttonColor: '#111827'
      },
      'minimal': {
        bodyBg: '#F5F5F5',
        bodyColor: '#1F2937',
        cardBg: '#ffffff',
        cardColor: '#1F2937',
        navBg: '#4B5563',
        navColor: '#ffffff',
        buttonBg: '#D1D5DB',
        buttonColor: '#111827'
      },
      'colorful': {
        bodyBg: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
        bodyColor: '#111827',
        cardBg: 'rgba(255, 255, 255, 0.9)',
        cardColor: '#1F2937',
        navBg: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
        navColor: '#111827',
        buttonBg: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
        buttonColor: '#111827'
      }
    };

    const theme = themes[themeName];
    if (!theme) return;

    // Force body styles
    document.body.style.setProperty('background', theme.bodyBg, 'important');
    document.body.style.setProperty('color', theme.bodyColor, 'important');
    document.body.style.setProperty('min-height', '100vh', 'important');

    // Force html styles
    document.documentElement.style.setProperty('background', theme.bodyBg, 'important');

    // Apply to all relevant elements
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element: Element) => {
      const el = element as HTMLElement;

      // Skip debug panel
      if (el.closest('[style*="position: fixed"]') && el.closest('[style*="top: 10px"]')) {
        return;
      }

      // Apply to main containers
      if (el.classList.contains('app-container') ||
          el.classList.contains('main-content') ||
          el.classList.contains('container')) {
        el.style.setProperty('background', theme.bodyBg, 'important');
        el.style.setProperty('color', theme.bodyColor, 'important');
      }

      // Apply to all card elements
      if (el.className && el.className.includes('card')) {
        el.style.setProperty('background', theme.cardBg, 'important');
        el.style.setProperty('color', theme.cardColor, 'important');
        el.style.setProperty('border', '1px solid rgba(0,0,0,0.1)', 'important');
      }

      // Apply to navigation elements
      if (el.className && (el.className.includes('nav') || el.className.includes('header'))) {
        el.style.setProperty('background', theme.navBg, 'important');
        el.style.setProperty('color', theme.navColor, 'important');
      }

      // Apply to buttons (except debug buttons)
      if (el.tagName === 'BUTTON' && !el.closest('[style*="position: fixed"]')) {
        el.style.setProperty('background', theme.buttonBg, 'important');
        el.style.setProperty('color', theme.buttonColor, 'important');
        el.style.setProperty('border', 'none', 'important');
      }
    });

    console.log('🎨 Force theme application complete');
  }  /**
   * Show professional theme change notification
   */
  private showThemeNotification(theme: Theme): void {
    const config = this.themeConfigs[theme];

    // Remove existing notification
    const existing = document.getElementById('theme-notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.id = 'theme-notification';
    notification.innerHTML = `
      <div class="theme-notification-content">
        <div class="theme-notification-icon">🎨</div>
        <div class="theme-notification-text">
          <div class="theme-notification-title">${config.displayName} Theme</div>
          <div class="theme-notification-subtitle">${config.description}</div>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #theme-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .theme-notification-content {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 280px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      [data-theme="dark"] .theme-notification-content {
        background: rgba(30, 30, 30, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
        color: #EAEAEA;
      }

      .theme-notification-icon {
        font-size: 24px;
        flex-shrink: 0;
      }

      .theme-notification-title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 2px;
      }

      .theme-notification-subtitle {
        font-size: 12px;
        opacity: 0.7;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
        style.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Validate theme
   */
  private isValidTheme(theme: string): theme is Theme {
    return ['default', 'dark', 'minimal', 'colorful'].includes(theme);
  }
}
