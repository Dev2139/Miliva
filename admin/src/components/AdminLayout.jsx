import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  FiSearch,
  FiExternalLink
} from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminToast } from '../context/AdminToastContext';

export default function AdminLayout() {
  const { adminUser, logout } = useAdminAuth();
  const { showToast } = useAdminToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

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
    { label: 'Inventory', path: '/inventory', icon: FiShoppingBag },
    { label: 'Orders Management', path: '/orders', icon: FiShoppingBag },
    { label: 'Customers', path: '/customers', icon: FiUsers },
    { label: 'Reviews', path: '/reviews', icon: FiStar },
    { label: 'Coupons & Discounts', path: '/coupons', icon: FiTag },
    { label: 'Analytics & Reports', path: '/analytics', icon: FiBarChart2 },
    { label: 'Banners & CMS', path: '/banners', icon: FiImage },
    { label: 'Store Settings', path: '/settings', icon: FiSettings },
  ];

  // Breadcrumb mapping
  const currentItem = navItems.find(item => item.path === location.pathname) || { label: 'Admin Portal' };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-neutral-900 flex font-sans overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Standalone Luxury Dark Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#141414] text-white border-r border-neutral-800 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-neutral-800">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-xl font-bold tracking-widest text-white font-editorial">MILIVA</span>
              <span className="text-[9px] uppercase font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 border border-neutral-700 tracking-widest">
                ADMIN
              </span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)] text-xs font-semibold">
            <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Store Operations
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
                    flex items-center px-3.5 py-2.5 rounded-sm transition-all text-xs font-semibold gap-3
                    ${isActive 
                      ? 'bg-white text-neutral-900 font-bold shadow-xs' 
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Marketing & Config
            </div>
            {navItems.slice(6).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center px-3.5 py-2.5 rounded-sm transition-all text-xs font-semibold gap-3
                    ${isActive 
                      ? 'bg-white text-neutral-900 font-bold shadow-xs' 
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info & Shortcuts */}
        <div className="p-3 border-t border-neutral-800 space-y-2 bg-[#101010]">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs font-semibold text-neutral-300 hover:text-white px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-sm w-full transition-colors"
          >
            <span className="flex items-center gap-2">
              <FiExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              <span>Storefront View</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-500">Live</span>
          </a>

          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-neutral-800 text-white font-bold text-xs flex items-center justify-center font-editorial border border-neutral-700">
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate leading-tight">{adminUser?.name || 'Administrator'}</p>
                <p className="text-[10px] text-neutral-400 truncate">{adminUser?.email || 'admin@miliva.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 h-screen overflow-hidden">
        {/* Top Header Navigation */}
        <header className="h-16 bg-white border-b border-subtle px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded text-neutral-700 hover:bg-neutral-100"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400 font-medium">Admin</span>
              <span className="text-neutral-300">/</span>
              <span className="font-bold text-neutral-900 uppercase tracking-wider">{currentItem.label}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Search */}
            <div className="relative hidden md:block">
              <FiSearch className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Quick search SKU, orders..."
                className="pl-8 pr-3 py-1.5 text-xs bg-neutral-100 border border-neutral-300 rounded-sm w-56 focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors"
              />
            </div>

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live System</span>
            </div>

            <button 
              className="p-2 rounded text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 relative"
              title="System Alerts"
            >
              <FiBell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
            </button>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#F8F8F8]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
