import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const queryObj = { isActive: true };

    // Search query
    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i');
      queryObj.$or = [
        { name: regex },
        { description: regex },
        { shortDescription: regex },
        { skinConcerns: regex },
        { ingredients: regex },
        { sku: regex }
      ];
    }

    // Category filter
    if (req.query.category) {
      const cat = await Category.findOne({ slug: req.query.category });
      if (cat) {
        queryObj.category = cat._id;
      }
    }

    // Skin concern filter
    if (req.query.skinConcern) {
      const concerns = Array.isArray(req.query.skinConcern) 
        ? req.query.skinConcern 
        : req.query.skinConcern.split(',');
      queryObj.skinConcerns = { $in: concerns };
    }

    // Ingredient filter
    if (req.query.ingredient) {
      const ings = Array.isArray(req.query.ingredient)
        ? req.query.ingredient
        : req.query.ingredient.split(',');
      queryObj.ingredients = { $in: ings };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }

    // Availability filter
    if (req.query.inStock === 'true') {
      queryObj.stock = { $gt: 0 };
    }

    // Rating filter
    if (req.query.minRating) {
      queryObj.rating = { $gte: Number(req.query.minRating) };
    }

    // Special badges
    if (req.query.isBestSeller === 'true') queryObj.isBestSeller = true;
    if (req.query.isNew === 'true') queryObj.isNew = true;
    if (req.query.isFeatured === 'true') queryObj.isFeatured = true;

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price_asc') sort = { price: 1 };
    if (req.query.sort === 'price_desc') sort = { price: -1 };
    if (req.query.sort === 'rating') sort = { rating: -1, reviewCount: -1 };
    if (req.query.sort === 'popular') sort = { reviewCount: -1, rating: -1 };
    if (req.query.sort === 'discount') sort = { discount: -1 };

    const total = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Related products (same category or skin concerns)
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      isActive: true,
      $or: [
        { category: product.category._id },
        { skinConcerns: { $in: product.skinConcerns } }
      ]
    }).limit(4);

    res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isActive = false;
    await product.save();
    res.json({ success: true, message: 'Product deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
