import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

const cleanupOldProducts = async () => {
  try {
    await connectDB();

    console.log('Cleaning up old demo products...');
    
    // Valid product slugs
    const validSlugs = ['miliva-face-cleanser', 'miliva-face-serum', 'miliva-acne-care-combo'];

    // Delete or deactivate all products that are NOT one of the 3 official MILIVA products
    const result = await Product.deleteMany({ slug: { $nin: validSlugs } });
    console.log(`Removed ${result.deletedCount} old demo products.`);

    // Cleanup empty categories except official categories
    const validCategorySlugs = ['face-cleanser', 'face-serum', 'combos'];
    const catResult = await Category.deleteMany({ slug: { $nin: validCategorySlugs } });
    console.log(`Cleaned up ${catResult.deletedCount} non-official categories.`);

    console.log('Product cleanup complete! Only official MILIVA products remain.');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
};

cleanupOldProducts();
