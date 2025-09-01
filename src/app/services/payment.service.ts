import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

declare var Razorpay: any;

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface PaymentOptions {
  amount: number;
  currency?: string;
  receipt?: string;
  description: string;
  customer: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create Razorpay order
   */
  createRazorpayOrder(options: PaymentOptions): Observable<{ success: boolean; order: RazorpayOrder }> {
    return this.http.post<{ success: boolean; order: RazorpayOrder }>(
      `${this.apiUrl}/payments/razorpay/create-order`,
      {
        amount: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt || `order_${Date.now()}`
      }
    );
  }

  /**
   * Verify Razorpay payment
   */
  verifyRazorpayPayment(paymentData: any): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/payments/razorpay/verify`,
      paymentData
    );
  }

  /**
   * Initialize Razorpay payment
   */
  initializeRazorpayPayment(order: RazorpayOrder, options: PaymentOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      const razorpayOptions = {
        key: environment.razorpay.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Padma Giftz',
        description: options.description,
        image: '/assets/logos/logo.png',
        order_id: order.id,
        prefill: {
          name: options.customer.name,
          email: options.customer.email,
          contact: options.customer.contact
        },
        notes: options.notes || {},
        theme: {
          color: '#9c59be'
        },
        handler: (response: any) => {
          // Payment successful
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            // Payment cancelled
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      if (typeof Razorpay === 'undefined') {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      const razorpayInstance = new Razorpay(razorpayOptions);
      razorpayInstance.open();
    });
  }

  /**
   * Load Razorpay script
   */
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof Razorpay !== 'undefined') {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }
}
