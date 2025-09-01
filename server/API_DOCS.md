# Ziya Giftz API Documentation

This document provides details on how to use the API endpoints for the Ziya Giftz e-commerce platform.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most API endpoints require authentication using JWT tokens.

**Headers**:
```
Authorization: Bearer <your_jwt_token>
```

## Products API

### Get All Products

Retrieves a list of products with optional filtering.

**URL**: `/products`  
**Method**: GET  
**Auth Required**: No  

**Query Parameters**:
- `category` (string, optional): Filter by category name
- `search` (string, optional): Search term to filter products
- `badge` (string, optional): Filter by badge type (New, Popular, Sale, Limited, Best Seller)
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter
- `sort` (string, optional): Sort order (price-low-high, price-high-low, newest, name-asc)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 12)

**Success Response**:
```json
{
  "success": true,
  "count": 8,
  "totalCount": 20,
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 12
  },
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Birthday Gift Box",
      "price": 1299,
      "originalPrice": 1476,
      "discount": "12%",
      "image": "/api/uploads/products/product1.jpg",
      "description": "A perfect birthday gift for your loved ones.",
      "badge": "New",
      "categories": [
        {
          "_id": "60d21b4667d0d8992e610c70",
          "name": "Birthday Gifts",
          "imageUrl": "/api/uploads/categories/birthday.jpg"
        }
      ],
      "features": [
        {
          "icon": "🎁",
          "text": "Premium Packaging"
        }
      ],
      "isCustomizable": true
    }
  ]
}
```

### Get Product by ID

Retrieve a specific product by its ID.

**URL**: `/products/:id`  
**Method**: GET  
**Auth Required**: No  

**Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Birthday Gift Box",
    "price": 1299,
    "originalPrice": 1476,
    "discount": "12%",
    "image": "/api/uploads/products/product1.jpg",
    "description": "A perfect birthday gift for your loved ones.",
    "badge": "New",
    "categories": [
      {
        "_id": "60d21b4667d0d8992e610c70",
        "name": "Birthday Gifts",
        "imageUrl": "/api/uploads/categories/birthday.jpg"
      }
    ],
    "features": [
      {
        "icon": "🎁",
        "text": "Premium Packaging"
      }
    ],
    "isCustomizable": true
  }
}
```

### Create Product

Create a new product.

**URL**: `/products`  
**Method**: POST  
**Auth Required**: Yes (Admin)  
**Content-Type**: application/json

**Request Body**:
```json
{
  "name": "New Gift Product",
  "price": 1499,
  "originalPrice": 1799,
  "discount": "15%",
  "image": "/api/uploads/products/newproduct.jpg",
  "description": "A beautiful new gift product.",
  "badge": "New",
  "categories": ["Birthday Gifts", "Return Gifts"],
  "features": [
    {
      "icon": "🎁",
      "text": "Premium Packaging"
    }
  ],
  "isCustomizable": true
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "name": "New Gift Product",
    "price": 1499,
    "originalPrice": 1799,
    "discount": "15%",
    "image": "/api/uploads/products/newproduct.jpg",
    "description": "A beautiful new gift product.",
    "badge": "New",
    "categories": [
      {
        "_id": "60d21b4667d0d8992e610c70",
        "name": "Birthday Gifts",
        "imageUrl": "/api/uploads/categories/birthday.jpg"
      },
      {
        "_id": "60d21b4667d0d8992e610c71",
        "name": "Return Gifts",
        "imageUrl": "/api/uploads/categories/return.jpg"
      }
    ],
    "features": [
      {
        "icon": "🎁",
        "text": "Premium Packaging"
      }
    ],
    "isCustomizable": true,
    "createdAt": "2023-08-07T12:00:00.000Z",
    "updatedAt": "2023-08-07T12:00:00.000Z"
  },
  "message": "Product created successfully"
}
```

### Update Product

Update an existing product.

**URL**: `/products/:id`  
**Method**: PUT  
**Auth Required**: Yes (Admin)  
**Content-Type**: application/json

**Request Body**:
```json
{
  "name": "Updated Gift Product",
  "price": 1599,
  "discount": "20%"
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "name": "Updated Gift Product",
    "price": 1599,
    "originalPrice": 1999,
    "discount": "20%",
    "image": "/api/uploads/products/newproduct.jpg",
    "description": "A beautiful new gift product.",
    "badge": "New",
    "categories": [
      {
        "_id": "60d21b4667d0d8992e610c70",
        "name": "Birthday Gifts",
        "imageUrl": "/api/uploads/categories/birthday.jpg"
      },
      {
        "_id": "60d21b4667d0d8992e610c71",
        "name": "Return Gifts",
        "imageUrl": "/api/uploads/categories/return.jpg"
      }
    ],
    "features": [
      {
        "icon": "🎁",
        "text": "Premium Packaging"
      }
    ],
    "isCustomizable": true,
    "updatedAt": "2023-08-07T14:30:00.000Z"
  },
  "message": "Product updated successfully"
}
```

### Delete Product

Delete a product (mark as inactive).

**URL**: `/products/:id`  
**Method**: DELETE  
**Auth Required**: Yes (Admin)  

**Success Response**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Categories API

### Get All Categories

Retrieve all active categories.

**URL**: `/categories`  
**Method**: GET  
**Auth Required**: No  

**Success Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c70",
      "name": "All",
      "imageUrl": "/api/uploads/categories/all.jpg",
      "description": "All products",
      "displayOrder": 0
    },
    {
      "_id": "60d21b4667d0d8992e610c71",
      "name": "Birthday Gifts",
      "imageUrl": "/api/uploads/categories/birthday.jpg",
      "description": "Special gifts for birthday celebrations",
      "displayOrder": 1
    }
  ]
}
```

