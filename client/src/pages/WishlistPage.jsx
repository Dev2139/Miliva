import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/product/ProductGrid';

const WishlistPage = () => {
  const { wishlist, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <FiHeart className="w-16 h-16 text-neutral-300 mx-auto" />
        <h1 className="text-3xl font-light text-neutral-900 font-editorial">Your Wishlist is Empty</h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          Save your favorite formulations for later while you craft your ideal skincare routine.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest border border-neutral-900"
        >
          Explore Formulations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8">
      <div className="border-b border-subtle pb-4">
        <h1 className="text-3xl font-light text-neutral-900 font-editorial">
          Saved Wishlist <span className="text-sm text-neutral-500 font-normal">({wishlistCount} formulations)</span>
        </h1>
      </div>

      <ProductGrid products={wishlist} columns={4} />
    </div>
  );
};

export default WishlistPage;
