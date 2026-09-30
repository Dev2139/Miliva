import mongoose from 'mongoose';

const bundleConfigSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "100 ml Cleanser + 30 ml Serum"
  cleanserVariantSize: { type: String, required: true }, // "100 ml"
  serumVariantSize: { type: String, required: true }, // "30 ml"
  price: { type: Number, required: true }, // Bundle Price e.g. 999
  compareAtPrice: { type: Number, required: true }, // Combined price e.g. 1098
  sku: { type: String, required: true },
  stock: { type: Number, default: 50 }
}, { _id: true });

const bundleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, default: 'MILIVA Acne Care Combo' },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    images: [{ type: String }],
    configs: [bundleConfigSchema],
    benefits: [{ type: String }],
    suitableFor: { type: String, default: 'Acne-prone, Oily & Combination Skin' },
    stockStrategy: { type: String, enum: ['manual', 'auto'], default: 'auto' }, // auto = min component stock
    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' }
  },
  { timestamps: true }
);

const Bundle = mongoose.model('Bundle', bundleSchema);
export default Bundle;
