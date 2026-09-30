import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiBarChart2, FiArrowLeft, FiSliders } from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();

  const links = [
    { path: '/admin', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/admin/products', label: 'Products Catalog', icon: <FiPackage /> },
    { path: '/admin/orders', label: 'Order Management', icon: <FiShoppingBag /> },
    { path: '/admin/customers', label: 'Customers', icon: <FiUsers /> },
    { path: '/admin/coupons', label: 'Coupons & Promos', icon: <FiTag /> },
    { path: '/admin/inventory', label: 'Inventory & Stock', icon: <FiSliders /> }
  ];

  return (
    <aside className="w-64 bg-[#121212] text-white flex flex-col justify-between h-screen sticky top-0 border-r border-neutral-800">
      <div>
        {/* Brand logo header */}
        <div className="p-6 border-b border-neutral-800">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-widest font-editorial text-white">MILIVA</span>
            <span className="text-[9px] uppercase font-bold bg-neutral-800 px-2 py-0.5 text-neutral-300 border border-neutral-700">ADMIN SAAS</span>
          </Link>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-1.5 text-xs font-semibold">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors ${
                  active ? 'bg-white text-neutral-900 font-bold' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to store */}
      <div className="p-4 border-t border-neutral-800">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white px-4 py-2.5 bg-neutral-900 border border-neutral-800 w-full"
        >
          <FiArrowLeft /> Back to Customer Store
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
