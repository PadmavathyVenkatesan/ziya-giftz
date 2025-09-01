import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { DeliveryAreasComponent } from './components/delivery-areas/delivery-areas.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

// Admin Components
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminCategoryFormComponent } from './components/admin/admin-category-form/admin-category-form.component';
import { OrderManagementComponent } from './components/admin/order-management/order-management.component';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'order-confirmation', component: OrderConfirmationComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'track-order', component: TrackOrderComponent },
  { path: 'delivery-areas', component: DeliveryAreasComponent },
  { path: 'wishlist', component: WishlistComponent },

  // Admin Routes
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/categories', component: AdminCategoriesComponent, canActivate: [adminGuard] },
  { path: 'admin/categories/new', component: AdminCategoryFormComponent, canActivate: [adminGuard] },
  { path: 'admin/categories/edit/:id', component: AdminCategoryFormComponent, canActivate: [adminGuard] },
  { path: 'admin/orders', component: OrderManagementComponent, canActivate: [adminGuard] },
  { path: 'admin', redirectTo: 'admin/login', pathMatch: 'full' },

  // Category routes
  { path: 'category/wooden-plaques', component: ProductListComponent },
  { path: 'category/return-gifts', component: ProductListComponent },
  { path: 'category/name-customized-items', component: ProductListComponent },
  { path: 'category/customized-wallet', component: ProductListComponent },
  { path: 'category/fridge-magnets', component: ProductListComponent },
  { path: 'category/photo-customized-gifts', component: ProductListComponent },
  { path: 'category/combo-gifts', component: ProductListComponent },

  { path: '**', redirectTo: 'home' }
];
