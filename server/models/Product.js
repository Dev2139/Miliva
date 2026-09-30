import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g. "100 ml", "200 ml"
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 50 },
  sku: { type: String, required: true },
  lowStockThreshold: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true }
}, { _id: true });

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    productType: { type: String, required: true }, // Cleanser, Serum, Combo
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String, required: true }],
    videoUrl: { type: String, default: '' },
    size: { type: String, default: 'Default' },
    variants: [variantSchema],
    ingredients: [{ type: String }],
    keyIngredients: [{ name: String, percentage: String, benefit: String }],
    benefits: [{ type: String }],
    howToUse: { type: String, default: '' },
    suitableFor: { type: String, default: 'Acne-prone skin, Oily skin, Combination skin' },
    skinTypes: [{ type: String }],
    skinConcerns: [{ type: String }],
    texture: { type: String, default: '' },
    fragrance: { type: String, default: '100% Fragrance-Free' },
    safetyInfo: { type: String, default: 'Dermatologically Tested.' },
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 24 },
    isBundle: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: true },
    isNew: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' }
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Discount calculation pre-save
productSchema.pre('save', function (next) {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    this.discount = Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  } else {
    this.discount = 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
