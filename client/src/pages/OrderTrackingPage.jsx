import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheck, FiTruck, FiPackage, FiClock, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { orderService } from '../services/orderService';
import PriceDisplay from '../components/common/PriceDisplay';

const TRACKING_STEPS = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        const res = await orderService.trackOrder(id);
        setTrackingData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTracking();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-sm font-medium text-neutral-500 animate-pulse">Retrieving tracking status...</p>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-light text-neutral-900 font-editorial">Order Not Found</h2>
        <Link to="/shop" className="inline-block px-6 py-3 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest">
          Return to Shop
        </Link>
      </div>
    );
  }

  const currentStepIndex = TRACKING_STEPS.indexOf(trackingData.orderStatus);
  const activeIdx = currentStepIndex >= 0 ? currentStepIndex : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-subtle pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Shipment Intelligence</span>
          <h1 className="text-3xl font-light text-neutral-900 font-editorial">
            Tracking Order <span className="font-bold font-mono">#{trackingData.orderNumber}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-3 py-1 border border-emerald-200">
            {trackingData.orderStatus}
          </span>
        </div>
      </div>

      {/* Courier & Details Card */}
      <div className="p-6 bg-cream border border-subtle grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-700 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">Courier Partner</span>
          <p className="font-bold text-neutral-900">{trackingData.tracking?.courier || 'Bluedart Express'}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">Tracking AWB No.</span>
          <p className="font-bold text-neutral-900 font-mono">{trackingData.tracking?.trackingNumber || 'BD89420194'}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">Estimated Delivery</span>
          <p className="font-bold text-neutral-900">{trackingData.tracking?.estimatedDelivery || '3-5 Days'}</p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="p-8 bg-white border border-subtle space-y-6">
        <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900 font-editorial border-b border-subtle pb-3">
          Live Status Timeline
        </h3>

        <div className="relative pl-6 border-l-2 border-subtle space-y-8 my-4">
          {TRACKING_STEPS.map((stepName, idx) => {
            const isDone = idx <= activeIdx;
            const isCurrent = idx === activeIdx;

            // Find matching timeline log if exists
            const logMatch = trackingData.tracking?.timeline?.find(
              (t) => t.status.toLowerCase().includes(stepName.toLowerCase())
            );

            return (
              <div key={idx} className="relative">
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isDone
                      ? 'bg-neutral-900 text-white ring-4 ring-cream'
                      : 'bg-white border-2 border-neutral-300 text-neutral-400'
                  }`}
                >
                  {isDone ? <FiCheck className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isCurrent ? 'text-neutral-900 text-base' : isDone ? 'text-neutral-900' : 'text-neutral-400'}`}>
                      {stepName}
                    </h4>
                    {isCurrent && (
                      <span className="text-[9px] uppercase font-bold tracking-widest bg-neutral-900 text-white px-2 py-0.5 animate-pulse">
                        Current Status
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-500 mt-0.5">
                    {logMatch ? logMatch.description : isDone ? `Completed` : `Pending dispatch`}
                  </p>

                  {logMatch?.timestamp && (
                    <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                      {new Date(logMatch.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items in shipment */}
      <div className="p-6 bg-white border border-subtle space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Items in this Package</h4>
        <div className="divide-y divide-subtle">
          {trackingData.items?.map((item, i) => (
            <div key={i} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={item.image} alt="" className="w-10 h-10 object-cover border border-subtle" />
                <span className="font-semibold text-neutral-900">{item.name} ({item.size}) x {item.quantity}</span>
              </div>
              <span className="font-bold">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
