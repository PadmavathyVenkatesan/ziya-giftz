const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  gallery: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    enum: [null, 'New', 'Popular', 'Sale', 'Limited', 'Best Seller']
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  features: [{
    icon: String,
    text: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  stockCount: {
    type: Number,
    default: 100
  },
  isCustomizable: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update updatedAt timestamp
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate discount if not provided
  if (!this.discount && this.originalPrice && this.price) {
    const discountPercent = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    this.discount = `${discountPercent}%`;
  }
  
  // Calculate original price if not provided but discount is
  if (!this.originalPrice && this.discount && this.price) {
    const discountPercent = parseInt(this.discount.replace('%', ''));
    this.originalPrice = Math.round(this.price / (1 - (discountPercent / 100)));
  }
  
  next();
});

// Automatically determine if product is customizable based on name
productSchema.pre('save', function(next) {
  const customKeywords = ['custom', 'personalized', 'engraved', 'customized', 'name'];
  const lowerName = this.name.toLowerCase();
  
  if (!this.isCustomizable) {
    for (const keyword of customKeywords) {
      if (lowerName.includes(keyword)) {
        this.isCustomizable = true;
        break;
      }
    }
  }
  
  next();
});

module.exports = mongoose.model('Product', productSchema);
