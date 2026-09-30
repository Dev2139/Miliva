import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheck, FiMapPin, FiCreditCard, FiTruck, FiShield, FiLock, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import PriceDisplay from '../components/common/PriceDisplay';

const CheckoutPage = () => {
  const { cartItems, subtotal, discount, shippingFee, total, clearCart, appliedCoupon } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New Address Form
  const [newAddr, setNewAddr] = useState({
    fullName: user ? user.name : '',
    phone: user ? user.phone || '' : '',
    house: '',
    street: '',
    area: '',
    city: '',
    state: '',
    country: 'India',
    pincode: ''
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'cod'
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      orderService.getAddresses().then((res) => {
        if (res.addresses && res.addresses.length > 0) {
          setAddresses(res.addresses);
          const def = res.addresses.find((a) => a.isDefault) || res.addresses[0];
          setSelectedAddressId(def._id);
        } else {
          setShowNewAddressForm(true);
        }
      }).catch(console.error);
    } else {
      setShowNewAddressForm(true);
    }
  }, [user]);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-light text-neutral-900 font-editorial">Your Bag is Empty</h2>
        <Link to="/shop" className="inline-block px-6 py-3 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest">
          Explore Formulations
        </Link>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId) || newAddr;

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.house || !newAddr.street || !newAddr.city || !newAddr.state || !newAddr.pincode) {
      showToast('Please fill out all address fields', 'error');
      return;
    }

    if (user) {
      try {
        const res = await orderService.addAddress(newAddr);
        setAddresses(res.addresses);
        const added = res.addresses[0];
        setSelectedAddressId(added._id);
        setShowNewAddressForm(false);
        showToast('Address saved', 'success');
      } catch (err) {
        showToast('Failed to save address', 'error');
      }
    } else {
      setShowNewAddressForm(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedAddress.fullName || !selectedAddress.pincode) {
      showToast('Please select or provide a valid shipping address', 'error');
      setStep(1);
      return;
    }

    try {
      setProcessing(true);

      // Step A: Create order in database
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product._id || item.product,
          quantity: item.quantity,
          size: item.size || item.product.size,
          name: item.product.name || item.name,
          price: item.price || item.product.price
        })),
        shippingAddress: selectedAddress,
        paymentMethod,
        discountAmount: discount,
        couponCode: appliedCoupon ? appliedCoupon.code : ''
      };

      const res = await orderService.createOrder(orderPayload);
      const createdOrder = res.order;

      if (paymentMethod === 'cod') {
        clearCart();
        showToast('Order placed successfully via COD!', 'success');
        navigate(`/order-confirmation/${createdOrder._id}`);
        return;
      }

      // Step B: Razorpay Online Payment Flow
      const isScriptLoaded = await loadRazorpayScript();

      const payRes = await paymentService.createPaymentOrder(createdOrder._id);
      const { razorpayOrder, keyId } = payRes;

      if (!isScriptLoaded || razorpayOrder.isMock) {
        // Fallback instant verification for sandbox mock payment mode
        const verifyRes = await paymentService.verifyPayment({
          orderId: createdOrder._id,
          razorpayOrderId: razorpayOrder.id,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: 'mock_verified_sig'
        });

        clearCart();
        showToast('Payment verified successfully!', 'success');
        navigate(`/order-confirmation/${verifyRes.order._id}`);
        return;
      }

      // Open Real Razorpay Modal window
      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'MILIVA Skincare',
        description: `Order #${createdOrder.orderNumber}`,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200&auto=format&fit=crop',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await paymentService.verifyPayment({
              orderId: createdOrder._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            clearCart();
            showToast('Payment successful!', 'success');
            navigate(`/order-confirmation/${verifyRes.order._id}`);
          } catch (err) {
            showToast('Payment verification failed', 'error');
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          email: user ? user.email : '',
          contact: selectedAddress.phone
        },
        theme: {
          color: '#171717'
        }
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (err) {
      const msg = err.response?.data?.message || 'Order creation failed';
      showToast(msg, 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Checkout Header & Steps */}
      <div className="border-b border-subtle pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Secure Checkout</span>
          <h1 className="text-3xl font-light text-neutral-900 font-editorial">Checkout Flow</h1>
        </div>

        {/* Multi-step Indicators */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
            <span>Shipping</span>
          </div>
          <span className="text-neutral-300">&rarr;</span>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
            <span>Payment</span>
          </div>
          <span className="text-neutral-300">&rarr;</span>
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
            <span>Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Step Content Main Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-neutral-900 font-editorial uppercase tracking-wider flex items-center gap-2">
                <FiMapPin /> Step 1: Delivery Address
              </h3>

              {/* Saved Addresses list */}
              {addresses.length > 0 && !showNewAddressForm && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`p-5 border cursor-pointer transition-all ${
                          selectedAddressId === addr._id ? 'border-neutral-900 bg-cream/50 ring-1 ring-neutral-900' : 'border-subtle bg-white hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-neutral-900">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-neutral-900 text-white px-2 py-0.5">Default</span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {addr.house}, {addr.street}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p className="text-xs text-neutral-500 mt-2 font-mono">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs uppercase font-bold tracking-widest text-neutral-900 underline"
                  >
                    + Add New Delivery Address
                  </button>
                </div>
              )}

              {/* New Address Form */}
              {(showNewAddressForm || addresses.length === 0) && (
                <form onSubmit={handleSaveNewAddress} className="p-6 bg-cream border border-subtle space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-900">Enter Shipping Address</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">House / Flat No., Building</label>
                    <input
                      type="text"
                      value={newAddr.house}
                      onChange={(e) => setNewAddr({ ...newAddr, house: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Street Address & Landmark</label>
                    <input
                      type="text"
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">City</label>
                      <input
                        type="text"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">State</label>
                      <input
                        type="text"
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">Pincode</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider">
                      Save & Use Address
                    </button>
                    {addresses.length > 0 && (
                      <button type="button" onClick={() => setShowNewAddressForm(false)} className="px-4 py-2.5 text-xs text-neutral-600 uppercase font-semibold">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!selectedAddress || !selectedAddress.fullName}
                className="px-8 py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
              >
                <span>Continue to Payment</span>
                <FiArrowRight />
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-neutral-900 font-editorial uppercase tracking-wider flex items-center gap-2">
                <FiCreditCard /> Step 2: Payment Method
              </h3>

              <div className="space-y-4">
                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-5 border cursor-pointer transition-all flex items-start justify-between ${
                    paymentMethod === 'razorpay' ? 'border-neutral-900 bg-cream/50 ring-1 ring-neutral-900' : 'border-subtle bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="mt-1 text-neutral-900 focus:ring-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">Razorpay Secure Online Payment</h4>
                      <p className="text-xs text-neutral-500">Pay via UPI (GPay, PhonePe), Credit/Debit Cards, NetBanking or Wallet.</p>
                      <span className="inline-block mt-2 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                        Fastest & Recommended
                      </span>
                    </div>
                  </div>
                  <FiLock className="w-5 h-5 text-neutral-400" />
                </div>

                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 border cursor-pointer transition-all flex items-start justify-between ${
                    paymentMethod === 'cod' ? 'border-neutral-900 bg-cream/50 ring-1 ring-neutral-900' : 'border-subtle bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-neutral-900 focus:ring-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">Cash on Delivery (COD)</h4>
                      <p className="text-xs text-neutral-500">Pay in cash when your formulation parcel is delivered to your doorstep.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 bg-white border border-neutral-300 text-neutral-900 text-xs uppercase font-bold tracking-wider"
                >
                  Back to Address
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest flex items-center gap-2 hover:bg-black transition-colors"
                >
                  <span>Review Order</span>
                  <FiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & PLACE ORDER */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-neutral-900 font-editorial uppercase tracking-wider flex items-center gap-2">
                <FiCheck /> Step 3: Final Order Review
              </h3>

              <div className="p-6 bg-cream border border-subtle space-y-4 text-xs text-neutral-700">
                <div className="flex justify-between items-center border-b border-subtle pb-3">
                  <div>
                    <span className="font-bold text-neutral-900 uppercase tracking-wider block">Deliver To:</span>
                    <p className="text-neutral-800 font-semibold">{selectedAddress.fullName} ({selectedAddress.phone})</p>
                    <p className="text-neutral-500">{selectedAddress.house}, {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-neutral-900 font-bold underline">Edit</button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-neutral-900 uppercase tracking-wider block">Payment Method:</span>
                    <p className="text-neutral-800 font-semibold uppercase">{paymentMethod === 'razorpay' ? 'Razorpay Online Payment' : 'Cash On Delivery (COD)'}</p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-neutral-900 font-bold underline">Edit</button>
                </div>
              </div>

              {/* Items summary table */}
              <div className="divide-y divide-subtle border border-subtle bg-white">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.product?.images?.[0]} alt="" className="w-12 h-12 object-cover border border-subtle" />
                      <div>
                        <p className="font-bold text-neutral-900">{item.product?.name}</p>
                        <p className="text-neutral-500">{item.size} x {item.quantity}</p>
                      </div>
                    </div>
                    <PriceDisplay price={(item.price || item.product?.price) * item.quantity} size="sm" />
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 bg-white border border-neutral-300 text-neutral-900 text-xs uppercase font-bold tracking-wider"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 py-4 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
                >
                  <FiLock className="w-4 h-4" />
                  <span>{processing ? 'Processing Order...' : paymentMethod === 'razorpay' ? 'Pay Now via Razorpay' : 'Place COD Order'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-cream border border-subtle space-y-4 shadow-xs">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-editorial border-b border-subtle pb-3">
              Order Details
            </h4>

            <div className="space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
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
                <span>Total Payable</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