### Get Category by ID

Retrieve a specific category by its ID.

**URL**: `/categories/:id`  
**Method**: GET  
**Auth Required**: No  

**Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c71",
    "name": "Birthday Gifts",
    "imageUrl": "/api/uploads/categories/birthday.jpg",
    "description": "Special gifts for birthday celebrations",
    "displayOrder": 1
  }
}
```

### Create Category

Create a new category.

**URL**: `/categories`  
**Method**: POST  
**Auth Required**: Yes (Admin)  
**Content-Type**: application/json

**Request Body**:
```json
{
  "name": "New Category",
  "imageUrl": "/api/uploads/categories/newcategory.jpg",
  "description": "A new product category",
  "displayOrder": 5
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c72",
    "name": "New Category",
    "imageUrl": "/api/uploads/categories/newcategory.jpg",
    "description": "A new product category",
    "displayOrder": 5,
    "isActive": true,
    "createdAt": "2023-08-07T12:00:00.000Z",
    "updatedAt": "2023-08-07T12:00:00.000Z"
  },
  "message": "Category created successfully"
}
```

### Update Category

Update an existing category.

**URL**: `/categories/:id`  
**Method**: PUT  
**Auth Required**: Yes (Admin)  
**Content-Type**: application/json

**Request Body**:
```json
{
  "name": "Updated Category",
  "description": "Updated description",
  "displayOrder": 3
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c72",
    "name": "Updated Category",
    "imageUrl": "/api/uploads/categories/newcategory.jpg",
    "description": "Updated description",
    "displayOrder": 3,
    "isActive": true,
    "updatedAt": "2023-08-07T14:30:00.000Z"
  },
  "message": "Category updated successfully"
}
```

### Delete Category

Delete a category (mark as inactive).

**URL**: `/categories/:id`  
**Method**: DELETE  
**Auth Required**: Yes (Admin)  

**Success Response**:
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## File Upload API

### Upload Category Image

Upload an image for a category.

**URL**: `/upload/category`  
**Method**: POST  
**Auth Required**: Yes (Admin)  
**Content-Type**: multipart/form-data

**Form Fields**:
- `image`: The image file to upload (jpg, jpeg, png, gif, webp, svg)

**Success Response**:
```json
{
  "success": true,
  "data": {
    "imageUrl": "/api/uploads/categories/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg",
    "filename": "f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg"
  },
  "message": "Category image uploaded successfully"
}
```

### Upload Product Image

Upload an image for a product.

**URL**: `/upload/product`  
**Method**: POST  
**Auth Required**: Yes (Admin)  
**Content-Type**: multipart/form-data

**Form Fields**:
- `image`: The image file to upload (jpg, jpeg, png, gif, webp, svg)

**Success Response**:
```json
{
  "success": true,
  "data": {
    "imageUrl": "/api/uploads/products/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg",
    "filename": "f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg"
  },
  "message": "Product image uploaded successfully"
}
```

### Upload Product Gallery Images

Upload multiple images for a product gallery.

**URL**: `/upload/product/gallery`  
**Method**: POST  
**Auth Required**: Yes (Admin)  
**Content-Type**: multipart/form-data

**Form Fields**:
- `images`: The image files to upload (up to 10 files)

**Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "imageUrl": "/api/uploads/products/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg",
      "filename": "f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg"
    },
    {
      "imageUrl": "/api/uploads/products/a47ac10b-58cc-4372-a567-0e02b2c3d480.jpg",
      "filename": "a47ac10b-58cc-4372-a567-0e02b2c3d480.jpg"
    }
  ],
  "message": "Gallery images uploaded successfully"
}
```

## Error Responses

**Authentication Error**:
```json
{
  "success": false,
  "message": "Unauthorized access - No token provided"
}
```

**Authorization Error**:
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**Not Found Error**:
```json
{
  "success": false,
  "message": "Product not found"
}
```

**Validation Error**:
```json
{
  "success": false,
  "message": "A category with this name already exists"
}
```

**Server Error**:
```json
{
  "success": false,
  "message": "Server error while creating product",
  "error": "Error details"
}
```
