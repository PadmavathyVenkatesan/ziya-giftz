const mongoose = require('mongoose');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

// Initial categories data
const categories = [
  {
    name: 'All',
    imageUrl: 'assets/images/categories/all.png',
    description: 'All products',
    displayOrder: 0
  },
  {
    name: 'Wooden Plaques',
    imageUrl: 'assets/images/categories/wooden-plaques.png',
    description: 'Beautiful customized wooden plaques for all occasions',
    displayOrder: 1
  },
  {
    name: 'Return Gifts',
    imageUrl: 'assets/images/categories/return-gifts.png',
    description: 'Perfect return gifts for weddings and parties',
    displayOrder: 2
  },
  {
    name: 'Name Customized Items',
    imageUrl: 'assets/images/categories/name-customized.png',
    description: 'Personalized items with custom names and messages',
    displayOrder: 3
  },
  {
    name: 'Customized Wallet',
    imageUrl: 'assets/images/categories/customized-wallet.png',
    description: 'Premium quality wallets with custom engravings',
    displayOrder: 4
  },
  {
    name: 'Fridge Magnets',
    imageUrl: 'assets/images/categories/fridge-magnets.png',
    description: 'Custom fridge magnets for your kitchen',
    displayOrder: 5
  },
  {
    name: 'Photo Customized Gifts',
    imageUrl: 'assets/images/categories/photo-customized.png',
    description: 'Gifts personalized with your favorite photos',
    displayOrder: 6
  },
  {
    name: 'Combo Gifts',
    imageUrl: 'assets/images/categories/combo-gifts.png',
    description: 'Gift sets and combos for special occasions',
    displayOrder: 7
  },
  {
    name: 'Birthday Gifts',
    imageUrl: 'assets/images/categories/birthday-gifts.png',
    description: 'Special gifts for birthday celebrations',
    displayOrder: 8
  },
  {
    name: 'Anniversary Gifts',
    imageUrl: 'assets/images/categories/anniversary-gifts.png',
    description: 'Thoughtful gifts for celebrating anniversaries',
    displayOrder: 9
  },
  {
    name: 'Wedding Gifts',
    imageUrl: 'assets/images/categories/wedding-gifts.png',
    description: 'Elegant gifts for weddings and newlyweds',
    displayOrder: 10
  }
];

// Initial products data
const products = [
  {
    name: 'Birthday Gift Box',
    price: 1299,
    originalPrice: 1476,
    discount: '12%',
    image: 'assets/images/birthday-gift.png',
    description: 'A perfect birthday gift for your loved ones with customized items and premium packaging.',
    badge: 'New',
    inStock: true,
    stockCount: 50,
    isCustomizable: true,
    features: [
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
      },
      {
        icon: '✏️',
        text: 'Customization Available'
      }
    ]
  },
  {
    name: 'Anniversary Special',
    price: 1599,
    originalPrice: 1899,
    discount: '15%',
    image: 'assets/images/anniversary-gift.png',
    description: 'Celebrate your special day with our premium anniversary gift package, perfect for couples.',
    badge: null,
    inStock: true,
    stockCount: 30,
    isCustomizable: true,
    features: [
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
      },
      {
        icon: '✏️',
        text: 'Customization Available'
      }
    ]
  },
  {
    name: 'Wedding Gift Package',
    price: 2999,
    originalPrice: 3999,
    discount: '25%',
    image: 'assets/images/wedding-gift.png',
    description: 'Elegant wedding gift package with customized items for the newly wedded couple.',
    badge: 'Popular',
    inStock: true,
    stockCount: 25,
    isCustomizable: true,
    features: [
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
      },
      {
        icon: '✏️',
        text: 'Customization Available'
      }
    ]
  },
  {
    name: 'Farewell Token',
    price: 999,
    originalPrice: 1099,
    discount: '10%',
    image: 'assets/images/farewell-gift.png',
    description: 'A meaningful farewell gift to show your appreciation and good wishes.',
    badge: null,
    inStock: true,
    stockCount: 40,
    isCustomizable: true,
    features: [
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
      },
      {
        icon: '✏️',
        text: 'Customization Available'
      }
    ]
  },
  {
    name: 'Congratulations Box',
    price: 1499,
    originalPrice: 1799,
    discount: '15%',
    image: 'assets/images/congrats-gift.png',
    description: 'Celebrate achievements with our special congratulations gift box with premium items.',
    badge: null,
    inStock: true,
    stockCount: 35,
    isCustomizable: true,
    features: [
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
      },
      {
        icon: '✏️',
        text: 'Customization Available'
      }
    ]
  },
  {
    name: 'New Year Surprise Box',
    price: 1799,
    originalPrice: 2599,
    discount: '30%',
    image: 'assets/images/newyear-gift.png',
    description: 'Start the year with joy using our specially curated New Year gift collection.',
    badge: 'Limited',
    inStock: true,
    stockCount: 20,
    isCustomizable: true,
    features: [
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
      },
      {
        icon: '✏️',
        text: 'Customization Available'
      }
    ]
  },
  {
    name: 'Valentine Special',
    price: 1999,
    originalPrice: 2499,
    discount: '20%',
    image: 'assets/images/valentine-gift.png',
    description: 'Express your love with our premium Valentine\'s Day gift package with customization options.',
    badge: 'Best Seller',
    inStock: true,
    stockCount: 15,
    isCustomizable: true,
    features: [
      {
        icon: '❤️',
        text: 'Love Themed'
      },
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
      },
      {
        icon: '✏️',
        text: 'Customization Available'
      }
    ]
  },
  {
    name: 'Christmas Gift Set',
    price: 2499,
    originalPrice: 3299,
    discount: '25%',
    image: 'assets/images/christmas-gift.png',
    description: 'Celebrate Christmas with our festive gift set, perfect for friends and family.',
    badge: 'Sale',
    inStock: true,
    stockCount: 25,
    isCustomizable: true,
    features: [
      {
        icon: '🎄',
        text: 'Festive Themed'
      },
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
      },
      {
        icon: '✏️',
        text: 'Customization Available'
      }
    ]
  }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`Inserted ${insertedCategories.length} categories`);

    // Create a map of category names to IDs
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Add category IDs to products
    const productsWithCategories = products.map(product => {
      // Assign categories based on product name
      const productCategories = [];
      
      if (product.name.toLowerCase().includes('birthday')) {
        productCategories.push(categoryMap['Birthday Gifts']);
      }
      
      if (product.name.toLowerCase().includes('anniversary')) {
        productCategories.push(categoryMap['Anniversary Gifts']);
      }
      
      if (product.name.toLowerCase().includes('wedding')) {
        productCategories.push(categoryMap['Wedding Gifts']);
      }
      
      if (product.name.toLowerCase().includes('customized') || product.isCustomizable) {
        productCategories.push(categoryMap['Name Customized Items']);
      }
      
      // Always add to 'All' category
      productCategories.push(categoryMap['All']);
      
      return {
        ...product,
        categories: productCategories
      };
    });

    // Insert products
    const insertedProducts = await Product.insertMany(productsWithCategories);
    console.log(`Inserted ${insertedProducts.length} products`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
