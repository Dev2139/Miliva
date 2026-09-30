import React, { useState, useEffect } from 'react';
import { FiEye, FiTruck, FiEdit } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import { orderService } from '../services/orderService';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', courier: 'Bluedart Express', trackingNumber: '', note: '' });

  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getUserOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setStatusForm({
      status: ord.orderStatus,
      courier: ord.tracking?.courier || 'Bluedart Express',
      trackingNumber: ord.tracking?.trackingNumber || '',
      note: ''
    });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await adminService.updateOrderStatus(selectedOrder._id, statusForm);
      showToast(`Order status updated to ${statusForm.status}`, 'success');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6">
        <div className="border-b border-neutral-300 pb-4">
          <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Order Operations</h1>
          <p className="text-xs text-neutral-500">Track, update delivery status & assign tracking numbers</p>
        </div>

        <div className="bg-white border border-neutral-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 text-white uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Order Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-neutral-50">
                  <td className="p-4 font-bold font-mono">#{o.orderNumber}</td>
                  <td className="p-4">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-4 font-medium">{o.shippingAddress?.fullName || 'Customer'}</td>
                  <td className="p-4 font-bold">₹{o.totalAmount}</td>
                  <td className="p-4 uppercase">{o.paymentMethod} ({o.isPaid ? 'Paid' : 'Pending'})</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 font-bold uppercase text-[10px] bg-neutral-100 border border-neutral-300">
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenStatusModal(o)}
                      className="px-3 py-1 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-black"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status Update Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleUpdateStatus} className="w-full max-w-md bg-white p-6 space-y-4 border border-neutral-300">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900">
                Update Status - Order #{selectedOrder.orderNumber}
              </h3>

              <div>
                <label className="text-xs font-semibold block mb-1">Select New Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={statusForm.courier}
                  onChange={(e) => setStatusForm({ ...statusForm, courier: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-neutral-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Tracking AWB Number</label>
                <input
                  type="text"
                  value={statusForm.trackingNumber}
                  onChange={(e) => setStatusForm({ ...statusForm, trackingNumber: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-neutral-300"
                  placeholder="e.g. BD98420194"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Update Note / Description</label>
                <input
                  type="text"
                  value={statusForm.note}
                  onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-neutral-300"
                  placeholder="e.g. Handed over to courier facility"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button type="button" onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-xs uppercase font-bold text-neutral-600">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider">Save Status</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrdersPage;
