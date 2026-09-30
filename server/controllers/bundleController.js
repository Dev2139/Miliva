import Bundle from '../models/Bundle.js';
import Product from '../models/Product.js';

// @desc    Get all bundles
// @route   GET /api/bundles
export const getBundles = async (req, res, next) => {
  try {
    const query = req.user && req.user.role === 'admin' ? {} : { isActive: true };
    const bundles = await Bundle.find(query).sort({ createdAt: -1 });

    // Calculate dynamic auto-stock if enabled
    const processedBundles = await Promise.all(
      bundles.map(async (bundle) => {
        const bObj = bundle.toObject();
        if (bObj.stockStrategy === 'auto') {
          // Fetch cleanser and serum stocks
          const cleanser = await Product.findOne({ slug: 'miliva-face-cleanser' });
          const serum = await Product.findOne({ slug: 'miliva-face-serum' });
          const minStock = Math.min(cleanser ? cleanser.stock : 0, serum ? serum.stock : 0);

          bObj.configs = bObj.configs.map(cfg => ({
            ...cfg,
            stock: Math.min(cfg.stock || 50, minStock)
          }));
        }
        return bObj;
      })
    );

    res.json({ success: true, bundles: processedBundles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single bundle by slug
// @route   GET /api/bundles/:slug
export const getBundleBySlug = async (req, res, next) => {
  try {
    const bundle = await Bundle.findOne({ slug: req.params.slug, isActive: true });
    if (!bundle) {
      return res.status(404).json({ success: false, message: 'Bundle not found' });
    }

    res.json({ success: true, bundle });
  } catch (error) {
    next(error);
  }
};

// @desc    Create bundle (Admin)
// @route   POST /api/bundles
export const createBundle = async (req, res, next) => {
  try {
    const bundle = await Bundle.create(req.body);
    res.status(201).json({ success: true, bundle });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bundle (Admin)
// @route   PUT /api/bundles/:id
export const updateBundle = async (req, res, next) => {
  try {
    const bundle = await Bundle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bundle) {
      return res.status(404).json({ success: false, message: 'Bundle not found' });
    }
    res.json({ success: true, bundle });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete bundle (Admin)
// @route   DELETE /api/bundles/:id
export const deleteBundle = async (req, res, next) => {
  try {
    await Bundle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Bundle deleted' });
  } catch (error) {
    next(error);
  }
};
