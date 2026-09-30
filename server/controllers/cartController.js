import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to populate & format cart
const getPopulatedCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name slug price compareAtPrice images stock size sku discount'
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

// @desc    Get user cart
// @route   GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items left in stock` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemSize = size || product.size;
    const itemPrice = product.price;

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === itemSize
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({ success: false, message: `Cannot add more than available stock (${product.stock})` });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        size: itemSize,
        price: itemPrice
      });
    }

    await cart.save();
    const updatedCart = await getPopulatedCart(req.user._id);

    res.json({ success: true, message: 'Added to cart', cart: updatedCart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const product = await Product.findById(item.product);
    if (product && quantity > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await getPopulatedCart(req.user._id);
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();

    const updatedCart = await getPopulatedCart(req.user._id);
    res.json({ success: true, message: 'Item removed from cart', cart: updatedCart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.couponCode = '';
      cart.discountAmount = 0;
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync guest cart with user cart on login
// @route   POST /api/cart/sync
export const syncCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const localItem of items) {
      if (!localItem.product || !localItem.product._id) continue;
      const productId = localItem.product._id;
      const size = localItem.size || localItem.product.size;
      const quantity = localItem.quantity || 1;

      const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId && item.size === size
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          size,
          price: localItem.price || localItem.product.price
        });
      }
    }

    await cart.save();
    const updatedCart = await getPopulatedCart(req.user._id);

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    next(error);
  }
};
