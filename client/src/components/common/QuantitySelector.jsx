import React from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const QuantitySelector = ({ quantity, onDecrease, onIncrease, min = 1, max = 99, size = "md" }) => {
  const btnPadding = size === 'sm' ? 'p-1.5' : 'p-2.5';
  const textWidth = size === 'sm' ? 'w-8 text-xs' : 'w-10 text-sm';

  return (
    <div className="inline-flex items-center border border-neutral-300 bg-white">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`${btnPadding} text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        aria-label="Decrease quantity"
      >
        <FiMinus className="w-3.5 h-3.5" />
      </button>
      <span className={`${textWidth} text-center font-semibold text-neutral-900 select-none`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`${btnPadding} text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        aria-label="Increase quantity"
      >
        <FiPlus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default QuantitySelector;
