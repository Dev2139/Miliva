import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: String, default: '' },
  variantName: { type: String, default: '' }, // e.g. "100 ml" or "100 ml Cleanser + 30 ml Serum"
  price: { type: Number, required: true },
  compareAtPrice: { type: Number, default: 0 },
  sku: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  isBundle: { type: Boolean, default: false },
  bundleConfig: { type: Object, default: null }
}, { timestamps: true });

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    couponCode: { type: String, default: '' },
    discountAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
