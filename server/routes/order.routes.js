const express = require('express');
const router = express.Router();

// Mock database - in a real app, use MongoDB or similar
let orders = [];

// Generate unique order ID
function generateOrderId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// CREATE ORDER
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;

    // Create new order with generated ID
    const newOrder = {
      _id: generateOrderId(),
      ...orderData,
      orderDate: new Date(),
      trackingDetails: {
        statusHistory: [{
          status: orderData.status || 'placed',
          timestamp: new Date(),
          location: 'Chennai, Tamil Nadu',
          description: 'Order has been placed successfully'
        }]
      }
    };

    // Add to mock database
    orders.push(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// GET ORDER BY ORDER NUMBER (for tracking)
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = orders.find(o => o.orderNumber === orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// GET USER ORDERS
router.get('/user/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    const userOrders = orders.filter(o => o.customerId === customerId);

    res.json({
      success: true,
      orders: userOrders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message
    });
  }
});

// UPDATE ORDER STATUS
router.put('/:orderNumber/status', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { status, trackingUpdate } = req.body;

    const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    orders[orderIndex].status = status;

    // Add tracking update
    if (trackingUpdate) {
      if (!orders[orderIndex].trackingDetails) {
        orders[orderIndex].trackingDetails = { statusHistory: [] };
      }

      orders[orderIndex].trackingDetails.statusHistory.push(trackingUpdate);

      if (trackingUpdate.location) {
        orders[orderIndex].trackingDetails.currentLocation = trackingUpdate.location;
        orders[orderIndex].trackingDetails.lastUpdate = new Date();
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// GET ALL ORDERS (Admin)
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

module.exports = router;
