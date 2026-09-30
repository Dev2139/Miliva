import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  variantId: { type: String, default: '' },
  variantName: { type: String, default: '' },
  sku: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  isBundle: { type: Boolean, default: false },
  bundleDetails: { type: Object, default: null }
}, { _id: false });

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  adminName: { type: String, default: 'System' },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      house: { type: String, required: true },
      street: { type: String, required: true },
      area: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: 'India' },
      pincode: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true, enum: ['razorpay', 'cod', 'card', 'upi'], default: 'razorpay' },
    paymentInfo: {
      razorpayOrderId: { type: String, default: '' },
      razorpayPaymentId: { type: String, default: '' },
      razorpaySignature: { type: String, default: '' },
      status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' }
    },
    itemsPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String, default: '' },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded'],
      default: 'Confirmed'
    },
    tracking: {
      courier: { type: String, default: 'Bluedart Express' },
      trackingNumber: { type: String, default: '' },
      trackingUrl: { type: String, default: '' },
      estimatedDelivery: { type: String, default: '' },
      timeline: [timelineSchema]
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
