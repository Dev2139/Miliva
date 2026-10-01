import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { 
  FiShoppingBag, 
  FiRefreshCw, 
  FiEye, 
  FiTruck, 
  FiMapPin, 
  FiUser, 
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Fulfillment Operations
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">Orders & Dispatch Control</h2>
          <p className="text-xs text-neutral-600 mt-1">Manage customer purchases, shipment tracking & delivery statuses.</p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center space-x-2 bg-white hover:bg-neutral-50 text-neutral-800 font-bold px-4 py-2.5 text-xs uppercase tracking-wider transition-colors border border-neutral-300 shadow-xs"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-7 h-7 text-neutral-900 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-subtle p-12 text-center shadow-xs">
          <FiShoppingBag className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-light text-neutral-900 font-editorial">No orders placed yet</h3>
          <p className="text-xs text-neutral-500 mt-1">Customer orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="bg-white border border-subtle overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-cream border-b border-subtle text-neutral-700 text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Order Reference</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Items Summary</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Total (₹)</th>
                  <th className="py-3.5 px-6">Order Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-neutral-900 block text-xs">
                        #{order.orderNumber || order._id.substring(18)}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-neutral-900">{order.user?.name || order.shippingAddress?.fullName || 'Customer'}</p>
                      <p className="text-[11px] text-neutral-500">{order.shippingAddress?.phone || order.user?.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1 max-w-[200px]">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="text-[11px] text-neutral-700 truncate">
                            <span className="font-bold text-neutral-900">{item.quantity}x</span> {item.name || item.product?.name} ({item.size})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-cream border border-subtle text-neutral-800 uppercase">
                        {order.paymentMethod || 'COD'}
                      </span>
                      <span className={`block text-[10px] font-bold mt-1 ${
                        order.isPaid ? 'text-emerald-800' : 'text-amber-800'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold font-editorial text-neutral-900 text-sm">
                      ₹{order.totalAmount}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                        order.orderStatus === 'Delivered' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : order.orderStatus === 'Shipped' || order.orderStatus === 'Out for Delivery'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenDetail(order)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-300 w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-cream border-b border-subtle flex items-center justify-between">
              <div>
                <h3 className="text-lg font-light text-neutral-900 font-editorial flex items-center">
                  <FiShoppingBag className="w-4 h-4 mr-2 text-neutral-700" />
                  Order #{selectedOrder.orderNumber || selectedOrder._id}
                </h3>
                <p className="text-[11px] text-neutral-500">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-neutral-500 hover:text-neutral-900"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-cream border border-subtle p-4">
                  <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center">
                    <FiUser className="w-3.5 h-3.5 mr-1.5 text-neutral-700" />
                    Customer Details
                  </h4>
                  <p className="font-bold text-neutral-900">{selectedOrder.user?.name || selectedOrder.shippingAddress?.fullName}</p>
                  <p className="text-neutral-600 mt-1">{selectedOrder.user?.email}</p>
                  <p className="text-neutral-600">{selectedOrder.shippingAddress?.phone}</p>
                </div>

                <div className="bg-cream border border-subtle p-4">
                  <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center">
                    <FiMapPin className="w-3.5 h-3.5 mr-1.5 text-neutral-700" />
                    Shipping Address
                  </h4>
                  <p className="text-neutral-700">
                    {selectedOrder.shippingAddress?.house || selectedOrder.shippingAddress?.addressLine1}
                    {(selectedOrder.shippingAddress?.street || selectedOrder.shippingAddress?.addressLine2) ? `, ${selectedOrder.shippingAddress?.street || selectedOrder.shippingAddress?.addressLine2}` : ''}
                  </p>
                  <p className="text-neutral-900 font-bold mt-1">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-cream border border-subtle p-4">
                <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Purchased Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-neutral-200 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.image || '/images/cleanser.svg'} 
                          alt={item.name}
                          className="w-10 h-10 object-contain bg-white p-1 border border-neutral-200"
                        />
                        <div>
                          <p className="font-bold text-neutral-900 text-xs">{item.name}</p>
                          <p className="text-[10px] text-neutral-500">Variant: {item.size || 'Default'} × {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-neutral-900 text-xs font-editorial">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-300 flex justify-between items-center font-bold text-sm">
                  <span className="text-neutral-700">Grand Total:</span>
                  <span className="text-neutral-900 font-editorial text-base">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Update Status Form */}
              <form onSubmit={handleUpdateStatus} className="bg-cream border border-subtle p-5 space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center">
                  <FiTruck className="w-4 h-4 mr-2 text-neutral-700" />
                  Update Order Pipeline & Courier AWB
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                      Fulfillment Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900 font-bold"
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
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                      Courier Partner
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900"
                      placeholder="e.g. Bluedart / Delhivery / Shiprocket"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                    AWB Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
                    placeholder="e.g. BD10982347923"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="px-6 py-2.5 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors shadow-xs disabled:opacity-50"
                  >
                    {updatingStatus ? 'Updating...' : 'Save Order Status & Send Update'}
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
