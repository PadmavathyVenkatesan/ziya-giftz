import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CountryService, CountryCode } from '../../services/country.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { MinimumOrderBannerComponent } from '../shared/minimum-order-banner/minimum-order-banner.component';
import { GiftLoaderComponent } from '../shared/gift-loader/gift-loader.component';
import { OrderConfigService } from '../../services/order-config.service';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { AddressService, Address } from '../../services/address.service';
import { ToastService } from '../../services/toast.service';
import { OrderService, Order } from '../../services/order.service';
import { WhatsappNotificationService, OrderDetails } from '../../services/whatsapp-notification.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterModule, LoadingSpinnerComponent, MinimumOrderBannerComponent, GiftLoaderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  billToDifferentAddress = false;
  paymentMethod: 'razorpay' | 'phonepe' | 'upi' | 'visa' | 'cod' | null = 'razorpay'; // Auto-set to Razorpay
  showUpiInfo = false;
  minimumOrderAmount: number;
  saveForFuture = true;
  isLoading = false;

  uploadedFiles: File[] = [];
  isDragOver = false;

  countries: CountryCode[] = [];
  selectedCountry: CountryCode | undefined;
  showCountryDropdown = false;

  // Address management properties
  savedAddresses: any[] = [];
  selectedAddressId: string | null = null;
  showSavedAddresses = false;
  editingAddressId: string | null = null;
  showAddressForm = false;
  currentAddressType: 'home' | 'work' | 'other' = 'home';

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
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private countryService: CountryService,
    private orderConfigService: OrderConfigService,
    public authService: AuthService,
    private paymentService: PaymentService,
    private addressService: AddressService,
    private toastService: ToastService,
    private orderService: OrderService,
    private whatsappService: WhatsappNotificationService
  ) {
    this.minimumOrderAmount = this.orderConfigService.minimumOrderAmount;
    // Load countries
    this.countries = this.countryService.getAllCountries();
    // Set default country to India
    this.selectedCountry = this.countryService.getCountryByCode('IN');
    this.checkoutForm = this.fb.group({
      // Contact details
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: [''],

      // Delivery address
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      area: [''],
      landmark: [''],
      state: ['', Validators.required],
      country: ['India', Validators.required],

      // Notes
      deliveryInstructions: [''],
      customGift: [''],

      // Billing address (if different)
      billingAddress: this.fb.group({
        name: [''],
        address: [''],
        city: [''],
        state: [''],
        pincode: [''],
        country: ['India']
      })
    });
  }

  ngOnInit(): void {
    // Load Razorpay script
    this.paymentService.loadRazorpayScript().then((loaded) => {
      if (!loaded) {
        console.error('Failed to load Razorpay script');
      }
    });

    // Load saved addresses if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.loadSavedAddresses();
    }

    // Load user data if available and patch to form
    this.loadUserData();
  }

  // Load user data from auth service and patch to form
  loadUserData(): void {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      console.log('Patching user data to checkout form:', currentUser);

      // Get user's phone number (removing country code if present)
      let phone = currentUser.phone || '';
      if (phone.startsWith('+')) {
        // If phone starts with +, remove country code (assuming format like +91xxxxxxxxxx)
        const countryCode = phone.substring(0, 3); // +91
        phone = phone.substring(3); // remove +91 prefix

        // Try to find the country based on dial code
        const country = this.countries.find(c => c.dialCode === countryCode);
        if (country) {
          this.selectedCountry = country;
        }
      }

      // Patch form with user data
      this.checkoutForm.patchValue({
        phone: phone,
        email: currentUser.email || '',
        name: currentUser.name || '',

        // Address fields if available
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        pincode: currentUser.pincode || '',
        country: 'India' // Default to India
      });

      // Also patch billing address with the same data
      this.checkoutForm.get('billingAddress')?.patchValue({
        name: currentUser.name || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        pincode: currentUser.pincode || '',
        country: 'India' // Default to India
      });
    }
  }

  toggleBillingAddress(): void {
    this.billToDifferentAddress = !this.billToDifferentAddress;

    const billingFields = this.checkoutForm.get('billingAddress') as FormGroup;

    if (this.billToDifferentAddress) {
      // Add validators if billing to different address
      Object.keys(billingFields.controls).forEach(key => {
        if (key !== 'area' && key !== 'landmark') {
          billingFields.get(key)?.setValidators(Validators.required);
        }
        billingFields.get(key)?.updateValueAndValidity();
      });
    } else {
      // Remove validators if not billing to different address
      Object.keys(billingFields.controls).forEach(key => {
        billingFields.get(key)?.clearValidators();
        billingFields.get(key)?.updateValueAndValidity();
      });
    }
  }

  selectPaymentMethod(method: 'razorpay' | 'phonepe' | 'upi' | 'visa' | 'cod'): void {
    this.paymentMethod = method;
  }

  showUpiPaymentInfo(): void {
    this.showUpiInfo = true;
    // Disable body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    // Ensure the modal is scrolled to the top when opened
    setTimeout(() => {
      const modalContent = document.querySelector('.upi-modal-content');
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }, 10);
  }

  closeUpiInfo(): void {
    this.showUpiInfo = false;
    this.isLoading = false;
    // Re-enable body scrolling
    document.body.style.overflow = '';
  }

  copyUpiId(): void {
    const upiId = 'padmavathy245@gmail.com'; // Updated UPI ID
    navigator.clipboard.writeText(upiId).then(
      () => {
        // Show a temporary "Copied!" message
        const copyButton = document.querySelector('.copy-button') as HTMLElement;
        if (copyButton) {
          const originalText = copyButton.textContent;
          copyButton.textContent = 'Copied!';
          copyButton.style.backgroundColor = '#4CAF50';

          setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.style.backgroundColor = '#9c59be';
          }, 2000);
        }
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  }

  toggleSaveAddress(): void {
    this.saveForFuture = !this.saveForFuture;
  }

  // Reset the address form to empty values for a new address
  resetAddressForm(): void {
    // Keep contact information but reset address fields
    const currentPhone = this.checkoutForm.get('phone')?.value;
    const currentEmail = this.checkoutForm.get('email')?.value;

    // Reset address fields
    this.checkoutForm.patchValue({
      name: '',
      address: '',
      city: '',
      area: '',
      landmark: '',
      state: '',
      pincode: '',
      country: 'India',

      // Keep contact information
      phone: currentPhone,
      email: currentEmail
    });

    // Focus on the name field
    setTimeout(() => {
      document.querySelector('input[formControlName="name"]')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  toggleCountryDropdown(): void {
    this.showCountryDropdown = !this.showCountryDropdown;
  }

  selectCountry(country: CountryCode): void {
    this.selectedCountry = country;
    this.showCountryDropdown = false;
    // Update the country in the form
    this.checkoutForm.patchValue({
      country: country.name
    });

    // If billing to same address, update billing country as well
    if (!this.billToDifferentAddress) {
      const billingAddress = this.checkoutForm.get('billingAddress');
      if (billingAddress) {
        billingAddress.patchValue({
          country: country.name
        });
      }
    }
  }

  proceedToPayment(): void {
    if (this.checkoutForm.valid) {
      this.isLoading = true;

      // Save address first if requested
      if (this.saveForFuture && this.authService.isAuthenticated()) {
        this.saveAddressToUserProfile();
      }

      // Directly process Razorpay payment
      this.processRazorpayPayment();
    } else {
      // Mark all fields as touched to display validation errors
      this.markFormGroupTouched(this.checkoutForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  completePayment(): void {
    // Create order when payment is completed
    const formData = this.checkoutForm.value;
    const cartItems = this.cartService.getCartItems();
    const currentUser = this.authService.currentUserValue;

    if (!currentUser || cartItems.length === 0) {
      console.error('Missing user data or cart items');
      this.isLoading = false;
      return;
    }

    const orderData: Omit<Order, '_id' | 'orderNumber' | 'orderDate'> = {
      customerId: currentUser._id || currentUser.id || 'guest',
      customerName: formData.name,
      customerEmail: formData.email || currentUser.email,
      customerPhone: formData.phone,
      items: cartItems.map(item => ({
        productId: String(item.id),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || ''
      })),
      totalAmount: this.cartService.getCartTotal(),
      status: 'placed',
      shippingAddress: {
        name: formData.name,
        phone: formData.phone,
        addressLine1: formData.address,
        addressLine2: formData.area,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        landmark: formData.landmark
      },
      paymentMethod: this.paymentMethod || 'razorpay',
      paymentStatus: 'completed',
      estimatedDelivery: this.orderService.estimateDelivery(new Date()),
      notes: formData.deliveryInstructions
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        if (response.success && response.order) {
          console.log('Order created successfully:', response.order);

          // Clear cart
          this.cartService.clearCart();

          // Prepare WhatsApp notification data
          const whatsappOrderDetails: OrderDetails = {
            orderNumber: response.order.orderNumber,
            customerName: formData.name,
            customerPhone: formData.phone,
            items: cartItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            totalAmount: this.cartService.getCartTotal(),
            shippingAddress: {
              name: formData.name,
              addressLine1: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode
            },
            estimatedDelivery: response.order.estimatedDelivery
          };

          // Send WhatsApp notifications
          this.sendWhatsAppNotifications(whatsappOrderDetails);

          this.isLoading = false;

          // Store order number for confirmation page
          localStorage.setItem('lastOrderNumber', response.order.orderNumber);

          // Show success message
          this.toastService.success(
            `Order placed successfully! Order Number: ${response.order.orderNumber}`,
            'Order Confirmed'
          );

          this.router.navigate(['/order-confirmation'], {
            queryParams: { orderNumber: response.order.orderNumber }
          });
        } else {
          this.handlePaymentError('Failed to create order: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.handlePaymentError('Error creating order: ' + error.message);
      }
    });
  }

  /**
   * Send WhatsApp notifications for order confirmation
   */
  private sendWhatsAppNotifications(orderDetails: OrderDetails): void {
    try {
      // Send confirmation to customer
      this.whatsappService.sendOrderConfirmation(orderDetails).subscribe({
        next: (response: any) => {
          console.log('Customer WhatsApp notification sent:', response);
        },
        error: (error: any) => {
          console.error('Error sending customer WhatsApp notification:', error);
        }
      });

      // Send notification to business (you)
      this.whatsappService.sendOrderNotificationToBusiness(orderDetails).subscribe({
        next: (response: any) => {
          console.log('Business WhatsApp notification sent:', response);
        },
        error: (error: any) => {
          console.error('Error sending business WhatsApp notification:', error);
        }
      });

      // Show user that WhatsApp notifications will be sent
      setTimeout(() => {
        this.toastService.info(
          'WhatsApp notifications will be sent to confirm your order',
          'Stay Connected'
        );
      }, 2000);

    } catch (error) {
      console.error('Error setting up WhatsApp notifications:', error);
    }
  }

  // Process Razorpay payment
  processRazorpayPayment(): void {
    const formData = this.checkoutForm.value;
    const totalAmount = this.cartService.getCartTotal();

    const paymentOptions = {
      amount: totalAmount,
      currency: 'INR',
      description: 'Order payment for Padma Giftz',
      customer: {
        name: formData.name,
        email: formData.email || 'customer@padmagiftz.com',
        contact: formData.phone
      },
      notes: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }
    };

    // Create Razorpay order
    this.paymentService.createRazorpayOrder(paymentOptions).subscribe({
      next: (response) => {
        if (response.success) {
          // Initialize Razorpay payment
          this.paymentService.initializeRazorpayPayment(response.order, paymentOptions)
            .then((paymentResponse) => {
              // Verify payment
              this.paymentService.verifyRazorpayPayment(paymentResponse).subscribe({
                next: (verificationResponse) => {
                  if (verificationResponse.success) {
                    this.completePayment();
                  } else {
                    this.handlePaymentError('Payment verification failed');
                  }
                },
                error: (error) => {
                  this.handlePaymentError('Payment verification error: ' + error.message);
                }
              });
            })
            .catch((error) => {
              this.handlePaymentError('Payment failed: ' + error.message);
            });
        } else {
          this.handlePaymentError('Failed to create payment order');
        }
      },
      error: (error) => {
        this.handlePaymentError('Error creating payment order: ' + error.message);
      }
    });
  }

  // Handle payment errors
  handlePaymentError(errorMessage: string): void {
    console.error('Payment error:', errorMessage);
    this.toastService.error('Payment Failed: ' + errorMessage, 'Payment Error');
    this.isLoading = false;
  }

  // Save address details to user profile
  saveAddressToUserProfile(): void {
    // Get the current form values
    const formData = this.checkoutForm.value;

    const address: Address = {
      name: formData.name,
      phone: formData.phone,
      addressLine1: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      country: formData.country,
      addressLine2: formData.area,
      landmark: formData.landmark
    };

    // Try to save to backend first
    this.addressService.saveAddress(address).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('Address saved successfully');
          // Reload addresses to update local state
          this.addressService.loadAddresses();
        } else {
          // Fallback to local storage
          this.addressService.saveAddressLocally(address);
        }
      },
      error: (error: any) => {
        console.error('Error saving address to backend:', error);
        // Fallback to local storage
        this.addressService.saveAddressLocally(address);
      }
    });
  }

  // File upload methods
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Convert FileList to array and add to uploadedFiles
      const newFiles = Array.from(input.files);
      this.uploadedFiles = [...this.uploadedFiles, ...newFiles];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      // Convert FileList to array and add to uploadedFiles
      const newFiles = Array.from(event.dataTransfer.files);
      this.uploadedFiles = [...this.uploadedFiles, ...newFiles];
    }
  }

  removeFile(index: number, event: Event): void {
    event.stopPropagation(); // Prevent triggering file input click
    this.uploadedFiles = this.uploadedFiles.filter((_, i) => i !== index);
  }

  // Address Management Methods
  loadSavedAddresses(): void {
    this.addressService.addresses$.subscribe(addresses => {
      this.savedAddresses = addresses;
      if (addresses.length > 0 && !this.selectedAddressId) {
        // Auto-select default address or first address
        const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
        this.selectSavedAddress(defaultAddress._id!);
      }
    });
    this.addressService.loadAddresses();
  }

  toggleSavedAddresses(): void {
    this.showSavedAddresses = !this.showSavedAddresses;
    if (this.showSavedAddresses && this.savedAddresses.length === 0) {
      this.loadSavedAddresses();
    }
  }

  selectSavedAddress(addressId: string): void {
    const address = this.savedAddresses.find(addr => addr._id === addressId);
    if (address) {
      this.selectedAddressId = addressId;
      this.currentAddressType = address.type || 'home';
      this.patchAddressToForm(address);
      this.showSavedAddresses = false;
      this.showAddressForm = false;
    }
  }

  patchAddressToForm(address: any): void {
    // Extract phone number without country code
    let phone = address.phone || '';
    if (phone.startsWith('+')) {
      const countryCode = phone.substring(0, 3);
      phone = phone.substring(3);
      const country = this.countries.find(c => c.dialCode === countryCode);
      if (country) {
        this.selectedCountry = country;
      }
    }

    this.checkoutForm.patchValue({
      phone: phone,
      name: address.name || '',
      address: address.addressLine1 || '',
      city: address.city || '',
      area: address.addressLine2 || '',
      landmark: address.landmark || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'India'
    });
  }

  editAddress(addressId: string): void {
    const address = this.savedAddresses.find(addr => addr._id === addressId);
    if (address) {
      this.editingAddressId = addressId;
      this.currentAddressType = address.type || 'home';
      this.patchAddressToForm(address);
      this.showAddressForm = true;
      this.showSavedAddresses = false;
    }
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
              this.loadSavedAddresses();
              if (this.selectedAddressId === addressId) {
                this.selectedAddressId = null;
                this.resetAddressForm();
              }
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

  setAddressType(type: 'home' | 'work' | 'other'): void {
    this.currentAddressType = type;
  }

  showNewAddressForm(): void {
    this.editingAddressId = null;
    this.showAddressForm = true;
    this.showSavedAddresses = false;
    this.currentAddressType = 'home';
    this.resetAddressForm();
  }

  hideAddressForm(): void {
    this.showAddressForm = false;
    this.editingAddressId = null;
  }

  saveCurrentAddress(): void {
    if (this.checkoutForm.valid) {
      const formData = this.checkoutForm.value;
      const address: any = {
        name: formData.name,
        phone: formData.phone,
        addressLine1: formData.address,
        addressLine2: formData.area,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        landmark: formData.landmark,
        type: this.currentAddressType
      };

      if (this.editingAddressId) {
        // Update existing address
        this.addressService.updateAddress(this.editingAddressId, address).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastService.success('Address updated successfully');
              this.loadSavedAddresses();
              this.hideAddressForm();
            } else {
              this.toastService.error('Failed to update address');
            }
          },
          error: (error) => {
            this.toastService.error('Error updating address: ' + error.message);
          }
        });
      } else {
        // Create new address
        this.addressService.createAddress(address).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastService.success('Address saved successfully');
              this.loadSavedAddresses();
              this.hideAddressForm();
              this.selectSavedAddress(response.address._id!);
            } else {
              this.toastService.error('Failed to save address');
            }
          },
          error: (error) => {
            this.toastService.error('Error saving address: ' + error.message);
            // Fallback to local storage
            this.addressService.saveAddressLocally(address);
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.checkoutForm);
      this.toastService.warning('Please fill in all required fields');
    }
  }

  formatAddressDisplay(address: any): string {
    const parts = [address.name, address.addressLine1, address.city, address.state, address.pincode];
    return parts.filter(part => part).join(', ');
  }

  getAddressTypeIcon(type: string): string {
    switch (type) {
      case 'home': return 'home';
      case 'work': return 'work';
      default: return 'location_on';
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
}
