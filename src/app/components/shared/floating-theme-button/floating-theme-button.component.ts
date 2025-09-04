import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
        <svg class="theme-icon-svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <!-- Enhanced palette shape with better contrast -->
          <ellipse cx="16" cy="18" rx="13" ry="11" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
          <!-- Thumb hole with shadow -->
          <ellipse cx="22" cy="16" rx="4" ry="3" fill="#ffffff" stroke="#6C63FF" stroke-width="1"/>
          <!-- Color dots with better visibility -->
          <circle cx="10" cy="12" r="2.5" fill="#FF4757" stroke="#ffffff" stroke-width="1"/>
          <circle cx="16" cy="10" r="2.5" fill="#2ED573" stroke="#ffffff" stroke-width="1"/>
          <circle cx="22" cy="12" r="2.5" fill="#FFA502" stroke="#ffffff" stroke-width="1"/>
          <circle cx="12" cy="20" r="2.5" fill="#3742FA" stroke="#ffffff" stroke-width="1"/>
          <circle cx="20" cy="22" r="2.5" fill="#FF6B9D" stroke="#ffffff" stroke-width="1"/>
          <!-- Add a subtle shadow to the palette -->
          <ellipse cx="16" cy="19" rx="12" ry="10" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        </svg>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="theme-options">
          <div
            *ngFor="let theme of availableThemes"
            class="theme-option"
            [class.active]="currentTheme === theme.name"
            (click)="selectTheme(theme.name)"
            [title]="theme.description">

            <div class="theme-icon-container">
              <svg class="theme-option-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <ng-container [ngSwitch]="theme.name">
                  <!-- Default Theme Icon -->
                  <g *ngSwitchCase="'default'">
                    <circle cx="12" cy="12" r="10" fill="#6C63FF" stroke="#5b52d9" stroke-width="2"/>
                    <circle cx="8" cy="10" r="1.5" fill="white"/>
                    <circle cx="16" cy="10" r="1.5" fill="white"/>
                    <circle cx="12" cy="14" r="1.5" fill="white"/>
                  </g>
                  <!-- Dark Theme Icon -->
                  <g *ngSwitchCase="'dark'">
                    <circle cx="12" cy="12" r="10" fill="#1e293b" stroke="#334155" stroke-width="2"/>
                    <path d="M12 4V2M12 22v-2M20 12h2M4 12H2M17.66 6.34l1.42-1.42M4.93 19.07l1.41-1.41M17.66 17.66l1.42 1.42M4.93 4.93l1.41 1.41" stroke="#BB86FC" stroke-width="2"/>
                  </g>
                  <!-- Minimal Theme Icon -->
                  <g *ngSwitchCase="'minimal'">
                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#f8fafc" stroke="#4B5563" stroke-width="2"/>
                    <line x1="8" y1="10" x2="16" y2="10" stroke="#4B5563" stroke-width="1.5"/>
                    <line x1="8" y1="14" x2="12" y2="14" stroke="#4B5563" stroke-width="1.5"/>
                  </g>
                  <!-- Colorful Theme Icon -->
                  <g *ngSwitchCase="'colorful'">
                    <circle cx="12" cy="12" r="10" fill="url(#colorfulGradient)"/>
                    <defs>
                      <linearGradient id="colorfulGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFDEE9"/>
                        <stop offset="100%" style="stop-color:#B5FFFC"/>
                      </linearGradient>
                    </defs>
                    <circle cx="8" cy="8" r="2" fill="#ec4899"/>
                    <circle cx="16" cy="8" r="2" fill="#06d6a0"/>
                    <circle cx="12" cy="16" r="2" fill="#ffd23f"/>
                  </g>
                </ng-container>
              </svg>
            </div>

            <div class="theme-info">
              <div class="theme-name">{{ theme.displayName }}</div>
              <div class="theme-description">{{ theme.description }}</div>
            </div>

            <div class="theme-check" *ngIf="currentTheme === theme.name">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#10B981" stroke="#059669" stroke-width="1"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
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
      position: fixed !important;
      bottom: 100px !important;
      right: 24px !important;
      z-index: 99999 !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    .theme-toggle-btn {
      width: 56px !important;
      height: 56px !important;
      border-radius: 50% !important;
      background: #6C63FF !important;
      border: none !important;
      color: white !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3) !important;
      transition: all 0.3s ease !important;
      position: relative !important;
      overflow: hidden !important;
      visibility: visible !important;
      opacity: 1 !important;
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
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(108, 99, 255, 0.4);
      background: #5b52d9 !important;
    }

    .theme-toggle-btn.active {
      background: #5b52d9 !important;
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(108, 99, 255, 0.5);
    }

    .theme-icon-svg {
      width: 32px !important;
      height: 32px !important;
      display: block !important;
      margin: 0 auto !important;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: none !important;
    }

    /* Global mat-icon styling for this component */
    mat-icon {
      font-family: 'Material Icons' !important;
      font-weight: normal !important;
      font-style: normal !important;
      font-size: 20px !important;
      line-height: 1 !important;
      letter-spacing: normal !important;
      text-transform: none !important;
      display: inline-block !important;
      white-space: nowrap !important;
      word-wrap: normal !important;
      direction: ltr !important;
      -webkit-font-feature-settings: 'liga' !important;
      -webkit-font-smoothing: antialiased !important;
    }

    .theme-panel {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 320px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      backdrop-filter: blur(20px);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s ease;
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
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .theme-panel-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }

    .close-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: #e2e8f0;
      color: #1e293b;
    }

    .close-btn svg {
      width: 18px !important;
      height: 18px !important;
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
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
      background: white;
    }

    .theme-option:hover {
      background: #f8fafc;
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .theme-option.active {
      border-color: #6C63FF;
      background: rgba(108, 99, 255, 0.05);
    }

    .theme-icon-container {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: #f1f5f9;
      margin-right: 16px;
      flex-shrink: 0;
    }

    .theme-option-icon {
      width: 24px !important;
      height: 24px !important;
    }

    .theme-info {
      flex: 1;
    }

    .theme-name {
      font-weight: 600;
      font-size: 15px;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .theme-description {
      font-size: 13px;
      color: #64748b;
      line-height: 1.4;
    }

    .theme-check {
      margin-left: 12px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .theme-check svg {
      width: 24px !important;
      height: 24px !important;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
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
        bottom: 100px;
        right: 16px;
      }

      .theme-panel {
        width: 280px;
        right: -20px;
        bottom: 60px;
      }

      .theme-toggle-btn {
        width: 48px;
        height: 48px;
      }
    }

    /* Larger screens - closer to bottom */
    @media (min-width: 769px) {
      .professional-theme-switcher {
        bottom: 24px;
        right: 24px;
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

  constructor(private themeService: ThemeService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Get available themes
    this.availableThemes = this.themeService.getAllThemes();

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      console.log('🔄 Theme changed to:', theme);
      this.currentTheme = theme;
      this.cdr.detectChanges();
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
    console.log('🎯 FloatingThemeButton.selectTheme called with:', themeName);

    const theme = themeName as Theme;
    console.log('🔄 Converted to Theme type:', theme);
    console.log('🎯 Calling themeService.setTheme...');

    // Update local state immediately for UI feedback
    this.currentTheme = theme;

    // Trigger change detection to update UI immediately
    this.cdr.detectChanges();

    this.themeService.setTheme(theme);

    // Close panel after selection with delay for visual feedback
    setTimeout(() => {
      this.isPanelOpen = false;
      console.log('🎯 Theme panel closed');
    }, 500);
  }  refreshTheme(): void {
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
