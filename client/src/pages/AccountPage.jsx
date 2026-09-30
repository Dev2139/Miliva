import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiMapPin, FiUser, FiHeart, FiLogOut, FiTruck, FiPlus, FiTrash2, FiEdit2, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import PriceDisplay from '../components/common/PriceDisplay';

const AccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const { user, logout, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form
  const [profName, setProfName] = useState(user?.name || '');
  const [profPhone, setProfPhone] = useState(user?.phone || '');
  const [profPass, setProfPass] = useState('');
  const [updatingProf, setUpdatingProf] = useState(false);

  // Address Modal/Form
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState(null);
  const [addrForm, setAddrForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    house: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    if (user) {
      orderService.getUserOrders().then(res => setOrders(res.orders || [])).catch(console.error).finally(() => setLoadingOrders(false));
      orderService.getAddresses().then(res => setAddresses(res.addresses || [])).catch(console.error);
    }
  }, [user]);

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProf(true);
      await updateProfile({ name: profName, phone: profPhone, password: profPass || undefined });
      setProfPass('');
    } catch (err) {
      // Toast handled
    } finally {
      setUpdatingProf(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddrId) {
        const res = await orderService.updateAddress(editingAddrId, addrForm);
        setAddresses(res.addresses || []);
        showToast('Address updated', 'success');
      } else {
        const res = await orderService.addAddress(addrForm);
        setAddresses(res.addresses || []);
        showToast('Address added', 'success');
      }
      setShowAddrModal(false);
      setEditingAddrId(null);
    } catch (err) {
      showToast('Failed to save address', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this saved address?')) return;
    try {
      const res = await orderService.deleteAddress(id);
      setAddresses(res.addresses || []);
      showToast('Address deleted', 'info');
    } catch (err) {
      showToast('Failed to delete address', 'error');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await orderService.cancelOrder(orderId);
      setOrders(prev => prev.map(o => o._id === orderId ? res.order : o));
      showToast('Order cancelled', 'info');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-light text-neutral-900 font-editorial">Please Sign In</h2>
        <Link to="/login" className="inline-block px-6 py-3 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-subtle pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-neutral-900 text-white font-bold text-lg flex items-center justify-center font-editorial">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 font-editorial">{user.name}</h1>
            <p className="text-xs text-neutral-500">{user.email} &bull; Member since {new Date(user.createdAt || Date.now()).getFullYear()}</p>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100 self-start sm:self-auto"
        >
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Tabs Column */}
        <aside className="lg:col-span-3 space-y-1">
          <button
            onClick={() => setTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase font-bold tracking-wider text-left border-l-2 transition-all ${
              activeTab === 'overview' ? 'border-neutral-900 bg-cream text-neutral-900' : 'border-transparent text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <FiUser className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase font-bold tracking-wider text-left border-l-2 transition-all ${
              activeTab === 'orders' ? 'border-neutral-900 bg-cream text-neutral-900' : 'border-transparent text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <FiPackage className="w-4 h-4" /> My Orders ({orders.length})
          </button>
          <button
            onClick={() => setTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase font-bold tracking-wider text-left border-l-2 transition-all ${
              activeTab === 'addresses' ? 'border-neutral-900 bg-cream text-neutral-900' : 'border-transparent text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <FiMapPin className="w-4 h-4" /> Saved Addresses ({addresses.length})
          </button>
          <button
            onClick={() => setTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase font-bold tracking-wider text-left border-l-2 transition-all ${
              activeTab === 'profile' ? 'border-neutral-900 bg-cream text-neutral-900' : 'border-transparent text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <FiUser className="w-4 h-4" /> Profile Settings
          </button>
        </aside>

        {/* Tab Content Column */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-cream border border-subtle">
                  <p className="text-3xl font-bold font-editorial text-neutral-900">{orders.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mt-1">Total Orders</p>
                </div>
                <div className="p-6 bg-cream border border-subtle">
                  <p className="text-3xl font-bold font-editorial text-neutral-900">{addresses.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mt-1">Saved Addresses</p>
                </div>
                <div className="p-6 bg-cream border border-subtle">
                  <p className="text-3xl font-bold font-editorial text-neutral-900">₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString('en-IN')}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mt-1">Total Spent</p>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="p-6 bg-white border border-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-subtle pb-3">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-900">Recent Order</h3>
                  <button onClick={() => setTab('orders')} className="text-xs font-bold text-neutral-900 underline">View All Orders</button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-neutral-500">You have no previous orders.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-neutral-900">#{orders[0].orderNumber}</span>
                      <span className="text-neutral-500">{new Date(orders[0].createdAt).toLocaleDateString('en-IN')}</span>
                      <span className="font-bold text-neutral-900">₹{orders[0].totalAmount}</span>
                      <Link to={`/orders/${orders[0]._id}/track`} className="text-xs font-bold text-neutral-900 underline flex items-center gap-1">
                        <FiTruck /> Track
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS LIST */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-neutral-900 font-editorial uppercase tracking-wider">Order History</h3>

              {orders.length === 0 ? (
                <div className="p-12 text-center bg-cream border border-subtle space-y-3">
                  <FiPackage className="w-10 h-10 text-neutral-400 mx-auto" />
                  <p className="text-xs text-neutral-600 font-medium">No order history available.</p>
                  <Link to="/shop" className="inline-block px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase font-bold">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord._id} className="p-6 bg-white border border-subtle space-y-4 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-subtle pb-4 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Order ID</span>
                          <span className="font-bold text-neutral-900 font-mono">#{ord.orderNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Placed On</span>
                          <span className="text-neutral-700">{new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total</span>
                          <span className="font-bold text-neutral-900">₹{ord.totalAmount}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">Status</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase">{ord.orderStatus}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-subtle">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt="" className="w-10 h-10 object-cover border border-subtle" />
                              <span className="font-semibold text-neutral-900">{item.name} ({item.size}) x {item.quantity}</span>
                            </div>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-subtle flex items-center justify-between">
                        <Link
                          to={`/orders/${ord._id}/track`}
                          className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider flex items-center gap-1.5"
                        >
                          <FiTruck /> Track Order & Timeline
                        </Link>

                        {['Pending', 'Confirmed', 'Processing'].includes(ord.orderStatus) && (
                          <button
                            onClick={() => handleCancelOrder(ord._id)}
                            className="text-xs text-red-600 hover:text-red-800 font-bold uppercase tracking-wider underline"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-subtle pb-4">
                <h3 className="text-lg font-bold text-neutral-900 font-editorial uppercase tracking-wider">Delivery Addresses</h3>
                <button
                  onClick={() => {
                    setEditingAddrId(null);
                    setAddrForm({ fullName: user.name, phone: user.phone || '', house: '', street: '', area: '', city: '', state: '', pincode: '', isDefault: false });
                    setShowAddrModal(true);
                  }}
                  className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider flex items-center gap-1"
                >
                  <FiPlus /> Add New Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div key={a._id} className="p-5 bg-white border border-subtle space-y-2 relative">
                    {a.isDefault && (
                      <span className="text-[10px] uppercase font-bold bg-neutral-900 text-white px-2 py-0.5 inline-block mb-1">Default Address</span>
                    )}
                    <h4 className="font-bold text-sm text-neutral-900">{a.fullName}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">{a.house}, {a.street}, {a.city}, {a.state} - <strong>{a.pincode}</strong></p>
                    <p className="text-xs text-neutral-500 font-mono">Phone: {a.phone}</p>

                    <div className="pt-3 border-t border-subtle flex gap-3 text-xs">
                      <button
                        onClick={() => {
                          setEditingAddrId(a._id);
                          setAddrForm(a);
                          setShowAddrModal(true);
                        }}
                        className="text-neutral-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button onClick={() => handleDeleteAddress(a._id)} className="text-red-600 font-bold hover:underline flex items-center gap-1">
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="p-8 bg-cream border border-subtle space-y-6 max-w-xl">
              <h3 className="text-lg font-bold text-neutral-900 font-editorial uppercase tracking-wider">Edit Account Profile</h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">New Password (Leave blank to keep current)</label>
                  <input
                    type="password"
                    value={profPass}
                    onChange={(e) => setProfPass(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingProf}
                  className="px-6 py-3 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider"
                >
                  {updatingProf ? 'Saving...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Address Form Modal */}
      {showAddrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveAddress} className="w-full max-w-lg bg-white p-6 space-y-4 border border-subtle shadow-2xl">
            <h4 className="text-base font-bold uppercase tracking-wider text-neutral-900">{editingAddrId ? 'Edit Address' : 'Add New Address'}</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Full Name</label>
                <input type="text" value={addrForm.fullName} onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Phone</label>
                <input type="text" value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">House / Flat No.</label>
              <input type="text" value={addrForm.house} onChange={(e) => setAddrForm({ ...addrForm, house: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Street Address</label>
              <input type="text" value={addrForm.street} onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">City</label>
                <input type="text" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">State</label>
                <input type="text" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Pincode</label>
                <input type="text" maxLength={6} value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="chkDef" checked={addrForm.isDefault} onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })} />
              <label htmlFor="chkDef" className="text-xs text-neutral-700">Set as default shipping address</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-subtle">
              <button type="button" onClick={() => setShowAddrModal(false)} className="px-4 py-2 text-xs uppercase font-semibold text-neutral-600">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider">Save Address</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
