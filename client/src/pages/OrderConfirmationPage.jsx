import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiTruck, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { orderService } from '../services/orderService';
import PriceDisplay from '../components/common/PriceDisplay';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderById(id);
        if (res.order) setOrder(res.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-sm font-medium text-neutral-500 animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-light text-neutral-900 font-editorial">Order Not Found</h2>
        <Link to="/shop" className="inline-block px-6 py-3 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      {/* Success banner */}
      <div className="p-8 bg-cream border border-subtle text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
          <FiCheckCircle className="w-10 h-10" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-200">
          Order Successfully Confirmed
        </span>
        <h1 className="text-3xl font-light text-neutral-900 font-editorial">
          Thank you for your order!
        </h1>
        <p className="text-xs text-neutral-600 max-w-md mx-auto">
          We are preparing your formulations with clinical care. A confirmation email has been dispatched to your inbox.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link
            to={`/orders/${order._id}/track`}
            className="px-6 py-3 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors flex items-center gap-2"
          >
            <FiTruck className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 bg-white text-neutral-900 border border-neutral-300 text-xs uppercase font-bold tracking-widest hover:bg-neutral-100 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="p-6 bg-white border border-subtle space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-subtle pb-4">
          <div>
            <p className="text-xs uppercase font-bold text-neutral-400">Order Number</p>
            <p className="text-lg font-bold text-neutral-900 font-mono">#{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-neutral-400">Payment Status</p>
            <span className={`inline-block text-xs uppercase font-bold px-2 py-0.5 border ${
              order.isPaid || order.paymentMethod === 'cod' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {order.isPaid ? 'Paid' : order.paymentMethod === 'cod' ? 'COD (Pending)' : 'Pending'}
            </span>
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-neutral-400">Estimated Delivery</p>
            <p className="text-sm font-semibold text-neutral-900">{order.tracking?.estimatedDelivery || '3-5 Days'}</p>
          </div>
        </div>

        {/* Shipping details & Items list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-700">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-1.5">
              <FiMapPin /> Delivery Address
            </h4>
            <p className="font-semibold text-neutral-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.house}, {order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p className="mt-1 font-mono">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-1.5">
              <FiPackage /> Items Summary
            </h4>
            <ul className="divide-y divide-subtle">
              {order.items.map((item, i) => (
                <li key={i} className="py-2 flex justify-between items-center">
                  <span>{item.name} ({item.size}) x {item.quantity}</span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-subtle flex justify-between font-bold text-sm text-neutral-900 mt-2">
              <span>Total Paid:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
