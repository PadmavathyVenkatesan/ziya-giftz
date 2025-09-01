import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-special-offers-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './special-offers-banner.component.html',
  styleUrls: ['./special-offers-banner.component.scss']
})
export class SpecialOffersBannerComponent {
  @Input() offerCode: string = 'BDAYGIFT20';
  @Input() offerText: string = 'Get 20% off on all Birthday Gifts';
  @Input() offerTitle: string = 'Limited Time Offer!';
  @Input() targetRoute: string = '/category/birthday';

  navigateToOffer(): void {
    // This will be handled by routerLink in the template
  }
}
