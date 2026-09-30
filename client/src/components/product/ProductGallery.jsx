import React, { useState } from 'react';
import { FiPlayCircle, FiImage } from 'react-icons/fi';

const ProductGallery = ({ images = [], videoUrl = '', name = "" }) => {
  const defaultImages = images.length > 0 
    ? images.map(img => typeof img === 'string' ? img : img.url || '/images/cleanser.svg') 
    : ['/images/cleanser.svg'];

  // Media list combining images and video (if present)
  const mediaList = defaultImages.map((imgUrl, i) => ({ type: 'image', url: imgUrl, id: `img-${i}` }));
  
  if (videoUrl) {
    mediaList.push({ type: 'video', url: videoUrl, id: 'video-main' });
  }

  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentMedia = mediaList[selectedIndex] || mediaList[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Bar */}
      {mediaList.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-none">
          {mediaList.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-16 border transition-all flex-shrink-0 bg-neutral-50 overflow-hidden relative ${
                selectedIndex === idx ? 'border-neutral-900 ring-2 ring-neutral-900' : 'border-neutral-200 opacity-70 hover:opacity-100'
              }`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-neutral-900 text-white flex flex-col items-center justify-center p-1">
                  <FiPlayCircle className="w-6 h-6 text-emerald-400" />
                  <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5">Video</span>
                </div>
              ) : (
                <img src={item.url} alt={`${name} thumbnail ${idx}`} className="w-full h-full object-contain p-1" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Media Display Box */}
      <div className="flex-1 aspect-square bg-[#F7F3ED] border border-neutral-200 overflow-hidden relative group rounded-lg">
        {currentMedia.type === 'video' ? (
          <div className="w-full h-full bg-black flex items-center justify-center relative">
            {currentMedia.url.endsWith('.mp4') || currentMedia.url.endsWith('.webm') || currentMedia.url.startsWith('/videos') ? (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <iframe
                src={currentMedia.url}
                title={`${name} video`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        ) : (
          <img
            src={currentMedia.url}
            alt={name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
