# Ziya Giftz - E-Commerce Mobile App

A mobile-first e-commerce Angular application for gift shopping, featuring a modern UI with complete shopping experience.

## Features

- **Mobile-First Design**: Optimized for mobile devices with a responsive design
- **Product Browsing**: Browse products by categories with filtering options
- **Shopping Cart**: Add, remove, and update quantities of products in your cart
- **User Authentication**: Login via mobile number with OTP verification
- **Order Tracking**: Track your orders with detailed status updates
- **Responsive UI**: Consistent experience across different screen sizes

## Technologies Used

- Angular 19
- Angular Material
- Angular Flex Layout
- FontAwesome
- SCSS

## Application Structure

The application follows a component-based architecture:

- **Navbar**: Bottom navigation bar with main app sections
- **Footer**: Expandable sections for policies, contact details, and support
- **Product List**: Grid display of available products with filtering
- **Cart**: Shopping cart management with item quantity controls
- **Login**: Mobile number authentication with OTP verification
- **Track Order**: Order tracking with status timeline

## Services

- **Cart Service**: Manages shopping cart state and operations
- **Product Service**: Handles product data and filtering functionality

## Installation

1. Clone the repository
2. Install dependencies:
```
npm install --legacy-peer-deps
```
3. Run the development server:
```
ng serve
```
4. Open your browser to `http://localhost:4200/`

## Development Notes

- Uses standalone components for better tree-shaking
- Implements reactive forms for user input
- Utilizes Angular Material for UI components
- Custom styling with SCSS
- Mock data services simulate backend functionality

## Development server

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.6.

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Future Enhancements

- Backend integration
- Payment gateway integration
- User profiles
- Wishlist functionality
- Product reviews and ratings
- Push notifications
