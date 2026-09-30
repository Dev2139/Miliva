import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import PriceDisplay from '../common/PriceDisplay';
import RatingStars from '../common/RatingStars';
import WishlistButton from '../common/WishlistButton';
import Badge from '../common/Badge';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white border border-subtle hover:border-neutral-400 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#F7F3ED]">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop'}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>

          {/* Badges Top Left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.isBestSeller && <Badge type="bestseller" />}
            {product.isNew && <Badge type="new" />}
          </div>

          {/* Wishlist Button Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton product={product} />
          </div>

          {/* Quick Add Overlay Button on Desktop */}
          <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className="w-full py-2.5 bg-neutral-900/90 backdrop-blur-xs text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors disabled:bg-neutral-400 flex items-center justify-center gap-2"
            >
              <FiShoppingBag className="w-3.5 h-3.5" />
              {isOutOfStock ? 'Out of Stock' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2">
          {/* Key ingredient or size badge */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium">
            <span>{product.size || '30 ml'}</span>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={12} />
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-neutral-900 group-hover:underline line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>
      </div>

      {/* Footer Price & Mobile Add Button */}
      <div className="p-4 pt-0 border-t border-subtle/50 flex items-center justify-between mt-2">
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          discount={product.discount}
          size="sm"
        />

        {/* Mobile Quick Add Button */}
        <button
          onClick={() => addToCart(product, 1)}
          disabled={isOutOfStock}
          className="md:hidden p-2 bg-neutral-900 text-white rounded-none disabled:bg-neutral-300"
          aria-label="Add to cart"
        >
          <FiShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
