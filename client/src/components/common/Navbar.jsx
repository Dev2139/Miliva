import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import AnnouncementBar from './AnnouncementBar';
import MobileDrawer from './MobileDrawer';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user, isAdmin } = useAuth();
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-300 border-b border-subtle ${
          isScrolled ? 'shadow-xs py-3' : 'py-4 md:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-neutral-800 hover:text-neutral-900"
            aria-label="Open navigation menu"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-bold tracking-widest text-neutral-900 font-editorial">
              MILIVA
            </span>
            <span className="hidden sm:inline-block text-[9px] uppercase tracking-widest text-neutral-400 font-semibold border-l border-neutral-300 pl-2">
              SKINCARE
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-neutral-700">
            <Link
              to="/product/miliva-face-cleanser"
              className="hover:text-neutral-900 transition-colors py-1"
            >
              Face Cleanser
            </Link>
            <Link
              to="/product/miliva-face-serum"
              className="hover:text-neutral-900 transition-colors py-1"
            >
              Face Serum
            </Link>
            <Link
              to="/product/miliva-acne-care-combo"
              className="hover:text-neutral-900 transition-colors py-1 font-bold text-neutral-900 bg-cream px-2 py-1 border border-subtle"
            >
              Acne Care Combo
            </Link>
            <Link
              to="/shop"
              className={`hover:text-neutral-900 transition-colors py-1 ${
                location.pathname === '/shop' ? 'text-neutral-900 border-b-2 border-neutral-900' : ''
              }`}
            >
              Shop All
            </Link>
            <Link
              to="/ingredients"
              className="hover:text-neutral-900 transition-colors py-1"
            >
              Ingredients
            </Link>
            <Link
              to="/about"
              className="hover:text-neutral-900 transition-colors py-1"
            >
              About
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4 md:gap-6 text-neutral-800">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 hover:text-neutral-900 transition-colors"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Account Link */}
            <Link
              to={user ? (isAdmin ? '/admin' : '/account') : '/login'}
              className="p-1.5 hover:text-neutral-900 transition-colors relative"
              aria-label="User Account"
            >
              <FiUser className="w-5 h-5" />
              {user && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-600"></span>
              )}
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="hidden sm:flex items-center p-1.5 hover:text-neutral-900 transition-colors relative"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="p-1.5 hover:text-neutral-900 transition-colors relative flex items-center gap-1.5"
              aria-label="Shopping Cart"
            >
              <FiShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
