import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  constructor() {}

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addToast(toast: Omit<Toast, 'id'>): void {
    const newToast: Toast = {
      ...toast,
      id: this.generateId(),
      duration: toast.duration ?? 5000,
      dismissible: toast.dismissible ?? true
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.removeToast(newToast.id);
      }, newToast.duration);
    }
  }

  success(message: string, title?: string, duration?: number): void {
    this.addToast({
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(message: string, title?: string, duration?: number): void {
    this.addToast({
      type: 'error',
      title: title || 'Error',
      message,
      duration: duration || 8000 // Longer duration for errors
    });
  }

  warning(message: string, title?: string, duration?: number): void {
    this.addToast({
      type: 'warning',
      title: title || 'Warning',
      message,
      duration
    });
  }

  info(message: string, title?: string, duration?: number): void {
    this.addToast({
      type: 'info',
      title,
      message,
      duration
    });
  }

  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  clearAll(): void {
    this.toastsSubject.next([]);
  }
}
