import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent {
  orderId = 'OD' + Math.floor(Math.random() * 9000000000 + 1000000000);
  orderDate = new Date();
  expectedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  expandedSection: string | null = null;

  toggleSection(section: string): void {
    if (this.expandedSection === section) {
      this.expandedSection = null;
    } else {
      this.expandedSection = section;
    }
  }
}
