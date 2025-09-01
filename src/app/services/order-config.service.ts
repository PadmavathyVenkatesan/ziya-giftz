import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderConfigService {
  // Set minimum order amount for the entire application
  private _minimumOrderAmount: number = 300;
  
  constructor() { }
  
  get minimumOrderAmount(): number {
    return this._minimumOrderAmount;
  }
  
  // Check if the given amount meets the minimum order requirement
  meetsMinimumOrder(amount: number): boolean {
    return amount >= this._minimumOrderAmount;
  }
}
