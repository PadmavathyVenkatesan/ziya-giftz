import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MinimumOrderBannerComponent } from '../shared/minimum-order-banner/minimum-order-banner.component';
import { OrderConfigService } from '../../services/order-config.service';

@Component({
  selector: 'app-delivery-areas',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, MinimumOrderBannerComponent],
  templateUrl: './delivery-areas.component.html',
  styleUrl: './delivery-areas.component.scss'
})
export class DeliveryAreasComponent implements OnInit {
  searchQuery: string = '';
  filteredAreas: { city: string, pinCodes: string[] }[] = [];
  minimumOrderAmount: number;

  constructor(
    private titleService: Title,
    private orderConfigService: OrderConfigService
  ) {
    this.minimumOrderAmount = this.orderConfigService.minimumOrderAmount;
  }

  ngOnInit(): void {
    this.filteredAreas = [...this.deliveryAreas];
    this.titleService.setTitle('Delivery Areas | Ziya Giftz');
  }
  // Delivery states with free delivery thresholds
  deliveryStates = [
    {
      state: 'TAMIL NADU',
      name: 'Tamil Nadu',
      charges: 'No Charges',
      minOrderValue: 500
    },
    {
      state: 'PUDUCHERRY',
      name: 'Puducherry',
      charges: 'No Charges',
      minOrderValue: 500
    },
    {
      state: 'KERALA',
      name: 'Kerala',
      charges: 'No Charges',
      minOrderValue: 500
    },
    {
      state: 'KARNATAKA',
      name: 'Karnataka',
      charges: 'No Charges',
      minOrderValue: 500
    },
    {
      state: 'ANDHRA PRADESH',
      name: 'Andhra Pradesh',
      charges: 'No Charges',
      minOrderValue: 500
    },
    {
      state: 'GOA',
      name: 'Goa',
      charges: 'No Charges',
      minOrderValue: 500
    },
    {
      state: 'TELANGANA',
      name: 'Telangana',
      charges: 'No Charges',
      minOrderValue: 500
    }
  ];

  // Pickup locations
  pickupLocations = [
    {
      type: 'DIRECT PICKUP',
      pointType: 'PICKUP POINT',
      address: '148, 3rd Floor, Murugankurichi Nagar 1st Street, Madurai 9',
      address2: '',
      city: 'Chennai',
      postalCode: '600028',
      state: 'Tamil Nadu',
      country: 'India',
      phone: '98765-43456',
      email: 'shop@ziyagiftz.com',
      hours: {
        monday: { open: '09:00 AM', close: '08:00 PM' },
        tuesday: { open: '09:00 AM', close: '08:00 PM' },
        wednesday: { open: '09:00 AM', close: '08:00 PM' },
        thursday: { open: '09:00 AM', close: '08:00 PM' },
        friday: { open: '09:00 AM', close: '08:00 PM' },
        saturday: { open: '09:00 AM', close: '08:00 PM' },
        sunday: { open: '09:00 AM', close: '08:00 PM' }
      }
    },
    {
      type: 'RAMANUJAN IT PARK',
      pointType: 'PICKUP POINT',
      address: 'Ramanujan IT Park, Taramani',
      address2: '',
      city: 'Chennai',
      postalCode: '600113',
      state: 'Tamil Nadu',
      country: 'India',
      phone: '98765-43456',
      email: 'info@ziyagiftz.com',
      hours: {
        monday: { open: '09:00 AM', close: '08:00 PM' },
        tuesday: { open: '09:00 AM', close: '08:00 PM' },
        wednesday: { open: '09:00 AM', close: '08:00 PM' },
        thursday: { open: '09:00 AM', close: '08:00 PM' },
        friday: { open: '09:00 AM', close: '08:00 PM' }
      }
    }
  ];

  // Keep the original delivery areas for backwards compatibility
  deliveryAreas: { city: string, pinCodes: string[] }[] = [];

  // Track expanded cities
  expandedCities: { [key: string]: boolean } = {};

  toggleCity(city: string): void {
    this.expandedCities[city] = !this.expandedCities[city];
  }

  isExpanded(city: string): boolean {
    return this.expandedCities[city] === true;
  }

  searchAreas(): void {
    if (!this.searchQuery.trim()) {
      this.filteredAreas = [...this.deliveryAreas];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();

    this.filteredAreas = this.deliveryAreas.filter(area => {
      // Check if city name matches
      if (area.city.toLowerCase().includes(query)) {
        // If searching by city, expand it automatically
        this.expandedCities[area.city] = true;
        return true;
      }

      // Check if any PIN code matches
      const hasPinMatch = area.pinCodes.some(pin => pin.includes(query));
      if (hasPinMatch) {
        // If searching by PIN, expand the city automatically
        this.expandedCities[area.city] = true;
      }
      return hasPinMatch;
    });
  }
}
