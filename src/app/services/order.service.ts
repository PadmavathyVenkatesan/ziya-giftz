import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    landmark?: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderDate: Date;
  estimatedDelivery?: Date;
  trackingDetails?: {
    currentLocation?: string;
    lastUpdate?: Date;
    statusHistory: {
      status: string;
      timestamp: Date;
      location?: string;
      description?: string;
    }[];
  };
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api'; // Your backend API URL
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  // Generate unique order number
  generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PG${timestamp.slice(-6)}${random}`;
  }

  // Create a new order
  createOrder(orderData: Omit<Order, '_id' | 'orderNumber' | 'orderDate'>): Observable<{ success: boolean; order?: Order; message?: string }> {
    const order: Order = {
      ...orderData,
      orderNumber: this.generateOrderNumber(),
      orderDate: new Date(),
      status: 'placed',
      paymentStatus: 'pending'
    };

    return this.http.post<{ success: boolean; order?: Order; message?: string }>(`${this.apiUrl}/orders`, order)
      .pipe(
        map(response => {
          if (response.success && response.order) {
            this.addOrderToLocal(response.order);
          }
          return response;
        }),
        catchError(error => {
          console.error('Error creating order:', error);
          // Fallback to local storage
          this.saveOrderLocally(order);
          return of({ success: true, order, message: 'Order saved locally' });
        })
      );
  }

  // Get order by order number
  getOrderByNumber(orderNumber: string): Observable<{ success: boolean; order?: Order; message?: string }> {
    return this.http.get<{ success: boolean; order?: Order; message?: string }>(`${this.apiUrl}/orders/track/${orderNumber}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching order:', error);
          // Fallback to local storage
          const localOrder = this.getOrderFromLocal(orderNumber);
          if (localOrder) {
            return of({ success: true, order: localOrder });
          }
          return of({ success: false, message: 'Order not found' });
        })
      );
  }

  // Get user orders
  getUserOrders(customerId: string): Observable<{ success: boolean; orders?: Order[]; message?: string }> {
    return this.http.get<{ success: boolean; orders?: Order[]; message?: string }>(`${this.apiUrl}/orders/user/${customerId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user orders:', error);
          // Fallback to local storage
          const localOrders = this.getUserOrdersFromLocal(customerId);
          return of({ success: true, orders: localOrders });
        })
      );
  }

  // Update order status
  updateOrderStatus(orderNumber: string, status: Order['status'], location?: string, description?: string): Observable<{ success: boolean; message?: string }> {
    const updateData = {
      status,
      trackingUpdate: {
        status,
        timestamp: new Date(),
        location,
        description
      }
    };

    return this.http.put<{ success: boolean; message?: string }>(`${this.apiUrl}/orders/${orderNumber}/status`, updateData)
      .pipe(
        catchError(error => {
          console.error('Error updating order status:', error);
          // Fallback to local storage
          this.updateOrderStatusLocally(orderNumber, status, location, description);
          return of({ success: true, message: 'Status updated locally' });
        })
      );
  }

  // Load orders for current user
  loadOrders(): void {
    const customerId = this.getCurrentUserId();
    if (customerId) {
      this.getUserOrders(customerId).subscribe(response => {
        if (response.success && response.orders) {
          this.ordersSubject.next(response.orders);
        }
      });
    }
  }

  // Local storage fallback methods
  private saveOrderLocally(order: Order): void {
    const orders = this.getOrdersFromLocalStorage();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    this.addOrderToLocal(order);
  }

  private addOrderToLocal(order: Order): void {
    const currentOrders = this.ordersSubject.value;
    this.ordersSubject.next([...currentOrders, order]);
  }

  private getOrdersFromLocalStorage(): Order[] {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  }

  private getOrderFromLocal(orderNumber: string): Order | null {
    const orders = this.getOrdersFromLocalStorage();
    return orders.find(order => order.orderNumber === orderNumber) || null;
  }

  private getUserOrdersFromLocal(customerId: string): Order[] {
    const orders = this.getOrdersFromLocalStorage();
    return orders.filter(order => order.customerId === customerId);
  }

  private updateOrderStatusLocally(orderNumber: string, status: Order['status'], location?: string, description?: string): void {
    const orders = this.getOrdersFromLocalStorage();
    const orderIndex = orders.findIndex(order => order.orderNumber === orderNumber);

    if (orderIndex !== -1) {
      orders[orderIndex].status = status;

      if (!orders[orderIndex].trackingDetails) {
        orders[orderIndex].trackingDetails = { statusHistory: [] };
      }

      orders[orderIndex].trackingDetails!.statusHistory.push({
        status,
        timestamp: new Date(),
        location,
        description
      });

      if (location) {
        orders[orderIndex].trackingDetails!.currentLocation = location;
        orders[orderIndex].trackingDetails!.lastUpdate = new Date();
      }

      localStorage.setItem('orders', JSON.stringify(orders));

      // Update the observable
      const currentOrders = this.ordersSubject.value;
      const currentOrderIndex = currentOrders.findIndex(order => order.orderNumber === orderNumber);
      if (currentOrderIndex !== -1) {
        currentOrders[currentOrderIndex] = orders[orderIndex];
        this.ordersSubject.next([...currentOrders]);
      }
    }
  }

  private getCurrentUserId(): string | null {
    // This should get the current user ID from your auth service
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user._id || user.id || null;
  }

  // Get order status display info
  getOrderStatusInfo(status: Order['status']): { text: string; color: string; icon: string } {
    switch (status) {
      case 'placed':
        return { text: 'Order Placed', color: '#2196F3', icon: 'receipt' };
      case 'confirmed':
        return { text: 'Confirmed', color: '#4CAF50', icon: 'check_circle' };
      case 'processing':
        return { text: 'Processing', color: '#FF9800', icon: 'settings' };
      case 'shipped':
        return { text: 'Shipped', color: '#9C27B0', icon: 'local_shipping' };
      case 'delivered':
        return { text: 'Delivered', color: '#4CAF50', icon: 'done_all' };
      case 'cancelled':
        return { text: 'Cancelled', color: '#F44336', icon: 'cancel' };
      default:
        return { text: 'Unknown', color: '#757575', icon: 'help' };
    }
  }

  // Estimate delivery date (3-7 days from order date)
  estimateDelivery(orderDate: Date): Date {
    const deliveryDays = Math.floor(Math.random() * 5) + 3; // 3-7 days
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
    return estimatedDate;
  }

  // Get all orders (admin function)
  getAllOrders(): Order[] {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }

  // Get orders with pagination and filtering (admin function)
  getOrdersWithFilters(
    page: number = 1,
    limit: number = 10,
    status?: Order['status'],
    dateFrom?: Date,
    dateTo?: Date
  ): Observable<{orders: Order[], total: number, hasMore: boolean}> {
    return new Observable(observer => {
      let orders = this.getAllOrders();

      // Apply filters
      if (status) {
        orders = orders.filter(order => order.status === status);
      }

      if (dateFrom) {
        orders = orders.filter(order => new Date(order.orderDate) >= dateFrom);
      }

      if (dateTo) {
        orders = orders.filter(order => new Date(order.orderDate) <= dateTo);
      }

      // Sort by date (newest first)
      orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

      const total = orders.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = orders.slice(startIndex, endIndex);

      observer.next({
        orders: paginatedOrders,
        total,
        hasMore: endIndex < total
      });
      observer.complete();
    });
  }
}
