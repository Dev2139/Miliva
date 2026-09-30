import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiShare2, FiCheck, FiShield, FiTruck, FiChevronDown, FiChevronUp, FiBox } from 'react-icons/fi';
import ProductGallery from '../components/product/ProductGallery';
import PriceDisplay from '../components/common/PriceDisplay';
import RatingStars from '../components/common/RatingStars';
import QuantitySelector from '../components/common/QuantitySelector';
import PincodeChecker from '../components/product/PincodeChecker';
import ProductReviewsSection from '../components/product/ProductReviewsSection';
import ProductGrid from '../components/product/ProductGrid';
import ProductShareModal from '../components/product/ProductShareModal';
import { setProductMetaTags } from '../utils/updateMetaTags';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Accordion toggle states
  const [openAccordion, setOpenAccordion] = useState('ingredients');

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const res = await productService.getProductBySlug(slug);
        if (res.product) {
          setProduct(res.product);
          setProductMetaTags(res.product);
          // Set initial default variant
          if (res.product.variants && res.product.variants.length > 0) {
            setSelectedVariant(res.product.variants[0]);
          }
          setRelatedProducts(res.relatedProducts || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-sm font-medium text-neutral-500 animate-pulse">Loading formulation details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-light text-neutral-900 font-editorial">Formulation Not Found</h2>
        <Link to="/shop" className="inline-block px-6 py-3 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Active Variant attributes
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentCompareAtPrice = selectedVariant ? selectedVariant.compareAtPrice : product.compareAtPrice;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const currentSize = selectedVariant ? selectedVariant.size : product.size;

  const discountAmount = currentCompareAtPrice && currentCompareAtPrice > currentPrice ? currentCompareAtPrice - currentPrice : 0;
  const discountPercent = currentCompareAtPrice && currentCompareAtPrice > currentPrice
    ? Math.round(((currentCompareAtPrice - currentPrice) / currentCompareAtPrice) * 100)
    : 0;

  const isOutOfStock = currentStock <= 0;
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        price: currentPrice,
        compareAtPrice: currentCompareAtPrice,
        sku: currentSku
      },
      quantity,
      currentSize
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16">
      {/* Top Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} videoUrl={product.videoUrl} name={product.name} />
        </div>

        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-subtle pb-4">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
              <span className="uppercase tracking-widest text-[10px] font-bold text-neutral-800 bg-cream px-2 py-0.5 border border-subtle">
                {product.category?.name || 'Skincare'}
              </span>
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={14} />
            </div>

            <h1 className="text-2xl md:text-3xl font-light text-neutral-900 font-editorial leading-tight">
              {product.name}
            </h1>

            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              {product.shortDescription}
            </p>

            {/* COMBO SPECIFIC HIGHLIGHT */}
            {product.isBundle && (
              <div className="p-4 bg-cream border border-subtle space-y-2 my-2">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <FiBox className="w-4 h-4 text-neutral-800" /> Included Products in this Combo:
                </p>
                <ul className="text-xs text-neutral-700 space-y-1 font-medium pl-6 list-disc">
                  <li>1 × MILIVA Face Cleanser</li>
                  <li>1 × MILIVA Face Serum</li>
                </ul>
              </div>
            )}

            {/* Price Box */}
            <div className="pt-2">
              <PriceDisplay price={currentPrice} compareAtPrice={currentCompareAtPrice} discount={discountPercent} size="lg" />

              {/* Combo Savings Box */}
              {product.isBundle && discountAmount > 0 && (
                <div className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 border border-emerald-200 flex justify-between items-center">
                  <span>Individual Products Total: <strong className="line-through">₹{currentCompareAtPrice}</strong></span>
                  <span>You Save: <strong className="text-sm">₹{discountAmount}</strong> ({discountPercent}% OFF)</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 font-mono">
                <span>SKU: {currentSku}</span>
                <span className={isOutOfStock ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                  {isOutOfStock ? 'Out of Stock' : `In Stock (${currentStock} available)`}
                </span>
              </div>
            </div>
          </div>

          {/* Size / Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
                Select {product.isBundle ? 'Bundle Configuration' : 'Size / Volume'}:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => {
                  const isSelected = selectedVariant?._id === v._id || selectedVariant?.size === v.size;
                  return (
                    <button
                      key={v._id || i}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900'
                      }`}
                    >
                      {v.size} — ₹{v.price}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrease={() => setQuantity(quantity + 1)}
                max={currentStock}
              />

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors disabled:bg-neutral-400 flex items-center justify-center gap-2"
              >
                <FiShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 border transition-all ${
                  inWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                }`}
                aria-label="Wishlist"
                title="Add to Wishlist"
              >
                <FiHeart className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-3.5 border border-neutral-300 text-neutral-800 hover:border-neutral-900 hover:bg-cream transition-all flex items-center justify-center"
                aria-label="Share product"
                title="Share product directly with image and link"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3.5 bg-cream text-neutral-900 border border-neutral-900 text-xs uppercase font-bold tracking-widest hover:bg-neutral-200 transition-colors"
            >
              Buy Now &bull; Instant Checkout
            </button>
          </div>

          {/* Pincode Checker */}
          <PincodeChecker />

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-3 text-xs text-neutral-600 pt-2 border-t border-subtle">
            <div><strong className="text-neutral-900">Texture:</strong> {product.texture || 'Lightweight Fluid'}</div>
            <div><strong className="text-neutral-900">Fragrance:</strong> {product.fragrance || '100% Fragrance-Free'}</div>
            <div><strong className="text-neutral-900">Suitable For:</strong> {product.suitableFor}</div>
            <div><strong className="text-neutral-900">Testing:</strong> Dermatologically Tested</div>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="max-w-4xl mx-auto space-y-4 pt-10 border-t border-subtle">
        <h3 className="text-xl font-light text-neutral-900 font-editorial mb-6">Formulation Dossier</h3>

        {/* Benefits & Key Ingredients */}
        <div className="border border-subtle bg-white">
          <button
            onClick={() => setOpenAccordion(openAccordion === 'ingredients' ? '' : 'ingredients')}
            className="w-full p-5 text-left flex items-center justify-between text-sm font-bold uppercase tracking-wider text-neutral-900 bg-cream/50"
          >
            <span>Key Active Ingredients &amp; Benefits</span>
            {openAccordion === 'ingredients' ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {openAccordion === 'ingredients' && (
            <div className="p-6 space-y-6 text-xs text-neutral-700 leading-relaxed border-t border-subtle">
              {/* Key Benefits */}
              <div>
                <h5 className="font-bold text-neutral-900 uppercase tracking-wider mb-2">Key Benefits:</h5>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.benefits && product.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Ingredients cards */}
              <div className="pt-4 border-t border-subtle">
                <h5 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">Active Ingredients:</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {product.keyIngredients && product.keyIngredients.map((ki, idx) => (
                    <div key={idx} className="p-4 bg-cream border border-subtle">
                      <div className="flex items-center justify-between font-bold text-neutral-900 mb-1">
                        <span>{ki.name}</span>
                        {ki.percentage && <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">{ki.percentage}</span>}
                      </div>
                      <p className="text-neutral-500 font-light text-[11px]">{ki.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* How to use */}
        <div className="border border-subtle bg-white">
          <button
            onClick={() => setOpenAccordion(openAccordion === 'howToUse' ? '' : 'howToUse')}
            className="w-full p-5 text-left flex items-center justify-between text-sm font-bold uppercase tracking-wider text-neutral-900 bg-cream/50"
          >
            <span>How To Use &amp; Application Guide</span>
            {openAccordion === 'howToUse' ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {openAccordion === 'howToUse' && (
            <div className="p-6 text-xs text-neutral-700 space-y-3 leading-relaxed border-t border-subtle">
              <p className="text-sm font-light text-neutral-800">{product.howToUse}</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ProductReviewsSection productId={product._id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-subtle">
          <h3 className="text-2xl font-light text-neutral-900 font-editorial">
            Complementary <span className="font-semibold">Formulations</span>
          </h3>
          <ProductGrid products={relatedProducts} columns={3} />
        </div>
      )}

      {/* Share Product Modal */}
      <ProductShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetailPage;
