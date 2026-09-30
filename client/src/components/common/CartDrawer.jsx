import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiShoppingBag, FiTrash2, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import QuantitySelector from './QuantitySelector';
import PriceDisplay from './PriceDisplay';

const CartDrawer = () => {
  const {
    cartItems,
    cartCount,
    subtotal,
    discount,
    shippingFee,
    total,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applying, setApplying] = useState(false);

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setApplying(true);
    try {
      await applyCoupon(couponInput);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-subtle">
          <div className="flex items-center gap-2">
            <FiShoppingBag className="w-5 h-5 text-neutral-900" />
            <h3 className="text-base font-bold tracking-wider uppercase text-neutral-900 font-editorial">
              Your Bag ({cartCount})
            </h3>
          </div>
          <button onClick={closeCart} className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors" aria-label="Close cart">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping bar */}
        <div className="px-5 py-3 bg-cream border-b border-subtle">
          {remainingForFreeShipping > 0 ? (
            <p className="text-xs text-neutral-700 mb-1.5">
              Add <strong className="text-neutral-900">₹{remainingForFreeShipping}</strong> more for <strong className="text-neutral-900 uppercase">Free Express Shipping</strong>
            </p>
          ) : (
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mb-1.5">
              <FiCheck className="w-4 h-4" /> You've unlocked FREE Express Shipping!
            </p>
          )}
          <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Item list */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-subtle">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <FiShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-600 font-medium mb-4">Your bag is currently empty.</p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-widest font-bold border border-neutral-900"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product || {};
              const itemId = item._id;
              const size = item.size || product.size;
              const price = item.price || product.price;

              return (
                <div key={itemId} className="py-4 flex gap-4">
                  <img
                    src={product.images ? product.images[0] : ''}
                    alt={product.name}
                    className="w-20 h-20 object-cover border border-subtle bg-neutral-50 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(itemId)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{size}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <QuantitySelector
                        quantity={item.quantity}
                        onDecrease={() => updateQuantity(itemId, item.quantity - 1)}
                        onIncrease={() => updateQuantity(itemId, item.quantity + 1)}
                        size="sm"
                      />
                      <PriceDisplay price={price * item.quantity} size="sm" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Coupon & Order Summary Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-neutral-50 border-t border-subtle space-y-4">
            {/* Coupon input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="font-semibold text-emerald-800">
                    Coupon '{appliedCoupon.code}' Applied (-₹{appliedCoupon.discountAmount})
                  </span>
                  <button onClick={removeCoupon} className="text-neutral-500 hover:text-neutral-900 font-bold">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="flex-1 text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none uppercase"
                  />
                  <button
                    type="submit"
                    disabled={applying || !couponInput.trim()}
                    className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-neutral-600 border-t border-subtle pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-700 font-semibold uppercase">Free</span> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-subtle pt-2 mt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  closeCart();
                  navigate('/checkout');
                }}
                className="w-full py-3.5 bg-neutral-900 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={closeCart}
                className="w-full py-2.5 text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900 text-center font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" onClick={closeCart}></div>
    </div>
  );
};

export default CartDrawer;
