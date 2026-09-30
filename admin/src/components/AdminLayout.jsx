import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiBox, 
  FiLayers, 
  FiShoppingBag, 
  FiUsers, 
  FiStar, 
  FiTag, 
  FiBarChart2, 
  FiImage, 
  FiSettings, 
  FiLogOut, 
  FiPackage,
  FiMenu,
  FiX,
  FiBell,
  FiUser
} from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminToast } from '../context/AdminToastContext';

export default function AdminLayout() {
  const { adminUser, logout } = useAdminAuth();
  const { showToast } = useAdminToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out of Admin Portal', 'info');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: FiGrid },
    { label: 'Products', path: '/products', icon: FiBox },
    { label: 'Categories', path: '/categories', icon: FiLayers },
    { label: 'Bundles & Combos', path: '/bundles', icon: FiPackage },
    { label: 'Inventory Management', path: '/inventory', icon: FiShoppingBag },
    { label: 'Orders Management', path: '/orders', icon: FiShoppingBag },
    { label: 'Customers', path: '/customers', icon: FiUsers },
    { label: 'Reviews', path: '/reviews', icon: FiStar },
    { label: 'Coupons & Discounts', path: '/coupons', icon: FiTag },
    { label: 'Analytics & Reports', path: '/analytics', icon: FiBarChart2 },
    { label: 'Banners & CMS', path: '/banners', icon: FiImage },
    { label: 'Store Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-800">
          <Link to="/" className="flex items-center space-x-2.5">
            <img
              src="https://res.cloudinary.com/urzka7oz/image/upload/v1790754694/Screenshot_2026-09-30_131941-removebg-preview.png"
              alt="Miliva Skincare"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <span className="text-[9px] text-emerald-400 font-bold tracking-wider uppercase border-l border-neutral-700 pl-2">
              SKINCARE ADMIN
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Management
          </div>
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-sm' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'}
                `}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </NavLink>
            );
          })}

          <div className="pt-4 px-3 py-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Marketing & Store
          </div>
          {navItems.slice(6).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-sm' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'}
                `}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        {/* Admin Footer User Info */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-white truncate">{adminUser?.name || 'Admin User'}</p>
                <p className="text-xs text-neutral-400 truncate">{adminUser?.email || 'admin@miliva.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-neutral-900/80 backdrop-blur border-b border-neutral-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-semibold text-neutral-200">
              MILIVA Administrative Operations
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live System Connected</span>
            </div>

            <button 
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 relative"
              title="System Alerts"
            >
              <FiBell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
