import { createRazorpayOrder, verifyRazorpaySignature } from '../services/paymentService.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Notification from '../models/Notification.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Always calculate amount server-side!
    const razorpayOrder = await createRazorpayOrder(
      order.totalAmount,
      'INR',
      `receipt_${order.orderNumber}`
    );

    order.paymentInfo.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_milivaskincarekey'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isValid = verifyRazorpaySignature(
      razorpayOrderId || order.paymentInfo.razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      order.paymentInfo.status = 'failed';
      await order.save();
      return res.status(400).json({ success: false, message: 'Payment verification failed: Invalid signature' });
    }

    // Update order status to paid and confirmed
    order.isPaid = true;
    order.paidAt = new Date();
    order.orderStatus = 'Confirmed';
    order.paymentInfo = {
      razorpayOrderId: razorpayOrderId || order.paymentInfo.razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'paid'
    };

    order.tracking.timeline.push(
      {
        status: 'Payment Confirmed',
        title: 'Payment Successful',
        description: `Payment confirmed via Razorpay (Ref: ${razorpayPaymentId})`,
        timestamp: new Date()
      },
      {
        status: 'Confirmed',
        title: 'Order Confirmed',
        description: 'Order confirmed and sent to warehouse.',
        timestamp: new Date()
      }
    );

    await order.save();

    // Deduct stock for all items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: order.user }, { items: [], couponCode: '', discountAmount: 0 });

    // Send Notification
    await Notification.create({
      user: order.user,
      title: 'Payment Confirmed',
      message: `Payment of ₹${order.totalAmount} for Order #${order.orderNumber} confirmed.`,
      type: 'order',
      link: `/orders/${order._id}/track`
    });

    // Send Confirmation Email
    sendOrderConfirmationEmail(order, req.user.email);

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};
