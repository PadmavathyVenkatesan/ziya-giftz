import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../../services/order.service';
import { WhatsappNotificationService } from '../../../services/whatsapp-notification.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="order-management-container">
      <h2>Order Management & WhatsApp Notifications</h2>

      <div class="search-section">
        <input
          type="text"
          [(ngModel)]="searchOrderNumber"
          placeholder="Enter Order Number"
          class="search-input">
        <button (click)="searchOrder()" class="search-btn">
          <mat-icon>search</mat-icon>
          Search Order
        </button>
      </div>

      <div *ngIf="selectedOrder" class="order-details">
        <h3>Order Details</h3>
        <div class="order-info">
          <p><strong>Order Number:</strong> {{selectedOrder.orderNumber}}</p>
          <p><strong>Customer:</strong> {{selectedOrder.customerName}}</p>
          <p><strong>Phone:</strong> {{selectedOrder.customerPhone}}</p>
          <p><strong>Total:</strong> ₹{{selectedOrder.totalAmount}}</p>
          <p><strong>Status:</strong> {{selectedOrder.status}}</p>
        </div>

        <div class="status-update-section">
          <h4>Update Order Status</h4>
          <select [(ngModel)]="newStatus" class="status-select">
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
          <button (click)="updateOrderStatus()" class="update-btn">
            <mat-icon>send</mat-icon>
            Update & Send WhatsApp
          </button>
        </div>

        <div class="quick-actions">
          <h4>Quick WhatsApp Actions</h4>
          <button (click)="sendOrderConfirmation()" class="action-btn">
            <mat-icon>check_circle</mat-icon>
            Send Order Confirmation
          </button>
          <button (click)="sendCustomMessage()" class="action-btn">
            <mat-icon>message</mat-icon>
            Send Custom Message
          </button>
        </div>

        <div *ngIf="showCustomMessage" class="custom-message-section">
          <textarea
            [(ngModel)]="customMessage"
            placeholder="Enter your custom message..."
            class="custom-message-input">
          </textarea>
          <button (click)="sendCustomWhatsApp()" class="send-btn">
            <mat-icon>send</mat-icon>
            Send Message
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-management-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    h2 {
      color: #1a1a1a;
      margin-bottom: 2rem;
      font-family: 'Poppins', sans-serif;
    }

    .search-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .search-btn, .update-btn, .action-btn, .send-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .search-btn:hover, .update-btn:hover, .action-btn:hover, .send-btn:hover {
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
      transform: translateY(-1px);
    }

    .order-details {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .order-info {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .order-info p {
      margin: 0.5rem 0;
      color: #374151;
    }

    .status-update-section {
      margin: 1.5rem 0;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .status-select {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      margin-right: 1rem;
      font-size: 1rem;
    }

    .quick-actions {
      margin: 1.5rem 0;
    }

    .quick-actions button {
      margin-right: 1rem;
      margin-bottom: 0.5rem;
    }

    .custom-message-section {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.5rem;
    }

    .custom-message-input {
      width: 100%;
      min-height: 100px;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      resize: vertical;
      font-family: inherit;
      margin-bottom: 1rem;
    }

    h3, h4 {
      color: #1f2937;
      margin-bottom: 1rem;
    }
  `]
})
export class OrderManagementComponent implements OnInit {
  searchOrderNumber = '';
  selectedOrder: any = null;
  newStatus: 'confirmed' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' = 'confirmed';
  showCustomMessage = false;
  customMessage = '';

  constructor(
    private orderService: OrderService,
    private whatsappService: WhatsappNotificationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  searchOrder(): void {
    if (!this.searchOrderNumber.trim()) {
      this.toastService.warning('Please enter an order number');
      return;
    }

    this.orderService.getOrderByNumber(this.searchOrderNumber).subscribe({
      next: (response) => {
        if (response.success && response.order) {
          this.selectedOrder = response.order;
          this.toastService.success('Order found successfully');
        } else {
          this.toastService.error('Order not found');
          this.selectedOrder = null;
        }
      },
      error: (error) => {
        this.toastService.error('Error searching for order');
        console.error('Error:', error);
      }
    });
  }

  updateOrderStatus(): void {
    if (!this.selectedOrder) return;

    this.orderService.updateOrderStatus(this.selectedOrder._id, this.newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedOrder.status = this.newStatus;

          // Send WhatsApp notification
          this.whatsappService.sendOrderStatusUpdate(
            this.selectedOrder.customerPhone,
            this.selectedOrder.orderNumber,
            this.newStatus
          );

          this.toastService.success('Order status updated and WhatsApp notification sent');
        } else {
          this.toastService.error('Failed to update order status');
        }
      },
      error: (error) => {
        this.toastService.error('Error updating order status');
        console.error('Error:', error);
      }
    });
  }

  sendOrderConfirmation(): void {
    if (!this.selectedOrder) return;

    const orderDetails = {
      orderNumber: this.selectedOrder.orderNumber,
      customerName: this.selectedOrder.customerName,
      customerPhone: this.selectedOrder.customerPhone,
      items: this.selectedOrder.items,
      totalAmount: this.selectedOrder.totalAmount,
      shippingAddress: this.selectedOrder.shippingAddress,
      estimatedDelivery: this.selectedOrder.estimatedDelivery
    };

    this.whatsappService.sendOrderConfirmation(orderDetails).subscribe({
      next: () => {
        this.toastService.success('Order confirmation sent via WhatsApp');
      },
      error: (error: any) => {
        this.toastService.error('Error sending WhatsApp confirmation');
        console.error('Error:', error);
      }
    });
  }

  sendCustomMessage(): void {
    this.showCustomMessage = !this.showCustomMessage;
    if (this.showCustomMessage) {
      this.customMessage = `Dear ${this.selectedOrder?.customerName || 'Customer'},\n\nRegarding your order ${this.selectedOrder?.orderNumber || ''}:\n\n`;
    }
  }

  sendCustomWhatsApp(): void {
    if (!this.selectedOrder || !this.customMessage.trim()) {
      this.toastService.warning('Please enter a message');
      return;
    }

    this.whatsappService.sendQuickMessage(
      this.selectedOrder.customerPhone,
      this.customMessage
    );

    this.toastService.success('WhatsApp message sent');
    this.showCustomMessage = false;
    this.customMessage = '';
  }
}
