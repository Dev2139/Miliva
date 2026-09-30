import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative bg-cream border-b border-subtle overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-block px-3 py-1 bg-white border border-neutral-300 text-[10px] uppercase tracking-widest font-bold text-neutral-800">
            Clinical Science &bull; Pure Potency
          </div>

          <h1 className="text-4xl md:text-6xl font-light text-neutral-900 leading-[1.1] tracking-tight font-editorial">
            Skincare, <br />
            <span className="font-semibold italic">simplified.</span>
          </h1>

          <p className="text-base md:text-lg text-neutral-600 font-light max-w-lg leading-relaxed">
            Effective formulations designed around active ingredients that work. No secret blends, no artificial fragrance, just clinical results.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/shop"
              className="px-8 py-4 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors border border-neutral-900 flex items-center gap-2"
            >
              <span>Shop Skincare</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/ingredients"
              className="px-8 py-4 bg-white text-neutral-900 text-xs uppercase font-bold tracking-widest hover:bg-neutral-100 transition-colors border border-neutral-300"
            >
              Explore Ingredients
            </Link>
          </div>

          {/* Social Proof metrics */}
          <div className="pt-8 grid grid-cols-3 gap-6 border-t border-subtle/80 max-w-md">
            <div>
              <p className="text-2xl font-bold text-neutral-900 font-editorial">100%</p>
              <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">Fragrance-Free</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 font-editorial">4.9★</p>
              <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">Avg Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 font-editorial">50K+</p>
              <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">Bottles Delivered</p>
            </div>
          </div>
        </div>

        {/* Right Column Hero Photography */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-4/5 max-w-md mx-auto lg:max-w-none border border-subtle shadow-xs bg-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop"
              alt="Miliva Skincare Hero Bottles"
              className="w-full h-full object-cover object-center"
            />

            {/* Floating Editorial Badge */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 border border-subtle max-w-xs shadow-sm">
              <p className="text-xs uppercase font-bold tracking-widest text-neutral-900 mb-1">
                Niacinamide 10% + Zinc 1%
              </p>
              <p className="text-[11px] text-neutral-500">
                Clinically proven formula for sebum control & pore refinement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
