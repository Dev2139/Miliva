import React from 'react';
import { FiInstagram } from 'react-icons/fi';

const INSTA_POSTS = [
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop'
];

const InstagramSection = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">@milivaskincare</span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">
            Follow Our <span className="font-semibold">Laboratory Journey</span>
          </h2>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 border border-neutral-300 px-4 py-2 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          <FiInstagram className="w-4 h-4" />
          <span>Follow on Instagram</span>
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {INSTA_POSTS.map((url, i) => (
          <div key={i} className="aspect-square bg-cream border border-subtle overflow-hidden relative group cursor-pointer">
            <img src={url} alt={`Insta post ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <FiInstagram className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramSection;
