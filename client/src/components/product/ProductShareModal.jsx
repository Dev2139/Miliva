import React, { useState } from 'react';
import { 
  FiX, 
  FiShare2, 
  FiCopy, 
  FiCheck, 
  FiSend, 
  FiMail, 
  FiMessageSquare,
  FiExternalLink
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaTelegramPlane, FaPinterestP } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';

const ProductShareModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !product) return null;

  const productUrl = window.location.origin + `/product/${product.slug}`;
  const productImage = product.images && product.images[0] 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop';
  
  const formattedPrice = `₹${product.price}`;
  const discountText = product.compareAtPrice && product.compareAtPrice > product.price
    ? `(${Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF)`
    : '';

  // Amazon style formatted text message
  const shareMessageText = `🌿 Check out *${product.name}* on MILIVA Skincare!
  
💰 Price: ${formattedPrice} ${discountText}
✨ ${product.shortDescription || 'Dermatologically tested luxury formulation.'}

📷 Product Image: ${productImage}
👇 View & Order directly here:
${productUrl}`;

  // Direct WhatsApp Share link
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessageText)}`;

  // Facebook Share link
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;

  // Twitter/X Share link
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} on MILIVA Skincare!`)}&url=${encodeURIComponent(productUrl)}`;

  // Telegram Share link
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`${product.name} - ${formattedPrice}`)}`;

  // Email Share link
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Check out ${product.name} on MILIVA`)}&body=${encodeURIComponent(shareMessageText)}`;

  // Pinterest Share link
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&media=${encodeURIComponent(productImage)}&description=${encodeURIComponent(product.name)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      showToast('Product link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | MILIVA Skincare`,
          text: `Check out ${product.name} on MILIVA Skincare! Price: ${formattedPrice}`,
          url: productUrl
        });
        showToast('Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          showToast('Could not open share menu', 'error');
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-neutral-300 w-full max-w-lg shadow-2xl relative overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-subtle flex items-center justify-between bg-cream/70">
          <div className="flex items-center gap-2">
            <FiShare2 className="w-5 h-5 text-neutral-900" />
            <h3 className="font-editorial text-lg font-bold text-neutral-900 tracking-wide">
              Share Formulation
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Amazon-Style Rich Product Card Preview */}
          <div className="p-4 bg-[#FBF9F5] border border-neutral-200 flex gap-4 items-center">
            <div className="w-20 h-20 bg-white border border-subtle flex-shrink-0 relative overflow-hidden">
              <img 
                src={productImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 bg-neutral-900/80 text-white text-[9px] font-bold text-center py-0.5 uppercase">
                MILIVA
              </span>
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 inline-block">
                Direct Product Link & Image
              </span>
              <h4 className="text-sm font-semibold text-neutral-900 truncate">
                {product.name}
              </h4>
              <p className="text-xs text-neutral-500 line-clamp-1">
                {product.shortDescription || product.category?.name || 'Luxury Skincare Formulation'}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 pt-0.5">
                <span>{formattedPrice}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-neutral-400 line-through text-[11px]">
                    ₹{product.compareAtPrice}
                  </span>
                )}
                {discountText && (
                  <span className="text-emerald-700 text-[10px]">
                    {discountText}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Featured Primary WhatsApp Share Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md group"
          >
            <FaWhatsapp className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Share directly on WhatsApp (With Image & Link)</span>
          </a>

          {/* Mobile Native Share Button */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <FiShare2 className="w-4 h-4" />
              <span>Share via Device Share Sheet</span>
            </button>
          )}

          {/* Social Share Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              Share on Social Networks:
            </label>
            <div className="grid grid-cols-5 gap-2">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-[#1877F2] text-white flex flex-col items-center justify-center rounded-none hover:opacity-90 text-xs font-semibold gap-1"
                title="Share on Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
                <span className="text-[10px]">FB</span>
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-black text-white flex flex-col items-center justify-center rounded-none hover:opacity-90 text-xs font-semibold gap-1"
                title="Share on X / Twitter"
              >
                <FaTwitter className="w-4 h-4" />
                <span className="text-[10px]">X</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-[#229ED9] text-white flex flex-col items-center justify-center rounded-none hover:opacity-90 text-xs font-semibold gap-1"
                title="Share on Telegram"
              >
                <FaTelegramPlane className="w-4 h-4" />
                <span className="text-[10px]">Telegram</span>
              </a>

              <a
                href={pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-[#BD081C] text-white flex flex-col items-center justify-center rounded-none hover:opacity-90 text-xs font-semibold gap-1"
                title="Share on Pinterest"
              >
                <FaPinterestP className="w-4 h-4" />
                <span className="text-[10px]">Pinterest</span>
              </a>

              <a
                href={emailUrl}
                className="py-2.5 bg-neutral-700 text-white flex flex-col items-center justify-center rounded-none hover:opacity-90 text-xs font-semibold gap-1"
                title="Share via Email"
              >
                <FiMail className="w-4 h-4" />
                <span className="text-[10px]">Email</span>
              </a>
            </div>
          </div>

          {/* Copy Direct Product Link Input */}
          <div className="space-y-2 pt-2 border-t border-subtle">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              Or Copy Direct Product Link:
            </label>
            <div className="flex border border-neutral-300 bg-[#FBF9F5]">
              <input
                type="text"
                readOnly
                value={productUrl}
                className="flex-1 px-3 py-2 text-xs font-mono text-neutral-700 bg-transparent focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <FiCheck className="w-4 h-4 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductShareModal;
