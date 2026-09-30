import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const addProduct = async () => {
  try {
    await connectDB();
    console.log('Connecting to MongoDB Atlas to insert Salicylic Acid + LHA 2% Cleanser...');

    // Find or create Face Cleanser category
    let category = await Category.findOne({ slug: 'face-cleanser' });
    if (!category) {
      category = await Category.create({
        name: 'Face Cleanser',
        slug: 'face-cleanser',
        description: 'Gentle daily cleansing formulations designed to purify acne-prone skin.'
      });
    }

    const productData = {
      name: 'Salicylic Acid + LHA 2% Cleanser',
      slug: 'salicylic-acid-lha-2-cleanser',
      productType: 'Cleanser',
      shortDescription: 'Reduces Sebum & Prevents Breakout Without Drying Skin',
      description: 'A daily, gentle exfoliating, acne fighting face cleanser. It combines BHA + LHA (Salicylic Acid + Capryloyl Salicylic Acid) in 2% concentration, which provides deep cleansing, pore decongestion & sebum reduction without drying out the skin.\n\n"I have seen a reduction in acne and oiliness ever since I started using this face cleanser" -Nikhil V.',
      category: category._id,
      price: 299,
      compareAtPrice: 349,
      sku: '8906128100320',
      stock: 100,
      size: '100ml',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
      ],
      variants: [
        {
          size: '100ml',
          price: 299,
          compareAtPrice: 349,
          stock: 100,
          sku: '8906128100320',
          isActive: true
        },
        {
          size: '250ml',
          price: 599,
          compareAtPrice: 699,
          stock: 80,
          sku: '8906128101136',
          isActive: true
        }
      ],
      keyIngredients: [
        { name: 'Salicylic Acid + LHA', percentage: '2%', benefit: 'Deep pore decongestion & sebum reduction' },
        { name: 'Oat Extract', percentage: '1%', benefit: 'Soothes skin & calms redness/irritation' },
        { name: 'Zinc PCA', percentage: '1%', benefit: 'Controls excess oil & balances sebum' },
        { name: 'Allantoin', percentage: '0.5%', benefit: 'Soothes and protects skin barrier' }
      ],
      ingredients: [
        'Salicylic Acid (BHA)',
        'Capryloyl Salicylic Acid (LHA)',
        'Oat Extract',
        'Zinc PCA',
        'Allantoin',
        'Aqua',
        'Glycerin',
        'Sodium Lauroyl Sarcosinate',
        'Cocamidopropyl Betaine',
        'Disodium EDTA',
        'Phenoxyethanol'
      ],
      benefits: [
        'Reduces Sebum & Prevents Breakout Without Drying Skin',
        'Combines BHA + LHA in 2% concentration for deep pore cleansing',
        'Soothes skin with Oat Extract and Allantoin',
        '100% Fragrance Free, Non-comedogenic & Essential Oil Free (pH 4.5 - 5.5)'
      ],
      howToUse: 'Apply on wet face. Gently massage in circular motions for 60 seconds. Rinse thoroughly with water. Use morning and evening daily.',
      suitableFor: 'Oily skin, Acne-prone skin, Combination skin',
      skinTypes: ['Acne-prone', 'Oily', 'Combination'],
      skinConcerns: ['Acne', 'Excess Sebum', 'Enlarged Pores', 'Uneven Texture'],
      texture: 'Gentle Gel Cleanser',
      fragrance: '100% Fragrance-Free (pH: 4.5 - 5.5)',
      safetyInfo: 'Dermatologically Tested. Non-comedogenic. Essential Oil Free.',
      rating: 4.8,
      reviewCount: 2718,
      isBestSeller: true,
      isFeatured: true,
      isActive: true
    };

    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
      Object.assign(existingProduct, productData);
      await existingProduct.save();
      console.log('Successfully updated existing product:', existingProduct.name);
    } else {
      const created = await Product.create(productData);
      console.log('Successfully added new product to database:', created.name, 'with ID:', created._id);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error adding product:', err);
    process.exit(1);
  }
};

addProduct();
