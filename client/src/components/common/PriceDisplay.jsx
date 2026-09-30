import React from 'react';

const PriceDisplay = ({ price, compareAtPrice, discount, size = "md", className = "" }) => {
  const isDiscounted = compareAtPrice && compareAtPrice > price;

  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base';
  const compareSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className={`flex items-baseline gap-2 font-medium text-neutral-900 ${className}`}>
      <span className={`${textSize} font-semibold`}>₹{price.toLocaleString('en-IN')}</span>
      {isDiscounted && (
        <span className={`${compareSize} text-neutral-400 line-through font-normal`}>
          ₹{compareAtPrice.toLocaleString('en-IN')}
        </span>
      )}
      {isDiscounted && discount > 0 && (
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
          Save {discount}%
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
