import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService, Theme, ThemeConfig } from '../../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-floating-theme-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="professional-theme-switcher">
      <!-- Main Theme Button -->
      <button
        class="theme-toggle-btn"
        (click)="toggleThemePanel()"
        [class.active]="isPanelOpen"
        title="Switch Theme">
        <mat-icon class="theme-icon">{{ getCurrentThemeIcon() }}</mat-icon>
      </button>

      <!-- Theme Selection Panel -->
      <div
        class="theme-panel"
        [class.open]="isPanelOpen"
        (click)="$event.stopPropagation()">

        <div class="theme-panel-header">
          <h3>Choose Theme</h3>
          <button
            class="close-btn"
            (click)="toggleThemePanel()"
            title="Close">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="theme-options">
          <div
            *ngFor="let theme of availableThemes"
            class="theme-option"
            [class.active]="currentTheme === theme.name"
            (click)="selectTheme(theme.name)"
            [title]="theme.description">

            <div class="theme-preview" [style.background]="theme.preview"></div>

            <div class="theme-info">
              <div class="theme-name">{{ theme.displayName }}</div>
              <div class="theme-description">{{ theme.description }}</div>
            </div>

            <div class="theme-check" *ngIf="currentTheme === theme.name">
              <mat-icon>check_circle</mat-icon>
            </div>
          </div>
        </div>


      </div>

      <!-- Backdrop -->
      <div
        class="theme-backdrop"
        [class.active]="isPanelOpen"
        (click)="toggleThemePanel()">
      </div>
    </div>
  `,
  styles: [`
    .professional-theme-switcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
    }

    .theme-toggle-btn {
      border-radius: 50%;
      background: var(--color-primary);
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg);
      transition: var(--theme-transition);
      position: relative;
      overflow: hidden;
    }

    .theme-toggle-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
      transform: translateX(-100%);
      transition: transform 0.6s;
    }

    .theme-toggle-btn:hover::before {
      transform: translateX(100%);
    }

    .theme-toggle-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }

    .theme-toggle-btn.active {
      background: var(--color-secondary);
      transform: scale(1.05);
    }

    .theme-icon {
      font-size: 24px;
      transition: var(--theme-transition);
    }

    .theme-panel {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 320px;
      background: var(--bg-card);
      border: 1px solid var(--border-primary);
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-xl);
      backdrop-filter: blur(20px);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transition: var(--theme-transition);
      overflow: hidden;
    }

    .theme-panel.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .theme-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px 16px;
      border-bottom: 1px solid var(--border-primary);
      background: var(--bg-secondary);
    }

    .theme-panel-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 4px;
      border-radius: var(--border-radius-sm);
      transition: var(--theme-transition-fast);
    }

    .close-btn:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .theme-options {
      padding: 16px;
      max-height: 300px;
      overflow-y: auto;
    }

    .theme-option {
      display: flex;
      align-items: center;
      padding: 16px;
      margin-bottom: 8px;
      border-radius: var(--border-radius-lg);
      cursor: pointer;
      transition: var(--theme-transition-fast);
      border: 2px solid transparent;
      background: var(--bg-surface);
    }

    .theme-option:hover {
      background: var(--bg-tertiary);
      transform: translateX(4px);
    }

    .theme-option.active {
      border-color: var(--color-primary);
      background: rgba(108, 99, 255, 0.05);
    }

    .theme-preview {
      width: 40px;
      height: 40px;
      border-radius: var(--border-radius-md);
      flex-shrink: 0;
      margin-right: 16px;
      border: 1px solid var(--border-primary);
      box-shadow: var(--shadow-sm);
    }

    .theme-info {
      flex: 1;
    }

    .theme-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .theme-description {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .theme-check {
      color: var(--color-primary);
      margin-left: 12px;
      flex-shrink: 0;
    }

    .theme-panel-actions {
      display: flex;
      gap: 8px;
      padding: 16px 24px 20px;
      border-top: 1px solid var(--border-primary);
      background: var(--bg-secondary);
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--btn-secondary-bg);
      border: 1px solid var(--btn-secondary-border);
      border-radius: var(--border-radius-md);
      color: var(--btn-secondary-text);
      cursor: pointer;
      transition: var(--theme-transition-fast);
      font-size: 13px;
      font-weight: 500;
    }

    .action-btn:hover {
      background: var(--btn-secondary-bg-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .action-btn mat-icon {
      font-size: 18px;
    }

    .test-btn:hover {
      background: rgba(16, 185, 129, 0.1);
      border-color: var(--color-success);
      color: var(--color-success);
    }

    .refresh-btn:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: var(--color-info);
      color: var(--color-info);
    }

    .theme-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(4px);
      opacity: 0;
      visibility: hidden;
      transition: var(--theme-transition);
      z-index: -1;
    }

    .theme-backdrop.active {
      opacity: 1;
      visibility: visible;
    }

    /* Animation for theme options */
    .theme-option {
      animation: slideInUp 0.3s ease-out backwards;
    }

    .theme-option:nth-child(1) { animation-delay: 0ms; }
    .theme-option:nth-child(2) { animation-delay: 50ms; }
    .theme-option:nth-child(3) { animation-delay: 100ms; }
    .theme-option:nth-child(4) { animation-delay: 150ms; }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .professional-theme-switcher {
        bottom: 20px;
        right: 20px;
      }

      .theme-panel {
        width: 280px;
        right: -20px;
      }

      .theme-toggle-btn {
        width: 50px;
        height: 50px;
      }

      .theme-icon {
        font-size: 20px;
      }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .theme-toggle-btn,
      .theme-panel,
      .theme-option,
      .action-btn {
        transition: none !important;
        animation: none !important;
      }
    }
  `]
})
export class FloatingThemeButtonComponent implements OnInit, OnDestroy {
  isPanelOpen = false;
  currentTheme: Theme = 'default';
  availableThemes: ThemeConfig[] = [];
  private themeSubscription?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Get available themes
    this.availableThemes = this.themeService.getAllThemes();

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Set initial theme
    this.currentTheme = this.themeService.getCurrentTheme();

    // Close panel when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    console.log('🎨 Professional Theme Switcher initialized');
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  toggleThemePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
    console.log('🎨 Theme panel toggled:', this.isPanelOpen);
  }

  selectTheme(themeName: string): void {
    const theme = themeName as Theme;
    console.log('🎨 Theme selected:', theme);
    this.themeService.setTheme(theme);

    // Close panel after selection with delay for visual feedback
    setTimeout(() => {
      this.isPanelOpen = false;
    }, 300);
  }

  testAllThemes(): void {
    console.log('🧪 Testing all themes...');
    this.themeService.testAllThemes();
    this.isPanelOpen = false;
  }

  refreshTheme(): void {
    console.log('🔄 Refreshing theme...');
    const currentTheme = this.themeService.getCurrentTheme();
    this.themeService.setTheme(currentTheme);
    this.isPanelOpen = false;
  }

  getCurrentThemeIcon(): string {
    const themeIcons: Record<Theme, string> = {
      'default': 'palette',
      'dark': 'dark_mode',
      'minimal': 'style',
      'colorful': 'color_lens'
    };
    return themeIcons[this.currentTheme] || 'palette';
  }

  private handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    const themeSwitcher = target.closest('.professional-theme-switcher');

    if (!themeSwitcher && this.isPanelOpen) {
      this.isPanelOpen = false;
    }
  }
}
