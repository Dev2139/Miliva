import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Notification from '../models/Notification.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

// Helper to generate clean order number
const generateOrderNumber = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MLV-${rand}`;
};

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Valid shipping address is required' });
    }

    // SERVER-SIDE VERIFICATION & CALCULATION
    let itemsPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(404).json({ success: false, message: `Product ${item.name || ''} not found or inactive` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }

      const verifiedPrice = product.price;
      itemsPrice += verifiedPrice * item.quantity;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price: verifiedPrice,
        quantity: item.quantity,
        size: item.size || product.size,
        image: product.images[0],
        sku: product.sku
      });
    }

    // Taxes & shipping calculation
    const shippingPrice = itemsPrice >= 999 ? 0 : 70; // Free shipping above ₹999
    let discountAmount = 0;
    if (req.body.discountAmount) {
      discountAmount = Number(req.body.discountAmount);
    }

    const totalAmount = Math.max(0, itemsPrice - discountAmount + shippingPrice);

    const initialTimeline = [
      {
        status: 'Order Placed',
        title: 'Order Placed',
        description: 'We have received your order.',
        timestamp: new Date()
      }
    ];

    if (paymentMethod === 'cod') {
      initialTimeline.push({
        status: 'Confirmed',
        title: 'Order Confirmed',
        description: 'Cash on delivery order confirmed.',
        timestamp: new Date()
      });
    }

    const orderNumber = generateOrderNumber();

    const order = new Order({
      orderNumber,
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      discountAmount,
      shippingPrice,
      totalAmount,
      couponCode: couponCode || '',
      orderStatus: paymentMethod === 'cod' ? 'Confirmed' : 'Pending',
      paymentInfo: {
        status: paymentMethod === 'cod' ? 'pending' : 'pending'
      },
      tracking: {
        courier: 'Bluedart Express',
        trackingNumber: `BD${Math.floor(10000000 + Math.random() * 90000000)}`,
        estimatedDelivery: '3-5 Business Days',
        timeline: initialTimeline
      }
    });

    const createdOrder = await order.save();

    // Deduct stock if COD or confirmed immediately
    if (paymentMethod === 'cod') {
      for (const item of validatedItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      // Clear user cart
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: '', discountAmount: 0 });

      // Create Notification
      await Notification.create({
        user: req.user._id,
        title: 'Order Placed Successfully',
        message: `Your order #${orderNumber} of ₹${totalAmount} has been placed.`,
        type: 'order',
        link: `/account?tab=orders`
      });

      // Send Email Notification asynchronously
      sendOrderConfirmationEmail(createdOrder, req.user.email);
    }

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders (Customers get their own orders, Admins get ALL customer orders)
// @route   GET /api/orders
export const getUserOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check ownership or admin
    if (order.user && order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Track order
// @route   GET /api/orders/:id/track
export const trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      tracking: order.tracking,
      shippingAddress: order.shippingAddress,
      items: order.items,
      createdAt: order.createdAt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const status = req.body.status || req.body.orderStatus;
    const trackingNumber = req.body.trackingNumber || req.body.trackingInfo?.trackingNumber;
    const courier = req.body.courier || req.body.carrier || req.body.trackingInfo?.carrier;
    const note = req.body.note || req.body.comment;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = status;

    if (!order.tracking) {
      order.tracking = { timeline: [] };
    }

    if (trackingNumber) order.tracking.trackingNumber = trackingNumber;
    if (courier) order.tracking.courier = courier;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      if (order.paymentMethod === 'cod') {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentInfo = order.paymentInfo || {};
        order.paymentInfo.status = 'paid';
      }
    }

    // Add status to tracking timeline
    if (Array.isArray(order.tracking.timeline)) {
      order.tracking.timeline.push({
        status,
        title: `Order ${status}`,
        description: note || `Order status updated to ${status}`,
        timestamp: new Date()
      });
    }

    // If order cancelled/returned, restore inventory!
    if ((status === 'Cancelled' || status === 'Returned') && oldStatus !== 'Cancelled' && oldStatus !== 'Returned') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    await order.save();

    // Create Notification
    if (order.user) {
      await Notification.create({
        user: order.user,
        title: `Order Status Updated: ${status}`,
        message: `Your order #${order.orderNumber} is now ${status}.`,
        type: 'order',
        link: `/orders/${order._id}/track`
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer)
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: `Cannot cancel order in state: ${order.orderStatus}` });
    }

    order.orderStatus = 'Cancelled';
    order.tracking.timeline.push({
      status: 'Cancelled',
      title: 'Order Cancelled',
      description: 'Order cancelled by customer',
      timestamp: new Date()
    });

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    next(error);
  }
};
