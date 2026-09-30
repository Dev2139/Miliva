import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiShoppingBag, FiHeart, FiUser, FiSearch, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const MobileDrawer = ({ isOpen, onClose, onOpenSearch }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-fade-in">
      <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-subtle">
            <Link to="/" onClick={onClose} className="text-xl font-bold tracking-widest text-neutral-900 font-editorial">
              MILIVA
            </Link>
            <button onClick={onClose} className="p-2 text-neutral-500 hover:text-neutral-900" aria-label="Close menu">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search trigger */}
          <div className="p-4 border-b border-subtle">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-neutral-100 border border-neutral-200 text-neutral-500 text-sm"
            >
              <FiSearch className="w-4 h-4" />
              <span>Search products or ingredients...</span>
            </button>
          </div>

          {/* Nav links */}
          <div className="py-2 divide-y divide-subtle">
            <button onClick={() => handleNav('/product/miliva-face-cleanser')} className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-neutral-900 hover:bg-neutral-50">
              <span>MILIVA Face Cleanser</span>
              <FiChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button onClick={() => handleNav('/product/miliva-face-serum')} className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-neutral-900 hover:bg-neutral-50">
              <span>MILIVA Face Serum</span>
              <FiChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button onClick={() => handleNav('/product/miliva-acne-care-combo')} className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-neutral-900 bg-cream">
              <span>MILIVA Acne Care Combo</span>
              <FiChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button onClick={() => handleNav('/shop')} className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-neutral-900 hover:bg-neutral-50">
              <span>Shop All Formulations</span>
              <FiChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button onClick={() => handleNav('/ingredients')} className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-neutral-900 hover:bg-neutral-50">
              <span>Ingredients Library</span>
              <FiChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button onClick={() => handleNav('/about')} className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-neutral-900 hover:bg-neutral-50">
              <span>About Miliva</span>
              <FiChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* User Account / Bottom Actions */}
        <div className="p-6 bg-cream border-t border-subtle">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm font-editorial">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleNav(user.role === 'admin' ? '/admin' : '/account')}
                  className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold bg-neutral-900 text-white border border-neutral-900"
                >
                  {user.role === 'admin' ? 'Admin Portal' : 'Account'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold bg-white text-neutral-900 border border-neutral-300"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => handleNav('/login')}
                className="w-full py-3 text-xs uppercase tracking-widest font-bold bg-neutral-900 text-white text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('/register')}
                className="w-full py-3 text-xs uppercase tracking-widest font-bold bg-white border border-neutral-300 text-neutral-900 text-center"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
};

export default MobileDrawer;
