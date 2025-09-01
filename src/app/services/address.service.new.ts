import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Address {
  _id?: string;
  userId?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
  isDefault?: boolean;
  type?: 'home' | 'work' | 'other';
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = environment.apiUrl;
  private addressesSubject = new BehaviorSubject<Address[]>([]);
  public addresses$ = this.addressesSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all addresses for the current user
   */
  getAddresses(): Observable<{ success: boolean; addresses: Address[] }> {
    return this.http.get<{ success: boolean; addresses: Address[] }>(`${this.apiUrl}/addresses`);
  }

  /**
   * Get a specific address by ID
   */
  getAddress(id: string): Observable<{ success: boolean; address: Address }> {
    return this.http.get<{ success: boolean; address: Address }>(`${this.apiUrl}/addresses/${id}`);
  }

  /**
   * Create a new address
   */
  createAddress(address: Address): Observable<{ success: boolean; address: Address; message: string }> {
    return this.http.post<{ success: boolean; address: Address; message: string }>(`${this.apiUrl}/addresses`, address);
  }

  /**
   * Update an address
   */
  updateAddress(id: string, address: Address): Observable<{ success: boolean; address: Address; message: string }> {
    return this.http.put<{ success: boolean; address: Address; message: string }>(`${this.apiUrl}/addresses/${id}`, address);
  }

  /**
   * Delete an address
   */
  deleteAddress(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/addresses/${id}`);
  }

  /**
   * Set default address
   */
  setDefaultAddress(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(`${this.apiUrl}/addresses/${id}/default`, {});
  }

  /**
   * Validate address format
   */
  validateAddress(address: Address): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.name?.trim()) {
      errors.push('Name is required');
    }

    if (!address.phone?.trim()) {
      errors.push('Phone number is required');
    } else if (!/^[6-9]\d{9}$/.test(address.phone.replace(/\D/g, ''))) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    if (!address.addressLine1?.trim()) {
      errors.push('Address line 1 is required');
    }

    if (!address.city?.trim()) {
      errors.push('City is required');
    }

    if (!address.state?.trim()) {
      errors.push('State is required');
    }

    if (!address.pincode?.trim()) {
      errors.push('Pincode is required');
    } else if (!/^\d{6}$/.test(address.pincode)) {
      errors.push('Please enter a valid 6-digit pincode');
    }

    if (!address.country?.trim()) {
      errors.push('Country is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Format address for display
   */
  formatAddress(address: Address): string {
    const parts = [
      address.name,
      address.addressLine1,
      address.addressLine2,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
      address.country
    ].filter(part => part && part.trim());

    return parts.join(', ');
  }

  /**
   * Load addresses and update the subject
   */
  loadAddresses(): void {
    this.getAddresses().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.addressesSubject.next(response.addresses);
        }
      },
      error: (error: any) => {
        console.error('Error loading addresses:', error);
        this.addressesSubject.next([]);
      }
    });
  }

  /**
   * Get current addresses from the subject
   */
  getCurrentAddresses(): Address[] {
    return this.addressesSubject.value;
  }

  /**
   * Save address (alias for createAddress for backward compatibility)
   */
  saveAddress(address: Address): Observable<{ success: boolean; address: Address; message: string }> {
    return this.createAddress(address);
  }

  /**
   * Save address to local storage as fallback
   */
  saveAddressLocally(address: Address): void {
    try {
      const existingAddresses = this.getAddressesFromLocalStorage();
      address._id = Date.now().toString(); // Generate temporary ID
      existingAddresses.push(address);
      localStorage.setItem('user_addresses', JSON.stringify(existingAddresses));
      this.addressesSubject.next(existingAddresses);
    } catch (error) {
      console.error('Error saving address to local storage:', error);
    }
  }

  /**
   * Get addresses from local storage
   */
  private getAddressesFromLocalStorage(): Address[] {
    try {
      const stored = localStorage.getItem('user_addresses');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading addresses from local storage:', error);
      return [];
    }
  }
}
