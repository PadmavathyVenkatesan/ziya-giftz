const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Create storage directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
const categoriesDir = path.join(uploadsDir, 'categories');
const productsDir = path.join(uploadsDir, 'products');

// Ensure directories exist
[uploadsDir, categoriesDir, productsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for category images
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoriesDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Configure storage for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filters
const imageFilter = (req, file, cb) => {
  // Accept only images
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create upload objects
const uploadCategoryImage = multer({ 
  storage: categoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadProductImage = multer({ 
  storage: productStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload routes
router.post(
  '/category', 
  verifyToken, 
  verifyAdmin, 
  uploadCategoryImage.single('image'), 
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }
    
    const imagePath = `/api/uploads/categories/${req.file.filename}`;
    
    res.status(201).json({
      success: true,
      data: {
        imageUrl: imagePath,
        filename: req.file.filename
      },
      message: 'Category image uploaded successfully'
    });
  }
);

router.post(
  '/product', 
  verifyToken, 
  verifyAdmin, 
  uploadProductImage.single('image'), 
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }
    
    const imagePath = `/api/uploads/products/${req.file.filename}`;
    
    res.status(201).json({
      success: true,
      data: {
        imageUrl: imagePath,
        filename: req.file.filename
      },
      message: 'Product image uploaded successfully'
    });
  }
);

// Upload multiple product images for gallery
router.post(
  '/product/gallery', 
  verifyToken, 
  verifyAdmin, 
  uploadProductImage.array('images', 10), // Allow up to 10 images
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }
    
    const imageUrls = req.files.map(file => ({
      imageUrl: `/api/uploads/products/${file.filename}`,
      filename: file.filename
    }));
    
    res.status(201).json({
      success: true,
      data: imageUrls,
      message: 'Gallery images uploaded successfully'
    });
  }
);

// Delete image routes
router.delete(
  '/category/:filename', 
  verifyToken, 
  verifyAdmin, 
  (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(categoriesDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({
        success: true,
        message: 'Category image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
  }
);

router.delete(
  '/product/:filename', 
  verifyToken, 
  verifyAdmin, 
  (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(productsDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({
        success: true,
        message: 'Product image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
  }
);

module.exports = router;
