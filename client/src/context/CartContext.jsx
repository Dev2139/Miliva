import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { couponService } from '../services/couponService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('miliva_guest_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fetch cart from server if logged in
  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.cart) {
        setCartItems(res.cart.items || []);
      }
    } catch (err) {
      console.warn('Failed to fetch server cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // Merge guest cart items into user backend cart if any exist
      const localGuestCart = localStorage.getItem('miliva_guest_cart');
      if (localGuestCart) {
        const guestItems = JSON.parse(localGuestCart);
        if (guestItems.length > 0) {
          cartService.syncCart(guestItems).then(() => {
            localStorage.removeItem('miliva_guest_cart');
            fetchCart();
          });
        } else {
          fetchCart();
        }
      } else {
        fetchCart();
      }
    } else {
      // Load local guest cart
      const saved = localStorage.getItem('miliva_guest_cart');
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  }, [user, fetchCart]);

  // Persist guest cart locally
  useEffect(() => {
    if (!user) {
      localStorage.setItem('miliva_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1, size = '') => {
    const selectedSize = size || product.size;

    if (user) {
      try {
        const res = await cartService.addToCart(product._id, quantity, selectedSize);
        setCartItems(res.cart.items || []);
        showToast(`Added ${product.name} to cart`, 'success');
        setIsCartOpen(true);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to add item to cart';
        showToast(msg, 'error');
      }
    } else {
      // Guest local add
      setCartItems((prev) => {
        const existingIdx = prev.findIndex(
          (item) => (item.product._id || item.product) === product._id && item.size === selectedSize
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          return updated;
        } else {
          return [
            ...prev,
            {
              _id: `guest_${Date.now()}_${Math.random()}`,
              product: product,
              quantity,
              size: selectedSize,
              price: product.price
            }
          ];
        }
      });
      showToast(`Added ${product.name} to cart`, 'success');
      setIsCartOpen(true);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return removeFromCart(itemId);

    if (user) {
      try {
        const res = await cartService.updateQuantity(itemId, quantity);
        setCartItems(res.cart.items || []);
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to update quantity', 'error');
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item._id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        const res = await cartService.removeItem(itemId);
        setCartItems(res.cart.items || []);
        showToast('Item removed from cart', 'info');
      } catch (err) {
        showToast('Failed to remove item', 'error');
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      showToast('Item removed from cart', 'info');
    }
  };

  const clearCart = async () => {
    if (user) {
      await cartService.clearCart();
    }
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('miliva_guest_cart');
  };

  const applyCoupon = async (code) => {
    try {
      const res = await couponService.validateCoupon(code, subtotal);
      if (res.success) {
        setAppliedCoupon(res);
        showToast(`Coupon '${code}' applied successfully!`, 'success');
        return res;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      showToast(msg, 'error');
      throw err;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.price || item.product?.price || 0;
    return sum + itemPrice * item.quantity;
  }, 0);

  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 70;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        discount,
        shippingFee,
        total,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
