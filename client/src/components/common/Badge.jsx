import React from 'react';

const Badge = ({ type = 'default', text = '' }) => {
  let style = 'bg-neutral-900 text-white border-neutral-900';

  if (type === 'bestseller') {
    style = 'bg-[#171717] text-white';
  } else if (type === 'new') {
    style = 'bg-neutral-100 text-neutral-900 border-neutral-300';
  } else if (type === 'sale') {
    style = 'bg-red-50 text-red-700 border-red-200';
  }

  const label = text || (type === 'bestseller' ? 'BESTSELLER' : type === 'new' ? 'NEW' : 'FEATURED');

  return (
    <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border ${style}`}>
      {label}
    </span>
  );
};

export default Badge;
