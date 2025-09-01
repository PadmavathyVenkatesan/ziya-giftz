import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { OrderService, Order } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss'
})
export class TrackOrderComponent implements OnInit {
  trackForm: FormGroup;
  trackingSubmitted = false;
  orderFound = false;
  isLoading = false;
  currentOrder: Order | null = null;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private orderService: OrderService,
    private toastService: ToastService
  ) {
    this.trackForm = this.fb.group({
      orderNumber: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9-]+$')]]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Track Your Order | Padma Giftz');
  }

  trackOrder(): void {
    if (this.trackForm.valid) {
      this.trackingSubmitted = true;
      this.isLoading = true;
      const orderNumber = this.trackForm.get('orderNumber')?.value.trim();

      this.orderService.getOrderByNumber(orderNumber).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.order) {
            this.orderFound = true;
            this.currentOrder = response.order;
            this.toastService.success('Order found successfully!');
          } else {
            this.orderFound = false;
            this.currentOrder = null;
            this.toastService.error('Order not found. Please check your order number.');
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.orderFound = false;
          this.currentOrder = null;
          this.toastService.error('Error tracking order: ' + error.message);
        }
      });
    } else {
      this.trackForm.markAllAsTouched();
      this.toastService.warning('Please enter a valid order number');
    }
  }

  getOrderStatusInfo(status: Order['status']) {
    return this.orderService.getOrderStatusInfo(status);
  }

  getStatusProgress(status: Order['status']): number {
    switch (status) {
      case 'placed': return 20;
      case 'confirmed': return 40;
      case 'processing': return 60;
      case 'shipped': return 80;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  resetTracking(): void {
    this.trackingSubmitted = false;
    this.orderFound = false;
    this.currentOrder = null;
    this.trackForm.reset();
  }


}
