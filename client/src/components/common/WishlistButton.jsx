import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';

const WishlistButton = ({ product, className = "" }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product._id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      className={`p-2 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 text-neutral-700 hover:text-red-500 hover:bg-white transition-all shadow-xs ${className}`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      {active ? (
        <FaHeart className="w-4 h-4 text-red-500" />
      ) : (
        <FiHeart className="w-4 h-4" />
      )}
    </button>
  );
};

export default WishlistButton;
