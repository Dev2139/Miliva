import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiAward } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCreditCard } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast('Thank you for subscribing to Miliva updates!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#171717] text-white pt-16 pb-12 border-t border-neutral-800">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 border-b border-neutral-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <FiShield className="w-6 h-6 text-neutral-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider mb-1">Dermatologically Tested</h4>
              <p className="text-xs text-neutral-400">100% science-backed formulas</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <FiTruck className="w-6 h-6 text-neutral-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider mb-1">Free Express Shipping</h4>
              <p className="text-xs text-neutral-400">On all orders above ₹999</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <FiRefreshCw className="w-6 h-6 text-neutral-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider mb-1">14-Day Easy Returns</h4>
              <p className="text-xs text-neutral-400">Hassle-free return policy</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <FiAward className="w-6 h-6 text-neutral-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider mb-1">100% Authentic</h4>
              <p className="text-xs text-neutral-400">Directly from our labs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand & Newsletter Column */}
        <div className="md:col-span-2 space-y-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/urzka7oz/image/upload/v1790754694/Screenshot_2026-09-30_131941-removebg-preview.png"
              alt="Miliva Skincare"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold border-l border-neutral-700 pl-2">
              SKINCARE
            </span>
          </Link>
          <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
            Effective formulations built around honest ingredients. Transparent, science-led D2C skincare designed to perform.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2 max-w-sm">
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300 block">
              Subscribe to Formulation Releases
            </label>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-neutral-900 border border-neutral-700 px-3 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-neutral-900 px-4 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center"
              >
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Shop Column */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold mb-4 text-neutral-200">Shop</h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link to="/shop" className="hover:text-white transition-colors">All Formulations</Link></li>
            <li><Link to="/shop?isBestSeller=true" className="hover:text-white transition-colors">Best Sellers</Link></li>
            <li><Link to="/shop?isNew=true" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/shop?category=face-serums" className="hover:text-white transition-colors">Face Serums</Link></li>
            <li><Link to="/shop?category=moisturizers" className="hover:text-white transition-colors">Moisturizers</Link></li>
            <li><Link to="/shop?category=sunscreens" className="hover:text-white transition-colors">Sunscreens</Link></li>
          </ul>
        </div>

        {/* Help Column */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold mb-4 text-neutral-200">Help</h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link to="/account?tab=orders" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link to="/about#faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            <li><Link to="/about#shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
            <li><Link to="/about#returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
            <li><Link to="/about#contact" className="hover:text-white transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold mb-4 text-neutral-200">Company</h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link to="/about" className="hover:text-white transition-colors">About Miliva</Link></li>
            <li><Link to="/ingredients" className="hover:text-white transition-colors">Ingredients Library</Link></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Sustainability</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} MILIVA Skincare Inc. All rights reserved.</p>

        <div className="flex items-center gap-4 text-neutral-400">
          <span className="text-[10px] uppercase tracking-wider">Accepted Payments:</span>
          <span className="flex items-center gap-2 text-base">
            <FaCcVisa title="Visa" />
            <FaCcMastercard title="Mastercard" />
            <FaCreditCard title="Razorpay / UPI / NetBanking" />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
