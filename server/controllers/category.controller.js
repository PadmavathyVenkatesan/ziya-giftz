const Category = require('../models/category.model');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 });
    
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: err.message
    });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    console.error(`Error fetching category ${req.params.id}:`, err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching category',
      error: err.message
    });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const newCategory = new Category({
      name: req.body.name,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      displayOrder: req.body.displayOrder || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });
    
    const savedCategory = await newCategory.save();
    
    return res.status(201).json({
      success: true,
      data: savedCategory,
      message: 'Category created successfully'
    });
  } catch (err) {
    // Check for duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists'
      });
    }
    
    console.error('Error creating category:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating category',
      error: err.message
    });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    // Find category and update it
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (err) {
    // Check for duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists'
      });
    }
    
    console.error(`Error updating category ${req.params.id}:`, err);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating category',
      error: err.message
    });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Instead of deleting, mark as inactive
    category.isActive = false;
    await category.save();
    
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error(`Error deleting category ${req.params.id}:`, err);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting category',
      error: err.message
    });
  }
};
