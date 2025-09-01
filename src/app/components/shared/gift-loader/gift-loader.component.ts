import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gift-loader',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="gift-loader-container" [class.show]="isLoading">
      <div class="gift-loader-backdrop"></div>
      <div class="gift-loader-content">
        <!-- Animated Gift Boxes -->
        <div class="gift-boxes">
          <div class="gift-box gift-box-1">
            <div class="box-lid"></div>
            <div class="box-body"></div>
            <div class="ribbon-v"></div>
            <div class="ribbon-h"></div>
            <div class="sparkles">
              <div class="sparkle sparkle-1"></div>
              <div class="sparkle sparkle-2"></div>
              <div class="sparkle sparkle-3"></div>
            </div>
          </div>

          <div class="gift-box gift-box-2">
            <div class="box-lid"></div>
            <div class="box-body"></div>
            <div class="ribbon-v"></div>
            <div class="ribbon-h"></div>
            <div class="sparkles">
              <div class="sparkle sparkle-1"></div>
              <div class="sparkle sparkle-2"></div>
            </div>
          </div>

          <div class="gift-box gift-box-3">
            <div class="box-lid"></div>
            <div class="box-body"></div>
            <div class="ribbon-v"></div>
            <div class="ribbon-h"></div>
            <div class="sparkles">
              <div class="sparkle sparkle-1"></div>
              <div class="sparkle sparkle-2"></div>
              <div class="sparkle sparkle-3"></div>
              <div class="sparkle sparkle-4"></div>
            </div>
          </div>
        </div>

        <!-- Loading Text -->
        <div class="loading-text">
          <span class="letter l1">L</span>
          <span class="letter l2">o</span>
          <span class="letter l3">a</span>
          <span class="letter l4">d</span>
          <span class="letter l5">i</span>
          <span class="letter l6">n</span>
          <span class="letter l7">g</span>
          <span class="dots">
            <span class="dot dot1">.</span>
            <span class="dot dot2">.</span>
            <span class="dot dot3">.</span>
          </span>
        </div>

        <!-- Loading Message -->
        <div class="loading-message" *ngIf="message">
          {{ message }}
        </div>

        <!-- Floating Icons -->
        <div class="floating-icons">
          <mat-icon class="floating-icon icon-1">card_giftcard</mat-icon>
          <mat-icon class="floating-icon icon-2">favorite</mat-icon>
          <mat-icon class="floating-icon icon-3">celebration</mat-icon>
          <mat-icon class="floating-icon icon-4">star</mat-icon>
          <mat-icon class="floating-icon icon-5">emoji_emotions</mat-icon>
          <mat-icon class="floating-icon icon-6">cake</mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gift-loader-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;

      &.show {
        opacity: 1;
        visibility: visible;
      }
    }

    .gift-loader-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg,
        rgba(156, 89, 190, 0.95) 0%,
        rgba(118, 75, 162, 0.95) 25%,
        rgba(255, 71, 87, 0.95) 50%,
        rgba(255, 179, 71, 0.95) 75%,
        rgba(156, 89, 190, 0.95) 100%
      );
      backdrop-filter: blur(10px);
      animation: backgroundShift 6s ease-in-out infinite;
    }

    @keyframes backgroundShift {
      0%, 100% {
        background: linear-gradient(135deg,
          rgba(156, 89, 190, 0.95) 0%,
          rgba(118, 75, 162, 0.95) 25%,
          rgba(255, 71, 87, 0.95) 50%,
          rgba(255, 179, 71, 0.95) 75%,
          rgba(156, 89, 190, 0.95) 100%
        );
      }
      33% {
        background: linear-gradient(135deg,
          rgba(255, 71, 87, 0.95) 0%,
          rgba(255, 179, 71, 0.95) 25%,
          rgba(156, 89, 190, 0.95) 50%,
          rgba(118, 75, 162, 0.95) 75%,
          rgba(255, 71, 87, 0.95) 100%
        );
      }
      66% {
        background: linear-gradient(135deg,
          rgba(255, 179, 71, 0.95) 0%,
          rgba(156, 89, 190, 0.95) 25%,
          rgba(118, 75, 162, 0.95) 50%,
          rgba(255, 71, 87, 0.95) 75%,
          rgba(255, 179, 71, 0.95) 100%
        );
      }
    }

    .gift-loader-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;
    }

    .gift-boxes {
      display: flex;
      gap: 20px;
      margin-bottom: 40px;
    }

    .gift-box {
      position: relative;
      width: 60px;
      height: 60px;
      animation: bounce 2s ease-in-out infinite;

      &.gift-box-1 {
        animation-delay: 0s;
      }
      &.gift-box-2 {
        animation-delay: 0.3s;
      }
      &.gift-box-3 {
        animation-delay: 0.6s;
      }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0) scale(1);
      }
      40% {
        transform: translateY(-15px) scale(1.1);
      }
      60% {
        transform: translateY(-10px) scale(1.05);
      }
    }

    .box-body {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 70%;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .gift-box-1 .box-body {
      background: linear-gradient(135deg, #ff4757, #ff3838);
    }

    .gift-box-2 .box-body {
      background: linear-gradient(135deg, #3742fa, #2f3542);
    }

    .gift-box-3 .box-body {
      background: linear-gradient(135deg, #2ed573, #1e90ff);
    }

    .box-lid {
      position: absolute;
      top: 0;
      left: -5%;
      width: 110%;
      height: 35%;
      border-radius: 8px 8px 4px 4px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      animation: lidFloat 3s ease-in-out infinite;
    }

    @keyframes lidFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-3px);
      }
    }

    .ribbon-v, .ribbon-h {
      position: absolute;
      background: linear-gradient(135deg, #ffd700, #ffb347);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .ribbon-v {
      top: 0;
      left: 50%;
      width: 8px;
      height: 100%;
      transform: translateX(-50%);
    }

    .ribbon-h {
      top: 50%;
      left: 0;
      width: 100%;
      height: 8px;
      transform: translateY(-50%);
    }

    .sparkles {
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      pointer-events: none;
    }

    .sparkle {
      position: absolute;
      width: 6px;
      height: 6px;
      background: #fff;
      border-radius: 50%;
      animation: sparkle 2s ease-in-out infinite;
    }

    .sparkle-1 { top: 10%; left: 20%; animation-delay: 0s; }
    .sparkle-2 { top: 20%; right: 15%; animation-delay: 0.5s; }
    .sparkle-3 { bottom: 30%; left: 10%; animation-delay: 1s; }
    .sparkle-4 { bottom: 20%; right: 20%; animation-delay: 1.5s; }

    @keyframes sparkle {
      0%, 100% {
        opacity: 0;
        transform: scale(0);
      }
      50% {
        opacity: 1;
        transform: scale(1);
      }
    }

    .loading-text {
      font-family: var(--font-family);
      font-size: 2.5rem;
      font-weight: 800;
      color: #fff;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .letter {
      display: inline-block;
      animation: letterBounce 1.4s ease-in-out infinite;
    }

    .l1 { animation-delay: 0.1s; color: #ff4757; }
    .l2 { animation-delay: 0.2s; color: #ff6b7a; }
    .l3 { animation-delay: 0.3s; color: #3742fa; }
    .l4 { animation-delay: 0.4s; color: #5352ed; }
    .l5 { animation-delay: 0.5s; color: #2ed573; }
    .l6 { animation-delay: 0.6s; color: #1dd1a1; }
    .l7 { animation-delay: 0.7s; color: #ffa502; }

    @keyframes letterBounce {
      0%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
    }

    .dots {
      margin-left: 5px;
    }

    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fff;
      margin: 0 2px;
      animation: dotPulse 1.5s ease-in-out infinite;
    }

    .dot1 { animation-delay: 0s; }
    .dot2 { animation-delay: 0.3s; }
    .dot3 { animation-delay: 0.6s; }

    @keyframes dotPulse {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .loading-message {
      font-family: var(--font-family);
      font-size: 1.1rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      text-align: center;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      animation: messageFade 2s ease-in-out infinite;
    }

    @keyframes messageFade {
      0%, 100% {
        opacity: 0.7;
      }
      50% {
        opacity: 1;
      }
    }

    .floating-icons {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .floating-icon {
      position: absolute;
      font-size: 24px !important;
      color: rgba(255, 255, 255, 0.6);
      animation: float 6s ease-in-out infinite;
    }

    .icon-1 {
      top: 20%;
      left: 10%;
      animation-delay: 0s;
      color: #ff4757;
    }

    .icon-2 {
      top: 30%;
      right: 15%;
      animation-delay: 1s;
      color: #ff6b7a;
    }

    .icon-3 {
      bottom: 40%;
      left: 15%;
      animation-delay: 2s;
      color: #3742fa;
    }

    .icon-4 {
      top: 60%;
      right: 20%;
      animation-delay: 3s;
      color: #ffd700;
    }

    .icon-5 {
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
      color: #2ed573;
    }

    .icon-6 {
      top: 15%;
      right: 30%;
      animation-delay: 5s;
      color: #ffa502;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.4;
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.8;
      }
    }

    /* Mobile responsiveness */
    @media (max-width: 480px) {
      .gift-boxes {
        gap: 15px;
      }

      .gift-box {
        width: 50px;
        height: 50px;
      }

      .loading-text {
        font-size: 2rem;
      }

      .loading-message {
        font-size: 1rem;
        padding: 0 20px;
      }

      .floating-icon {
        font-size: 20px !important;
      }
    }

    /* Theme-based font families */
    [data-theme="default"] .loading-text,
    [data-theme="default"] .loading-message {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    [data-theme="dark"] .loading-text,
    [data-theme="dark"] .loading-message {
      font-family: 'Poppins', 'Arial', sans-serif;
      letter-spacing: 1px;
    }

    [data-theme="colorful"] .loading-text,
    [data-theme="colorful"] .loading-message {
      font-family: 'Comfortaa', 'Comic Sans MS', cursive;
      letter-spacing: 0.5px;
    }

    [data-theme="minimal"] .loading-text,
    [data-theme="minimal"] .loading-message {
      font-family: 'Roboto', 'Helvetica Neue', sans-serif;
      font-weight: 300;
      letter-spacing: 2px;
    }
  `]
})
export class GiftLoaderComponent {
  @Input() isLoading: boolean = false;
  @Input() message: string = 'Preparing your amazing gifts...';
}
