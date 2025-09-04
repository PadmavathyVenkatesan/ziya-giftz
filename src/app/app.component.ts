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

    // Ensure theme is loaded immediately on app initialization
    console.log('🚀 App initialized - ensuring theme is loaded');

    // Force theme initialization if not already done
    const currentTheme = this.themeService.getCurrentTheme();
    console.log('🎨 Current theme:', currentTheme);

    // Apply the current theme to ensure it's properly loaded
    this.themeService.setTheme(currentTheme);

    // Expose theme service globally for easy testing
    (window as any).themeService = this.themeService;
    (window as any).toggleTheme = () => this.themeService.toggleTheme();

    // Enhanced theme debugging utilities
    (window as any).debugTheme = () => {
      const current = this.themeService.getCurrentTheme();
      const html = document.documentElement;
      const computedStyle = getComputedStyle(html);

      console.log('🐛 THEME DEBUG INFO:');
      console.log('Current theme:', current);
      console.log('HTML data-theme:', html.getAttribute('data-theme'));
      console.log('CSS Variables:');
      console.log('--bg:', computedStyle.getPropertyValue('--bg'));
      console.log('--text:', computedStyle.getPropertyValue('--text'));
      console.log('--card-bg:', computedStyle.getPropertyValue('--card-bg'));
      console.log('--button-bg:', computedStyle.getPropertyValue('--button-bg'));
      console.log('--button-text:', computedStyle.getPropertyValue('--button-text'));
      console.log('--nav-active:', computedStyle.getPropertyValue('--nav-active'));
    };

    (window as any).listAllThemes = () => {
      console.log('🎨 Available themes:');
      this.themeService.getAllThemes().forEach(theme => {
        console.log(`- ${theme.name}: ${theme.displayName} (${theme.description})`);
      });
    };

    // Debug: Check if DOM has theme attribute
    setTimeout(() => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');
      console.log('🔍 DOM data-theme attribute:', currentTheme);

      // Check CSS variables
      const computedStyle = getComputedStyle(html);
      console.log('🔍 CSS --bg variable:', computedStyle.getPropertyValue('--bg'));
      console.log('🔍 CSS --button-bg variable:', computedStyle.getPropertyValue('--button-bg'));
    }, 1000);

    // ULTIMATE THEME FORCE APPLICATION
    (window as any).ultimateThemeForce = (themeName: string) => {
      console.log('🚀 ULTIMATE THEME FORCE:', themeName);

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
      if (!theme) {
        console.error('Theme not found:', themeName);
        return;
      }

      // Set data-theme attribute
      document.documentElement.setAttribute('data-theme', themeName);
      document.body.setAttribute('data-theme', themeName);

      // Force body styles
      document.body.style.setProperty('background', theme.bodyBg, 'important');
      document.body.style.setProperty('color', theme.bodyColor, 'important');
      document.body.style.setProperty('min-height', '100vh', 'important');

      // Force html styles
      document.documentElement.style.setProperty('background', theme.bodyBg, 'important');

      // Get all elements and apply styles
      const allElements = document.querySelectorAll('*');
      let appliedCount = 0;

      allElements.forEach((element: Element) => {
        const el = element as HTMLElement;

        // Skip debug panel
        if (el.closest('.debug-panel') || el.style.position === 'fixed' && el.style.top === '10px') {
          return;
        }

        // Apply to main containers
        if (el.classList.contains('app-container') ||
            el.classList.contains('main-content') ||
            el.classList.contains('container')) {
          el.style.setProperty('background', theme.bodyBg, 'important');
          el.style.setProperty('color', theme.bodyColor, 'important');
          appliedCount++;
        }

        // Apply to all card elements
        if (el.className && el.className.includes('card')) {
          el.style.setProperty('background', theme.cardBg, 'important');
          el.style.setProperty('color', theme.cardColor, 'important');
          el.style.setProperty('border', '1px solid rgba(0,0,0,0.1)', 'important');
          appliedCount++;
        }

        // Apply to navigation elements
        if (el.className && (el.className.includes('nav') || el.className.includes('header'))) {
          el.style.setProperty('background', theme.navBg, 'important');
          el.style.setProperty('color', theme.navColor, 'important');
          appliedCount++;
        }

        // Apply to buttons (except debug buttons)
        if (el.tagName === 'BUTTON' && !el.className.includes('debug')) {
          el.style.setProperty('background', theme.buttonBg, 'important');
          el.style.setProperty('color', theme.buttonColor, 'important');
          el.style.setProperty('border', 'none', 'important');
          appliedCount++;
        }

        // Apply to inputs
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
          if (themeName === 'dark') {
            el.style.setProperty('background', '#374151', 'important');
            el.style.setProperty('color', '#EAEAEA', 'important');
            el.style.setProperty('border', '1px solid #4B5563', 'important');
          } else {
            el.style.setProperty('background', '#ffffff', 'important');
            el.style.setProperty('color', '#111827', 'important');
            el.style.setProperty('border', '1px solid #e5e7eb', 'important');
          }
          appliedCount++;
        }

        // Apply to general divs and sections
        if ((el.tagName === 'DIV' || el.tagName === 'SECTION') &&
            !el.style.position &&
            !el.className.includes('debug')) {
          el.style.setProperty('color', theme.bodyColor, 'important');
          appliedCount++;
        }
      });

      console.log(`✅ Applied theme to ${appliedCount} elements`);
      console.log('🎨 Theme applied:', themeName);

      // Trigger a reflow
      document.body.offsetHeight;
    };

    // IMMEDIATE DOM INSPECTION
    (window as any).inspectDOM = () => {
      console.log('🔍 DOM INSPECTION:');
      const html = document.documentElement;
      const body = document.body;

      console.log('HTML tag:', html);
      console.log('HTML data-theme:', html.getAttribute('data-theme'));
      console.log('HTML classList:', html.classList.toString());
      console.log('HTML style:', html.getAttribute('style'));

      console.log('BODY tag:', body);
      console.log('BODY data-theme:', body.getAttribute('data-theme'));
      console.log('BODY classList:', body.classList.toString());
      console.log('BODY style:', body.getAttribute('style'));

      // Check computed styles
      const htmlComputed = getComputedStyle(html);
      const bodyComputed = getComputedStyle(body);

      console.log('HTML computed background:', htmlComputed.backgroundColor);
      console.log('BODY computed background:', bodyComputed.backgroundColor);
      console.log('HTML computed color:', htmlComputed.color);
      console.log('BODY computed color:', bodyComputed.color);

      // Check if our CSS rules exist
      const stylesheets = Array.from(document.styleSheets);
      console.log('Total stylesheets:', stylesheets.length);

      let foundThemeRules = 0;
      try {
        stylesheets.forEach((sheet, index) => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            rules.forEach(rule => {
              if (rule.cssText && rule.cssText.includes('data-theme')) {
                foundThemeRules++;
                console.log(`Theme rule found in sheet ${index}:`, rule.cssText.substring(0, 100));
              }
            });
          } catch (e: any) {
            console.log(`Cannot access sheet ${index}:`, e.message);
          }
        });
      } catch (e: any) {
        console.log('Error checking stylesheets:', e);
      }

      console.log('Total theme rules found:', foundThemeRules);
    };

    // FORCE ALL ELEMENTS TO THEME
    (window as any).forceAllElementsTheme = (theme: string) => {
      console.log('🎨 FORCING ALL ELEMENTS TO THEME:', theme);
      const html = document.documentElement;
      const body = document.body;

      // Set data-theme attribute
      html.setAttribute('data-theme', theme);
      body.setAttribute('data-theme', theme);

      // Get theme colors
      const themes = {
        'default': { bg: '#ffffff', text: '#111827', cardBg: '#f9fafb' },
        'dark': { bg: '#121212', text: '#EAEAEA', cardBg: '#1E1E1E' },
        'minimal': { bg: '#F5F5F5', text: '#1F2937', cardBg: '#ffffff' },
        'colorful': { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff', cardBg: 'rgba(255, 255, 255, 0.9)' }
      };

      const colors = themes[theme as keyof typeof themes];
      if (!colors) return;

      // Force styles on all elements
      const allElements = document.querySelectorAll('*:not(.debug-panel):not(.debug-panel *)');

      allElements.forEach((el: Element) => {
        const element = el as HTMLElement;

        // Skip debug elements
        if (element.closest('.debug-panel') || element.style.position === 'fixed') return;

        // Apply theme to body and main containers
        if (element.tagName === 'BODY' || element.classList.contains('app-container')) {
          element.style.setProperty('background', colors.bg, 'important');
          element.style.setProperty('color', colors.text, 'important');
        }

        // Apply to cards
        if (element.classList.toString().includes('card') ||
            element.classList.contains('product-card') ||
            element.classList.contains('detail-card')) {
          element.style.setProperty('background-color', colors.cardBg, 'important');
          element.style.setProperty('color', colors.text, 'important');
        }

        // Apply to navigation
        if (element.classList.toString().includes('nav') ||
            element.classList.contains('header')) {
          if (theme === 'default') {
            element.style.setProperty('background-color', '#6C63FF', 'important');
            element.style.setProperty('color', '#ffffff', 'important');
          } else if (theme === 'dark') {
            element.style.setProperty('background-color', '#BB86FC', 'important');
            element.style.setProperty('color', '#111827', 'important');
          }
        }
      });

      console.log('✅ Applied theme to', allElements.length, 'elements');
    };

    // Test if CSS selectors work at all
    (window as any).testCSSSelector = () => {
      console.log('🧪 TESTING CSS SELECTOR FUNCTIONALITY');
      const html = document.documentElement;

      // Add a test attribute
      html.setAttribute('test-attr', 'working');
      console.log('Added test-attr="working" to html');

      // Add inline style to test if styles work at all
      html.style.border = '10px solid red';
      console.log('Added red border to html element');

      setTimeout(() => {
        html.style.border = '';
        html.removeAttribute('test-attr');
        console.log('Cleaned up test styles');
      }, 3000);
    };

    // Force test theme change to see if it works
    (window as any).forceThemeTest = () => {
      console.log('🧪 Force testing theme change...');
      const html = document.documentElement;
      html.setAttribute('data-theme', 'dark');
      console.log('🧪 Manually set data-theme to dark');
      setTimeout(() => {
        html.setAttribute('data-theme', 'default');
        console.log('🧪 Reset to default theme');
      }, 2000);
    };

    // Direct DOM test - bypass theme service completely
    (window as any).directThemeTest = (theme: string) => {
      console.log('🔧 DIRECT DOM TEST - Setting theme:', theme);
      const html = document.documentElement;
      const body = document.body;

      // Remove all existing theme attributes
      html.removeAttribute('data-theme');
      body.removeAttribute('data-theme');

      // Set new theme
      html.setAttribute('data-theme', theme);
      body.setAttribute('data-theme', theme);

      console.log('✅ Direct DOM update complete');
      console.log('HTML data-theme:', html.getAttribute('data-theme'));
      console.log('Body data-theme:', body.getAttribute('data-theme'));

      // Check CSS variables
      const computedStyle = getComputedStyle(html);
      console.log('CSS --bg:', computedStyle.getPropertyValue('--bg'));
      console.log('CSS --button-bg:', computedStyle.getPropertyValue('--button-bg'));
    };

    // Test if CSS variables are available at all
    (window as any).testCSSVariables = () => {
      const html = document.documentElement;
      const style = getComputedStyle(html);
      console.log('🧪 CSS VARIABLES TEST:');
      console.log('Current data-theme:', html.getAttribute('data-theme'));
      console.log('--bg:', style.getPropertyValue('--bg'));
      console.log('--text:', style.getPropertyValue('--text'));
      console.log('--card-bg:', style.getPropertyValue('--card-bg'));
      console.log('--button-bg:', style.getPropertyValue('--button-bg'));

      if (!style.getPropertyValue('--bg')) {
        console.error('❌ CSS variables not found! Theme CSS not loaded.');
      } else {
        console.log('✅ CSS variables found!');
      }
    };
    (window as any).toggleTheme = () => this.themeService.toggleTheme();
    console.log('🔧 Global theme testing functions available:', {
      'themeService': 'Access to theme service',
      'testThemes()': 'Test all themes automatically',
      'toggleTheme()': 'Toggle between themes'
    });

    // Subscribe to theme changes to verify they're working
    this.themeService.theme$.subscribe(theme => {
      console.log('🎨 App: Theme changed to:', theme);

      // Add animation class to body during theme transition
      document.body.classList.add('animate-theme-transition');

      setTimeout(() => {
        document.body.classList.remove('animate-theme-transition');
      }, 400);
    });

    // Listen for custom theme change events
    window.addEventListener('themeChanged', (event: any) => {
      console.log('🎨 App: Custom theme change event received:', event.detail);
    });

    // Run CSS cleanup periodically (disabled for now)
    // setInterval(() => this.hideCSSTxtImmediately(), 1000);
    // this.cleanupCSSText(); // Disabled temporarily to check if this is causing blank page

    // Check authentication status on app load
    console.log("🔐 App initialization - Auth status:", this.authService.isAuthenticated());
    this.authService.debugAuthState();

    // Check for inconsistencies in auth state
    const token = localStorage.getItem('token');
    const userDataExists = !!localStorage.getItem('currentUser');

    if (token && !userDataExists) {
      console.log("WARNING: Token exists but no user data found. Attempting to fetch user data.");
    } else if (!token && userDataExists) {
      console.log("WARNING: User data exists but no token found. Clearing inconsistent auth state.");
      localStorage.removeItem('currentUser');
      return;
    }

    if (this.authService.isAuthenticated()) {
      // If user is authenticated, refresh user data
      console.log("User is authenticated, refreshing user data");
      this.authService.refreshUserData().subscribe({
        next: (userData) => {
          console.log("User data refreshed successfully:", userData);
          this.authService.debugAuthState(); // Check auth state after refresh
        },
        error: (error) => {
          console.error('Failed to refresh user data:', error);

          // If the token is invalid, clear authentication state
          if (error.status === 401) {
            console.log("Invalid token detected, logging out");
            this.authService.logout();

            // Show message to user
            setTimeout(() => {
              this.toastService.error('Your session has expired. Please log in again.', 'Session Expired');
            }, 100);
          }
        }
      });
    } else if (token) {
      // We have a token but isAuthenticated() returned false
      // This could happen if the token is malformed or the user data is missing
      console.warn("Token exists but auth check failed, clearing inconsistent state");
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  }

  testTheme(theme: string) {
    console.log('🧪 Manual theme test button clicked:', theme);

    // Direct DOM manipulation test first
    console.log('🔧 Setting data-theme attribute directly...');
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    console.log('✅ DOM attribute set, now calling theme service...');
    this.themeService.setTheme(theme as any);

    // Check if CSS variables are available
    setTimeout(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      console.log('🔍 CSS --bg after change:', computedStyle.getPropertyValue('--bg'));
      console.log('🔍 CSS --button-bg after change:', computedStyle.getPropertyValue('--button-bg'));
    }, 100);
  }

  getCurrentDataTheme(): string {
    return document.documentElement.getAttribute('data-theme') || 'none';
  }

  private hideCSSTxtImmediately() {
    // Immediately remove any CSS text that appears in the DOM
    try {
      const bodyText = document.body.innerText || '';
      if (bodyText.includes('background: #FF0000') ||
          bodyText.includes('.whatsapp-icon') ||
          bodyText.includes('background-color: #25D366')) {

        // Simple approach: find all elements and check their text content
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
          const text = element.textContent || '';
          const hasNoChildren = element.children.length === 0;

          if (hasNoChildren && (
            text.includes('background: #FF0000') ||
            text.includes('.whatsapp-icon') ||
            text.includes('background-color: #25D366') ||
            text.includes('} .whatsapp-icon {')
          )) {
            element.remove();
          }
        });
      }
    } catch (error) {
      console.log('CSS cleanup error:', error);
    }
  }

  private cleanupCSSText() {
    // Function to remove any CSS text that might be appearing in the DOM
    setTimeout(() => {
      // Only check text nodes and specific elements that might contain raw CSS
      const textNodes = Array.from(document.querySelectorAll('*')).filter(element => {
        const textContent = element.textContent || '';
        const hasOnlyTextContent = element.children.length === 0;

        // Only target elements that contain ONLY CSS text (no child elements)
        return hasOnlyTextContent && (
          textContent.trim().startsWith('background: #FF0000') ||
          textContent.trim().startsWith('.whatsapp-icon {') ||
          textContent.trim().includes('} .whatsapp-icon { background-color:') ||
          (textContent.includes('background-color: #25D366') && textContent.includes('!important'))
        );
      });

      textNodes.forEach(element => {
        console.log('Removing CSS text element:', element.textContent);
        element.remove();
      });

      // Only run this cleanup a few times, not infinitely
      this.cleanupRuns++;

      if (this.cleanupRuns < 5) {
        setTimeout(() => this.cleanupCSSText(), 2000);
      }
    }, 500);
  }
}
