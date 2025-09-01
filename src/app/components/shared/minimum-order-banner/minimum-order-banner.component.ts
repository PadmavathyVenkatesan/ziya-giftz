import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-minimum-order-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './minimum-order-banner.component.html',
  styleUrl: './minimum-order-banner.component.scss',
  animations: [
    trigger('pulseAnimation', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('pulsed', style({
        transform: 'scale(1.05)'
      })),
      transition('normal <=> pulsed', animate('500ms ease-in-out'))
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class MinimumOrderBannerComponent implements OnInit {
  @Input() minimumAmount: number = 300;
  @Input() showPromotional: boolean = false;
  
  pulseState: 'normal' | 'pulsed' = 'normal';
  promotionalMessages: string[] = [
    '🎁 Free Shipping on Orders Over ₹1000',
    '✨ Special Discount on Festival Gifts',
    '🌟 New Gift Collections Added!',
    '🚚 Express Delivery Available',
    '🎂 Birthday Gifts Starting at ₹499'
  ];
  currentMessageIndex: number = 0;
  currentMessage: string = '';
  
  ngOnInit() {
    this.currentMessage = this.promotionalMessages[0];
    
    // Start the pulse animation
    setInterval(() => {
      this.pulseState = this.pulseState === 'normal' ? 'pulsed' : 'normal';
    }, 2000);
    
    // Rotate through promotional messages every 5 seconds
    if (this.showPromotional) {
      setInterval(() => {
        this.currentMessageIndex = (this.currentMessageIndex + 1) % this.promotionalMessages.length;
        this.currentMessage = this.promotionalMessages[this.currentMessageIndex];
      }, 5000);
    }
  }
}
