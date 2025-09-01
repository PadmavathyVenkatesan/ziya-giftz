import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface OrderDetails {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    name: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  };
  estimatedDelivery?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WhatsappNotificationService {
  private readonly BUSINESS_PHONE = '+918555032750';

  constructor(private http: HttpClient) {}

  sendOrderConfirmation(orderDetails: OrderDetails): Observable<any> {
    const message = this.formatOrderMessage(orderDetails);
    const whatsappUrl = this.generateWhatsAppUrl(orderDetails.customerPhone, message);

    try {
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }

    return of({ success: true, message: 'WhatsApp URL generated successfully' });
  }

  sendOrderNotificationToBusiness(orderDetails: OrderDetails): Observable<any> {
    const message = this.formatBusinessNotificationMessage(orderDetails);
    const whatsappUrl = this.generateWhatsAppUrl(this.BUSINESS_PHONE, message);

    try {
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp for business:', error);
    }

    return of({ success: true, message: 'Business WhatsApp notification sent' });
  }

  private formatOrderMessage(order: OrderDetails): string {
    const itemsList = order.items.map(item =>
      `• ${item.name} (Qty: ${item.quantity}) - ₹${item.price}`
    ).join('\n');

    const orderDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `🎁 *Order Confirmation - Padma Giftz*

Hello ${order.customerName}! 👋

Thank you for your order! Your order has been confirmed.

📋 *Order Details:*
Order Number: *${order.orderNumber}*
Order Date: ${orderDate}
Total Amount: *₹${order.totalAmount}*

🛍️ *Items Ordered:*
${itemsList}

📍 *Delivery Address:*
${order.shippingAddress.name}
${order.shippingAddress.addressLine1}
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}

🚚 We'll process your order and update you with tracking details soon!

For any queries, feel free to contact us.

Thank you for choosing Padma Giftz! 💜`;
  }

  private formatBusinessNotificationMessage(order: OrderDetails): string {
    const itemsList = order.items.map(item =>
      `• ${item.name} (Qty: ${item.quantity}) - ₹${item.price}`
    ).join('\n');

    return `🔔 *New Order Alert - Padma Giftz*

New order received! 📋

*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Order Number:* ${order.orderNumber}
*Total Amount:* ₹${order.totalAmount}

*Items:*
${itemsList}

*Delivery Address:*
${order.shippingAddress.name}
${order.shippingAddress.addressLine1}
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}

Please process this order promptly! 🚀`;
  }

  private generateWhatsAppUrl(phoneNumber: string, message: string): string {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  }

  sendQuickMessage(phoneNumber: string, message: string): void {
    const whatsappUrl = this.generateWhatsAppUrl(phoneNumber, message);
    window.open(whatsappUrl, '_blank');
  }

  sendOrderStatusUpdate(phoneNumber: string, orderNumber: string, status: string): void {
    const message = `🔄 *Order Update - Padma Giftz*

Your order *${orderNumber}* status has been updated to: *${status}*

Thank you for your patience! 💜`;

    this.sendQuickMessage(phoneNumber, message);
  }
}
