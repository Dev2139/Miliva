import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { 
  FiShoppingBag, 
  FiRefreshCw, 
  FiEye, 
  FiCheckCircle, 
  FiTruck, 
  FiPackage, 
  FiXCircle, 
  FiMapPin, 
  FiUser, 
  FiClock,
  FiX
} from 'react-icons/fi';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Form states for modal status update
  const [status, setStatus] = useState('Processing');
  const [carrier, setCarrier] = useState('Bluedart');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [comment, setComment] = useState('');

  const { showToast } = useAdminToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      showToast('Failed to load customer orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setStatus(order.orderStatus || 'Pending');
    setCarrier(order.tracking?.courier || order.trackingInfo?.carrier || 'Bluedart');
    setTrackingNumber(order.tracking?.trackingNumber || order.trackingInfo?.trackingNumber || '');
    setComment('');
    setShowModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const payload = {
        orderStatus: status,
        status: status,
        courier: carrier,
        carrier: carrier,
        trackingNumber: trackingNumber,
        note: comment,
        comment: comment,
        trackingInfo: {
          carrier,
          trackingNumber,
          shippedAt: status === 'Shipped' || status === 'Out for Delivery' || status === 'Delivered' ? new Date() : undefined,
          deliveredAt: status === 'Delivered' ? new Date() : undefined
        }
      };

      const res = await adminService.updateOrderStatus(selectedOrder._id, payload);
      if (res.success) {
        showToast(`Order status updated to ${status}`, 'success');
        setShowModal(false);
        loadOrders();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">MILIVA Orders & Fulfillment</h2>
          <p className="text-neutral-400 text-sm mt-1">Manage customer purchases, shipment tracking & delivery statuses</p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2.5 rounded-xl text-sm transition-colors border border-neutral-700"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
          <FiShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No orders placed yet</h3>
          <p className="text-neutral-400 text-sm mt-1">Customer orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Order Reference</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Items Summary</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Total (₹)</th>
                  <th className="py-4 px-6">Order Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-emerald-400 font-bold block text-sm">
                        #{order.orderNumber || order._id.substring(18)}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-white">{order.user?.name || order.shippingAddress?.fullName || 'Customer'}</p>
                      <p className="text-xs text-neutral-400">{order.shippingAddress?.phone || order.user?.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1 max-w-[200px]">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="text-xs text-neutral-300 truncate">
                            <span className="font-bold text-emerald-400">{item.quantity}x</span> {item.name || item.product?.name} ({item.size})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 font-medium text-neutral-300 uppercase">
                        {order.paymentMethod || 'COD'}
                      </span>
                      <span className={`block text-[11px] font-semibold mt-1 ${
                        order.isPaid ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-white text-base">
                      ₹{order.totalAmount}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        order.orderStatus === 'Delivered' 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : order.orderStatus === 'Shipped' || order.orderStatus === 'Out for Delivery'
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenDetail(order)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 text-xs font-semibold border border-neutral-700 transition-colors"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail & Status Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center">
                  <FiShoppingBag className="w-5 h-5 mr-2 text-emerald-400" />
                  Order #{selectedOrder.orderNumber || selectedOrder._id}
                </h3>
                <p className="text-xs text-neutral-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center">
                    <FiUser className="w-4 h-4 mr-1.5 text-emerald-400" />
                    Customer Details
                  </h4>
                  <p className="font-bold text-white">{selectedOrder.user?.name || selectedOrder.shippingAddress?.fullName}</p>
                  <p className="text-xs text-neutral-300 mt-1">{selectedOrder.user?.email}</p>
                  <p className="text-xs text-neutral-300">{selectedOrder.shippingAddress?.phone}</p>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center">
                    <FiMapPin className="w-4 h-4 mr-1.5 text-emerald-400" />
                    Shipping Address
                  </h4>
                  <p className="text-xs text-neutral-200">
                    {selectedOrder.shippingAddress?.house || selectedOrder.shippingAddress?.addressLine1}
                    {(selectedOrder.shippingAddress?.street || selectedOrder.shippingAddress?.addressLine2) ? `, ${selectedOrder.shippingAddress?.street || selectedOrder.shippingAddress?.addressLine2}` : ''}
                  </p>
                  <p className="text-xs text-neutral-300 font-semibold mt-1">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Purchased Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-neutral-900 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.image || '/images/cleanser.svg'} 
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-contain bg-neutral-900 p-1 border border-neutral-800"
                        />
                        <div>
                          <p className="font-semibold text-white text-xs">{item.name}</p>
                          <p className="text-[11px] text-neutral-400">Variant: {item.size || 'Default'} × {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white text-xs">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-800 flex justify-between items-center font-bold text-sm">
                  <span className="text-neutral-300">Grand Total:</span>
                  <span className="text-emerald-400 text-base">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Update Status Form */}
              <form onSubmit={handleUpdateStatus} className="bg-neutral-950 border border-emerald-500/20 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center">
                  <FiTruck className="w-4 h-4 mr-2" />
                  Update Order Pipeline & Courier AWB
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Fulfillment Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs font-semibold"
                    >
                      <option value="Pending">Pending Approval</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing & Packing</option>
                      <option value="Packed">Packed for Dispatch</option>
                      <option value="Shipped">Shipped in Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Courier Partner
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      placeholder="e.g. Bluedart / Delhivery / Shiprocket"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    AWB Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    placeholder="e.g. BD10982347923"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-neutral-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/10"
                  >
                    {updatingStatus ? 'Updating Order...' : 'Save Order Status & Send Notification'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
