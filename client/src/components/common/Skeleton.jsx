import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border border-subtle p-3 animate-shimmer">
      <div className="w-full aspect-square bg-neutral-100 mb-4"></div>
      <div className="h-3 w-1/3 bg-neutral-200 mb-2"></div>
      <div className="h-4 w-3/4 bg-neutral-200 mb-3"></div>
      <div className="h-3 w-1/2 bg-neutral-100 mb-4"></div>
      <div className="h-4 w-1/4 bg-neutral-200"></div>
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-shimmer">
      <div className="h-8 w-64 bg-neutral-200 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
