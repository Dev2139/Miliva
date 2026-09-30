import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiLayers, FiBox, FiSliders, FiShoppingBag,
  FiUsers, FiStar, FiTag, FiBarChart2, FiImage, FiSettings,
  FiLogOut, FiArrowLeft, FiBell, FiSearch, FiUser
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const links = [
    { path: '/admin', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/admin/products', label: 'Products', icon: <FiPackage /> },
    { path: '/admin/categories', label: 'Categories', icon: <FiLayers /> },
    { path: '/admin/bundles', label: 'Bundles & Combos', icon: <FiBox /> },
    { path: '/admin/inventory', label: 'Inventory', icon: <FiSliders /> },
    { path: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
    { path: '/admin/customers', label: 'Customers', icon: <FiUsers /> },
    { path: '/admin/reviews', label: 'Reviews', icon: <FiStar /> },
    { path: '/admin/coupons', label: 'Coupons', icon: <FiTag /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
    { path: '/admin/banners', label: 'Banners / Homepage', icon: <FiImage /> },
    { path: '/admin/settings', label: 'Settings', icon: <FiSettings /> }
  ];

  // Breadcrumb generation
  const currentPath = location.pathname;
  const currentLink = links.find(l => l.path === currentPath) || { label: 'Admin Management' };

  return (
    <div className="flex h-screen bg-[#F7F7F7] text-neutral-900 overflow-hidden font-sans">
      {/* Standalone Admin Sidebar */}
      <aside className="w-64 bg-[#141414] text-white flex flex-col justify-between h-full border-r border-neutral-800 flex-shrink-0">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-widest text-white font-editorial">MILIVA</span>
              <span className="text-[9px] uppercase font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 border border-neutral-700">
                PORTAL
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold overflow-y-auto max-h-[calc(100vh-160px)]">
            {links.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm transition-colors ${
                    active
                      ? 'bg-white text-neutral-900 font-bold shadow-xs'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-neutral-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-sm w-full"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Storefront View</span>
          </Link>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-sm w-full"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area with Top Navigation Header */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-neutral-200 px-8 flex items-center justify-between flex-shrink-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400 font-medium">Admin</span>
            <span className="text-neutral-300">/</span>
            <span className="font-bold text-neutral-900 uppercase tracking-wider">{currentLink.label}</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-6 text-neutral-700">
            {/* Quick Search */}
            <div className="relative hidden md:block">
              <FiSearch className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, SKU, users..."
                className="pl-9 pr-4 py-1.5 text-xs bg-neutral-100 border border-neutral-300 rounded-sm w-64 focus:outline-none focus:bg-white"
              />
            </div>

            <button className="relative p-2 text-neutral-600 hover:text-neutral-900" aria-label="Notifications">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center font-editorial">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="hidden sm:block text-xs">
                <p className="font-bold text-neutral-900 leading-tight">{user?.name || 'Miliva Admin'}</p>
                <p className="text-[10px] text-neutral-500">Super Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
