import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/common/QuantitySelector';
import PriceDisplay from '../components/common/PriceDisplay';

const CartPage = () => {
  const {
    cartItems,
    subtotal,
    discount,
    shippingFee,
    total,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponErr, setCouponErr] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponErr('');
    try {
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (err) {
      setCouponErr(err.response?.data?.message || 'Invalid coupon');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <FiShoppingBag className="w-16 h-16 text-neutral-300 mx-auto" />
        <h1 className="text-3xl font-light text-neutral-900 font-editorial">Your Bag is Empty</h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          Explore our targeted active ingredient formulations and build your daily routine.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest border border-neutral-900"
        >
          Explore Formulations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8">
      <div className="border-b border-subtle pb-4">
        <h1 className="text-3xl font-light text-neutral-900 font-editorial">
          Shopping Bag <span className="text-sm text-neutral-500 font-normal">({cartItems.length} items)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Item list */}
        <div className="lg:col-span-8 space-y-6">
          <div className="divide-y divide-subtle border border-subtle bg-white">
            {cartItems.map((item) => {
              const product = item.product || {};
              const itemId = item._id;
              const price = item.price || product.price;

              return (
                <div key={itemId} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                  <div className="flex gap-4">
                    <img
                      src={product.images ? product.images[0] : ''}
                      alt={product.name}
                      className="w-20 h-20 object-cover border border-subtle bg-cream"
                    />
                    <div className="space-y-1">
                      <Link to={`/product/${product.slug}`} className="text-base font-semibold text-neutral-900 hover:underline">
                        {product.name}
                      </Link>
                      <p className="text-xs text-neutral-500">Volume: {item.size || product.size}</p>
                      <PriceDisplay price={price} size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-subtle">
                    <QuantitySelector
                      quantity={item.quantity}
                      onDecrease={() => updateQuantity(itemId, item.quantity - 1)}
                      onIncrease={() => updateQuantity(itemId, item.quantity + 1)}
                    />
                    <PriceDisplay price={price * item.quantity} size="md" />
                    <button
                      onClick={() => removeFromCart(itemId)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center">
            <Link to="/shop" className="text-xs uppercase tracking-widest font-bold text-neutral-900 underline">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-cream border border-subtle space-y-6 shadow-xs">
            <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900 font-editorial border-b border-subtle pb-3">
              Order Summary
            </h3>

            {/* Coupon Box */}
            <div>
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs flex justify-between items-center">
                  <span className="font-bold text-emerald-800">Coupon: {appliedCoupon.code}</span>
                  <button onClick={removeCoupon} className="text-neutral-500 font-bold hover:text-neutral-900">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-700 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10"
                      className="flex-1 text-xs px-3 py-2 border border-neutral-300 bg-white uppercase"
                    />
                    <button type="submit" className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider">Apply</button>
                  </div>
                  {couponErr && <p className="text-xs text-red-500">{couponErr}</p>}
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-neutral-600 border-t border-subtle pt-4">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-medium text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-700 font-bold uppercase">Free</span> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-900 border-t border-subtle pt-3 mt-3">
                <span>Final Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-neutral-900 text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
            >
              <span>Proceed to Checkout</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
