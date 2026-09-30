import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Bundle from './models/Bundle.js';
import Review from './models/Review.js';
import Coupon from './models/Coupon.js';
import Order from './models/Order.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing database collections for official MILIVA products...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Bundle.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();

    console.log('Creating Admin and Customer accounts...');
    const adminUser = await User.create({
      name: 'Miliva Admin',
      email: 'admin@miliva.com',
      password: 'Admin@123456',
      phone: '+91 9876543210',
      role: 'admin'
    });

    const demoCustomer = await User.create({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'Customer@123456',
      phone: '+91 9123456789',
      role: 'customer'
    });

    console.log('Creating Official MILIVA Categories...');
    const categoriesData = [
      { name: 'Face Cleanser', slug: 'face-cleanser', description: 'Gentle daily cleansing formulations designed to purify acne-prone skin.' },
      { name: 'Face Serum', slug: 'face-serum', description: 'Targeted high-potency serums for acne reduction, dark spots and even tone.' },
      { name: 'Combos & Bundles', slug: 'combos', description: 'Synergistic multi-step daily skincare regimens with exclusive savings.' }
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.slug] = c._id; });

    console.log('Creating Official MILIVA Products...');

    // 1. Salicylic Acid + LHA 2% Cleanser
    const lhaCleanserProduct = await Product.create({
      name: 'Salicylic Acid + LHA 2% Cleanser',
      slug: 'salicylic-acid-lha-2-cleanser',
      productType: 'Cleanser',
      shortDescription: 'Reduces Sebum & Prevents Breakout Without Drying Skin',
      description: 'A daily, gentle exfoliating, acne fighting face cleanser. It combines BHA + LHA (Salicylic Acid + Capryloyl Salicylic Acid) in 2% concentration, which provides deep cleansing, pore decongestion & sebum reduction without drying out the skin.\n\n"I have seen a reduction in acne and oiliness ever since I started using this face cleanser" -Nikhil V.',
      category: catMap['face-cleanser'],
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
        { size: '100ml', price: 299, compareAtPrice: 349, stock: 100, sku: '8906128100320', isActive: true },
        { size: '250ml', price: 599, compareAtPrice: 699, stock: 80, sku: '8906128101136', isActive: true }
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
      isFeatured: true
    });

    // 2. MILIVA Face Cleanser
    const cleanserProduct = await Product.create({
      name: 'MILIVA Face Cleanser',
      slug: 'miliva-face-cleanser',
      productType: 'Cleanser',
      shortDescription: 'A gentle daily face cleanser formulated for acne-prone skin and brighter-looking skin.',
      description: 'A gentle daily face cleanser formulated for acne-prone skin and brighter-looking skin. Deeply purifies pores without stripping natural moisture, leaving skin fresh, clear, and radiantly bright.',
      category: catMap['face-cleanser'],
      price: 499,
      compareAtPrice: 599,
      sku: 'MLV-CLN-100',
      stock: 100,
      size: '100 ml',
      images: ['/images/cleanser.svg', '/images/combo.svg'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      variants: [
        { size: '100 ml', price: 499, compareAtPrice: 599, stock: 100, sku: 'MLV-CLN-100', isActive: true },
        { size: '200 ml', price: 799, compareAtPrice: 999, stock: 80, sku: 'MLV-CLN-200', isActive: true }
      ],
      keyIngredients: [
        { name: 'Salicylic Acid', percentage: '2%', benefit: 'Unclogs pores and fights active acne' },
        { name: 'Zinc PCA', percentage: '1%', benefit: 'Balancing sebum production and reducing oiliness' },
        { name: 'Niacinamide', percentage: '5%', benefit: 'Brightening skin tone and reducing redness' }
      ],
      ingredients: ['Aqua', 'Salicylic Acid', 'Zinc PCA', 'Niacinamide', 'Sodium Cocoyl Apple Amino Acids', 'Glycerin', 'Propanediol', 'Phenoxyethanol'],
      benefits: [
        'Helps fight acne',
        'Helps brighten the appearance of skin',
        'Gentle cleansing',
        'Helps remove excess oil and impurities'
      ],
      howToUse: 'Massage 1-2 pumps onto damp skin for 60 seconds. Rinse thoroughly with lukewarm water morning and night.',
      suitableFor: 'Acne-prone skin, Oily skin, Combination skin',
      skinTypes: ['Acne-prone', 'Oily', 'Combination'],
      skinConcerns: ['Acne', 'Dullness', 'Excess Oil'],
      texture: 'Gentle Foaming Gel',
      fragrance: '100% Fragrance-Free',
      safetyInfo: 'Dermatologically Tested. Patch test before initial use.',
      rating: 4.9,
      reviewCount: 42,
      isBestSeller: true,
      isFeatured: true
    });

    // 2. MILIVA Face Serum
    const serumProduct = await Product.create({
      name: 'MILIVA Face Serum',
      slug: 'miliva-face-serum',
      productType: 'Serum',
      shortDescription: 'A targeted facial serum formulated with Salicylic Acid, Alpha Arbutin and Niacinamide for clearer, brighter and more even-looking skin.',
      description: 'A targeted facial serum formulated with Salicylic Acid, Alpha Arbutin and Niacinamide for clearer, brighter and more even-looking skin. Penetrates quickly to clear active blemishes and fade stubborn dark spots.',
      category: catMap['face-serum'],
      price: 599,
      compareAtPrice: 699,
      sku: 'MLV-SER-30',
      stock: 100,
      size: '30 ml',
      images: ['/images/serum.svg'],
      variants: [
        { size: '30 ml', price: 599, compareAtPrice: 699, stock: 100, sku: 'MLV-SER-30', isActive: true },
        { size: '50 ml', price: 899, compareAtPrice: 1099, stock: 70, sku: 'MLV-SER-50', isActive: true }
      ],
      keyIngredients: [
        { name: 'Salicylic Acid', percentage: '2%', benefit: 'Reduces appearance of acne blemishes' },
        { name: 'Alpha Arbutin', percentage: '2%', benefit: 'Brightens skin and fades dark spots' },
        { name: 'Niacinamide', percentage: '10%', benefit: 'Improves uneven tone & strengthens barrier' }
      ],
      ingredients: ['Water', 'Niacinamide', 'Salicylic Acid', 'Alpha Arbutin', 'Sodium Hyaluronate', 'Glycerin', 'Propanediol', 'Ethoxydiglycol'],
      benefits: [
        'Helps reduce the appearance of acne',
        'Helps brighten skin',
        'Helps improve the appearance of uneven skin tone',
        'Helps support clearer-looking skin'
      ],
      howToUse: 'Apply 3-4 drops to clean face and neck in the morning and evening before moisturizer.',
      suitableFor: 'Acne-prone skin, Oily skin, Combination skin, Uneven-looking skin tone',
      skinTypes: ['Acne-prone', 'Oily', 'Combination', 'Uneven Tone'],
      skinConcerns: ['Acne', 'Hyperpigmentation', 'Uneven Skin Tone'],
      texture: 'Lightweight Fluid Serum',
      fragrance: '100% Fragrance-Free',
      safetyInfo: 'Dermatologically Tested. Non-comedogenic.',
      rating: 4.9,
      reviewCount: 58,
      isBestSeller: true,
      isFeatured: true
    });

    // 3. MILIVA Acne Care Combo (Bundle Product)
    const comboProduct = await Product.create({
      name: 'MILIVA Acne Care Combo',
      slug: 'miliva-acne-care-combo',
      productType: 'Combo',
      isBundle: true,
      shortDescription: 'Complete 2-step daily acne fighting and skin brightening regimen.',
      description: 'The ultimate synergistic 2-step skincare set: Includes 1x MILIVA Face Cleanser and 1x MILIVA Face Serum. Designed to clear blemishes, balance oil, and even out skin tone.',
      category: catMap['combos'],
      price: 999,
      compareAtPrice: 1098,
      sku: 'MLV-CMB-REG',
      stock: 60,
      size: '100 ml Cleanser + 30 ml Serum',
      images: ['/images/combo.svg'],
      variants: [
        { size: '100 ml Cleanser + 30 ml Serum', price: 999, compareAtPrice: 1098, stock: 60, sku: 'MLV-CMB-REG', isActive: true },
        { size: '200 ml Cleanser + 50 ml Serum', price: 1549, compareAtPrice: 1698, stock: 40, sku: 'MLV-CMB-MAX', isActive: true }
      ],
      keyIngredients: [
        { name: 'Salicylic Acid', percentage: '2%', benefit: 'Deep pore unclogging' },
        { name: 'Zinc PCA', percentage: '1%', benefit: 'Sebum regulation' },
        { name: 'Alpha Arbutin', percentage: '2%', benefit: 'Brightening dark spots' },
        { name: 'Niacinamide', percentage: '10%', benefit: 'Barrier enhancement' }
      ],
      benefits: [
        'Includes 1 × MILIVA Face Cleanser & 1 × MILIVA Face Serum',
        'Helps fight acne & clear blemishes',
        'Brightens skin tone & fades dark marks',
        'Special combo savings compared to buying individually'
      ],
      howToUse: 'Step 1: Cleanse with MILIVA Face Cleanser. Step 2: Follow with 3-4 drops of MILIVA Face Serum.',
      suitableFor: 'Acne-prone skin, Oily skin, Combination skin',
      skinTypes: ['Acne-prone', 'Oily', 'Combination'],
      skinConcerns: ['Acne', 'Hyperpigmentation', 'Excess Oil'],
      texture: 'Complete 2-Step Routine',
      fragrance: '100% Fragrance-Free',
      safetyInfo: 'Dermatologically Tested.',
      rating: 5.0,
      reviewCount: 36,
      isBestSeller: true,
      isFeatured: true
    });

    console.log('Creating Official Bundle Record for Admin Bundle Management...');
    await Bundle.create({
      name: 'MILIVA Acne Care Combo',
      slug: 'miliva-acne-care-combo',
      description: 'Includes 1x MILIVA Face Cleanser + 1x MILIVA Face Serum for complete acne control and skin brightening.',
      shortDescription: 'Complete 2-step daily routine',
      images: ['/images/combo.svg'],
      configs: [
        {
          title: '100 ml Cleanser + 30 ml Serum',
          cleanserVariantSize: '100 ml',
          serumVariantSize: '30 ml',
          price: 999,
          compareAtPrice: 1098,
          sku: 'MLV-CMB-REG',
          stock: 60
        },
        {
          title: '200 ml Cleanser + 50 ml Serum',
          cleanserVariantSize: '200 ml',
          serumVariantSize: '50 ml',
          price: 1549,
          compareAtPrice: 1698,
          sku: 'MLV-CMB-MAX',
          stock: 40
        }
      ],
      benefits: [
        '1 × MILIVA Face Cleanser',
        '1 × MILIVA Face Serum',
        'Synergistic Acne Treatment & Skin Brightening',
        'Exclusive Bundle Discount'
      ],
      stockStrategy: 'auto',
      isFeatured: true,
      isActive: true
    });

    console.log('Creating sample verified reviews for MILIVA products...');
    await Review.create([
      {
        user: demoCustomer._id,
        product: cleanserProduct._id,
        rating: 5,
        title: 'Best daily cleanser for active acne!',
        comment: 'I have been using MILIVA Face Cleanser for 3 weeks now. My skin feels fresh without any tight or stripped feeling, and active breakouts dried up fast.',
        isVerifiedPurchase: true,
        isApproved: true
      },
      {
        user: demoCustomer._id,
        product: serumProduct._id,
        rating: 5,
        title: 'Faded my dark post-acne spots',
        comment: 'The combination of Alpha Arbutin and Salicylic Acid is brilliant. My acne marks are visibly lighter and my overall tone looks so bright.',
        isVerifiedPurchase: true,
        isApproved: true
      }
    ]);

    console.log('Creating Promotional Coupons...');
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountAmount: 10,
        minOrderValue: 499,
        maxDiscountAmount: 200,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        usageLimit: 1000,
        isActive: true
      },
      {
        code: 'MILIVA100',
        discountType: 'fixed',
        discountAmount: 100,
        minOrderValue: 699,
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        isActive: true
      }
    ]);

    console.log('Official MILIVA database seeded successfully! ONLY the 2 products + 1 combo exist.');
    process.exit(0);
  } catch (error) {
    console.error('Database Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
