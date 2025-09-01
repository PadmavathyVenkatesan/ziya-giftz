const Product = require('../models/product.model');
const Category = require('../models/category.model');
const mongoose = require('mongoose');

// Get all products with optional filtering
exports.getAllProducts = async (req, res) => {
  try {
    let query = { isActive: true };
    let sort = { createdAt: -1 }; // Default sort by newest
    
    // Apply category filter if provided
    if (req.query.category && req.query.category !== 'All') {
      const category = await Category.findOne({ name: req.query.category });
      
      if (category) {
        query.categories = category._id;
      } else {
        // If category name is provided but not found, try to match by product name
        query.name = { $regex: req.query.category, $options: 'i' };
      }
    }
    
    // Apply search filter if provided
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    
    // Apply badge filter if provided
    if (req.query.badge) {
      query.badge = req.query.badge;
    }
    
    // Apply price range filter if provided
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice);
      }
      
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice);
      }
    }
    
    // Apply sort if provided
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low-high':
          sort = { price: 1 };
          break;
        case 'price-high-low':
          sort = { price: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'name-asc':
          sort = { name: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }
    
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const products = await Product.find(query)
      .populate('categories', 'name imageUrl')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalCount = await Product.countDocuments(query);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        limit
      },
      data: products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: err.message
    });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categories', 'name imageUrl');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error(`Error fetching product ${req.params.id}:`, err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: err.message
    });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    // Check if categories exist and get their IDs
    let categoryIds = [];
    
    if (req.body.categories && req.body.categories.length > 0) {
      if (Array.isArray(req.body.categories)) {
        // Handle array of category IDs or names
        for (const category of req.body.categories) {
          if (mongoose.Types.ObjectId.isValid(category)) {
            // If it's a valid ObjectId, use it directly
            const categoryExists = await Category.findById(category);
            if (categoryExists) {
              categoryIds.push(category);
            }
          } else {
            // If it's a string (category name), find by name
            const categoryByName = await Category.findOne({ name: category });
            if (categoryByName) {
              categoryIds.push(categoryByName._id);
            }
          }
        }
      }
    }
    
    // Create features array with icons
    let features = [];
    
    if (req.body.isCustomizable || 
        req.body.name.toLowerCase().includes('custom') ||
        req.body.name.toLowerCase().includes('personalized')) {
      features.push({
        icon: '✏️',
        text: 'Customization Available'
      });
    }
    
    // Add default product features
    features = [
      ...features,
      {
        icon: '🎁',
        text: 'Premium Packaging'
      },
      {
        icon: '🚚',
        text: 'Free Shipping'
      },
      {
        icon: '⏱️',
        text: '24-48 hr Delivery'
      }
    ];
    
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      discount: req.body.discount,
      image: req.body.image,
      gallery: req.body.gallery || [],
      description: req.body.description,
      badge: req.body.badge,
      categories: categoryIds,
      features: req.body.features || features,
      inStock: req.body.inStock !== undefined ? req.body.inStock : true,
      stockCount: req.body.stockCount || 100,
      isCustomizable: req.body.isCustomizable || false,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });
    
    const savedProduct = await newProduct.save();
    
    // Populate categories for response
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('categories', 'name imageUrl');
    
    return res.status(201).json({
      success: true,
      data: populatedProduct,
      message: 'Product created successfully'
    });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      error: err.message
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    // Process category IDs or names if provided
    if (req.body.categories) {
      let categoryIds = [];
      
      if (Array.isArray(req.body.categories)) {
        for (const category of req.body.categories) {
          if (mongoose.Types.ObjectId.isValid(category)) {
            // If it's a valid ObjectId, use it directly
            const categoryExists = await Category.findById(category);
            if (categoryExists) {
              categoryIds.push(category);
            }
          } else {
            // If it's a string (category name), find by name
            const categoryByName = await Category.findOne({ name: category });
            if (categoryByName) {
              categoryIds.push(categoryByName._id);
            }
          }
        }
      }
      
      // Replace categories in request body with processed IDs
      req.body.categories = categoryIds;
    }
    
    // Find product and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('categories', 'name imageUrl');
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (err) {
    console.error(`Error updating product ${req.params.id}:`, err);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: err.message
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Instead of deleting, mark as inactive
    product.isActive = false;
    await product.save();
    
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    console.error(`Error deleting product ${req.params.id}:`, err);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: err.message
    });
  }
};
