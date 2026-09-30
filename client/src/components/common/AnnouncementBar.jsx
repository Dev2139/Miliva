import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="bg-[#171717] text-white text-[11px] font-medium tracking-widest uppercase py-2.5 px-4 text-center">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
        <span>Free Express Shipping on all orders above ₹999</span>
        <span className="hidden md:inline-block text-neutral-500">•</span>
        <span className="hidden md:inline-block">Use Code <strong className="text-white underline underline-offset-2">WELCOME10</strong> for 10% OFF</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
