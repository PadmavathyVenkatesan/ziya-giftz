import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { OrderService, Order } from '../../services/order.service';
import { AddressService, Address } from '../../services/address.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  isLoading = true;
  activeTab = 'profile'; // Default active tab
  showPasswordForm = false; // For showing/hiding password change form

  // Orders
  userOrders: Order[] = [];
  isLoadingOrders = false;

  // Password change form
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  passwordChangeLoading = false;
  passwordChangeError = '';
  passwordChangeSuccess = '';

  // Address management
  showAddAddressForm = false;
  editingAddress: any = null;
  addressFormLoading = false;
  addresses: Address[] = [];
  addressForm: Address = {
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    landmark: '',
    type: 'home',
    isDefault: false
  };

  // Confirmation dialog
  showConfirmDialog = false;
  confirmDialogData = {
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {}
  };

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private orderService: OrderService,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    // Get current user from auth service
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoading = false;

      // Load user orders when user data is available
      if (user) {
        this.loadUserOrders();
        this.loadAddresses();
      }
    });

    // Subscribe to addresses updates
    this.addressService.addresses$.subscribe(addresses => {
      this.addresses = addresses;
    });

    // Refresh user data from server
    this.refreshUserData();
  }

  refreshUserData(): void {
    this.isLoading = true;
    this.authService.refreshUserData().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  logout(): void {
    this.authService.logout();
  }

  getDefaultAddress(): any {
    if (this.currentUser?.addresses && this.currentUser.addresses.length > 0) {
      // Find default address or return first one
      return this.currentUser.addresses.find((addr: any) => addr.isDefault) || this.currentUser.addresses[0];
    }
    return null;
  }

  updatePassword(): void {
    // Reset messages
    this.passwordChangeError = '';
    this.passwordChangeSuccess = '';

    // Validate form
    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      this.passwordChangeError = 'All password fields are required';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordChangeError = 'New passwords do not match';
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.passwordChangeError = 'New password must be at least 6 characters long';
      return;
    }

    this.passwordChangeLoading = true;

    this.authService.updatePassword(this.passwordForm.currentPassword, this.passwordForm.newPassword).subscribe({
      next: (response) => {
        this.passwordChangeLoading = false;
        this.passwordChangeSuccess = 'Password updated successfully';

        // Clear form and hide it
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };

        // Hide form after success
        setTimeout(() => {
          this.showPasswordForm = false;
          this.passwordChangeSuccess = '';
        }, 2000);
      },
      error: (error) => {
        this.passwordChangeLoading = false;
        this.passwordChangeError = error.error?.message || 'Failed to update password';
        this.toastService.error(this.passwordChangeError);
      }
    });
  }

  cancelPasswordChange(): void {
    this.showPasswordForm = false;
    this.passwordChangeError = '';
    this.passwordChangeSuccess = '';
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  // Address Management Methods
  loadAddresses(): void {
    this.addressService.loadAddresses();
  }

  editAddress(address: Address): void {
    this.editingAddress = address;
    this.addressForm = {
      name: address.name || '',
      phone: address.phone || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'India',
      landmark: address.landmark || '',
      type: address.type || 'home',
      isDefault: address.isDefault || false
    };
    this.showAddAddressForm = true;
  }

  deleteAddress(addressId: string): void {
    this.showConfirmationDialog(
      'Delete Address',
      'Are you sure you want to delete this address? This action cannot be undone.',
      () => {
        this.addressService.deleteAddress(addressId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastService.success('Address deleted successfully');
              this.loadAddresses(); // Reload addresses
            } else {
              this.toastService.error('Failed to delete address');
            }
          },
          error: (error) => {
            this.toastService.error('Error deleting address: ' + error.message);
          }
        });
      }
    );
  }

  setDefaultAddress(addressId: string): void {
    this.addressService.setDefaultAddress(addressId).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success('Default address updated');
          this.loadAddresses(); // Reload addresses
        } else {
          this.toastService.error('Failed to update default address');
        }
      },
      error: (error) => {
        this.toastService.error('Error updating default address: ' + error.message);
      }
    });
  }

  cancelAddressForm(): void {
    this.showAddAddressForm = false;
    this.editingAddress = null;
    this.addressForm = {
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      landmark: '',
      type: 'home',
      isDefault: false
    };
  }

  saveAddress(): void {
    // Validate the form
    const validation = this.addressService.validateAddress(this.addressForm);
    if (!validation.valid) {
      this.toastService.error(validation.errors.join(', '));
      return;
    }

    this.addressFormLoading = true;

    if (this.editingAddress && this.editingAddress._id) {
      // Update existing address
      this.addressService.updateAddress(this.editingAddress._id, this.addressForm).subscribe({
        next: (response) => {
          this.addressFormLoading = false;
          if (response.success) {
            this.toastService.success('Address updated successfully');
            this.cancelAddressForm();
            this.loadAddresses(); // Reload addresses
          } else {
            this.toastService.error('Failed to update address');
          }
        },
        error: (error) => {
          this.addressFormLoading = false;
          this.toastService.error('Error updating address: ' + error.message);
        }
      });
    } else {
      // Create new address
      this.addressService.createAddress(this.addressForm).subscribe({
        next: (response) => {
          this.addressFormLoading = false;
          if (response.success) {
            this.toastService.success('Address added successfully');
            this.cancelAddressForm();
            this.loadAddresses(); // Reload addresses
          } else {
            this.toastService.error('Failed to add address');
          }
        },
        error: (error) => {
          this.addressFormLoading = false;
          this.toastService.error('Error adding address: ' + error.message);
        }
      });
    }
  }

  // Confirmation Dialog Methods
  showConfirmationDialog(title: string, message: string, onConfirm: () => void, onCancel?: () => void): void {
    this.confirmDialogData = {
      title,
      message,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.hideConfirmDialog();
        onConfirm();
      },
      onCancel: () => {
        this.hideConfirmDialog();
        if (onCancel) onCancel();
      }
    };
    this.showConfirmDialog = true;
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  }

  hideConfirmDialog(): void {
    this.showConfirmDialog = false;
    // Restore background scrolling
    document.body.style.overflow = '';
  }

  // Order Management Methods
  loadUserOrders(): void {
    if (!this.currentUser) return;

    this.isLoadingOrders = true;
    const customerId = this.currentUser._id || this.currentUser.id;

    this.orderService.getUserOrders(customerId).subscribe({
      next: (response: any) => {
        this.isLoadingOrders = false;
        if (response.success && response.orders) {
          this.userOrders = response.orders.sort((a: any, b: any) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          );
        }
      },
      error: (error: any) => {
        this.isLoadingOrders = false;
        console.error('Error loading orders:', error);
      }
    });
  }

  getOrderStatusInfo(status: Order['status']) {
    return this.orderService.getOrderStatusInfo(status);
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  calculateOrderTotal(order: Order): number {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getLastOrderDate(): Date | null {
    if (!this.currentUser?.orders || this.currentUser.orders.length === 0) {
      return null;
    }
    const sortedOrders = this.currentUser.orders.sort((a: any, b: any) =>
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    return new Date(sortedOrders[0].orderDate);
  }

  public getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'processing':
        return 'fa-clock';
      case 'confirmed':
        return 'fa-check-circle';
      case 'shipped':
      case 'in transit':
        return 'fa-truck';
      case 'delivered':
        return 'fa-check-double';
      case 'cancelled':
        return 'fa-times-circle';
      default:
        return 'fa-info-circle';
    }
  }

  public getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'processing':
        return 'bg-warning text-dark';
      case 'confirmed':
        return 'bg-info text-white';
      case 'shipped':
      case 'in transit':
        return 'bg-primary text-white';
      case 'delivered':
        return 'bg-success text-white';
      case 'cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  public getProductTypeInitial(productName: string): string {
    if (!productName) return '?';

    const name = productName.toLowerCase();

    if (name.includes('plaque') || name.includes('trophy')) return 'P';
    if (name.includes('mug') || name.includes('cup')) return 'M';
    if (name.includes('frame') || name.includes('photo')) return 'F';
    if (name.includes('keychain') || name.includes('key')) return 'K';
    if (name.includes('bottle') || name.includes('flask')) return 'B';
    if (name.includes('pen') || name.includes('write')) return 'W';
    if (name.includes('clock') || name.includes('time')) return 'C';
    if (name.includes('lamp') || name.includes('light')) return 'L';

    return productName.charAt(0).toUpperCase();
  }
}
