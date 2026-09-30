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

// @desc    Render HTML page with Open Graph meta tags for social crawlers (WhatsApp, Facebook, Twitter, iMessage)
// @route   GET /p/:slug or GET /share/product/:slug
export const renderProductSharePage = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let product = await Product.findOne({ slug, isActive: true }).populate('category', 'name');
    if (!product && slug && slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug).populate('category', 'name');
    }

    const clientUrl = process.env.CLIENT_URL || 'https://bemiliva.netlify.app';
    const targetUrl = product ? `${clientUrl}/product/${product.slug}` : clientUrl;

    if (!product) {
      return res.redirect(targetUrl);
    }

    const imageUrl = product.images && product.images[0]
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop';

    const title = `${product.name} — ₹${product.price} | MILIVA Skincare`;
    const description = product.shortDescription || product.description || 'Discover luxury dermatologically tested formulations by MILIVA Skincare.';

    // Send server-rendered HTML with full Open Graph image tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">

  <!-- Open Graph / WhatsApp / iMessage / Facebook Preview Meta Tags -->
  <meta property="og:site_name" content="MILIVA Skincare">
  <meta property="og:type" content="product">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="600">
  <meta property="og:image:height" content="600">
  <meta property="og:url" content="${targetUrl}">
  <meta property="product:price:amount" content="${product.price}">
  <meta property="product:price:currency" content="INR">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- Instant Client Redirect -->
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
  <script>
    window.location.href = "${targetUrl}";
  </script>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #FAF8F5; color: #171717;">
  <div style="max-width: 420px; margin: 0 auto; background: #fff; padding: 24px; border: 1px solid #e5e5e5; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <img src="${imageUrl}" alt="${product.name}" style="width: 100%; max-height: 300px; object-fit: contain; margin-bottom: 16px;">
    <h2 style="font-size: 18px; margin-bottom: 8px;">${product.name}</h2>
    <p style="font-weight: bold; color: #059669; font-size: 16px;">₹${product.price}</p>
    <p style="font-size: 13px; color: #666;">${description}</p>
    <a href="${targetUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #171717; color: #fff; text-decoration: none; font-size: 13px; font-weight: bold;">View Product on MILIVA</a>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
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
