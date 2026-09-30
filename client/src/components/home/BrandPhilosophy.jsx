import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const BrandPhilosophy = () => {
  return (
    <section className="py-24 bg-cream border-y border-subtle">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Image */}
        <div className="lg:col-span-6 relative">
          <div className="aspect-4/3 bg-white border border-subtle overflow-hidden shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop"
              alt="Miliva Skincare Philosophy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column Content */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">Our Core Ethos</span>
          <h2 className="text-3xl md:text-4xl font-light text-neutral-900 leading-tight font-editorial">
            No Marketing Gimmicks. <br />
            <span className="font-semibold italic">Just Clinical Efficacy.</span>
          </h2>

          <div className="space-y-4 text-xs md:text-sm text-neutral-600 font-light leading-relaxed">
            <p>
              Miliva was founded on a simple realization: skincare does not need multi-million dollar marketing jargon or synthetic fragrances. It needs clinical-grade active ingredients at effective concentrations.
            </p>
            <p>
              We disclose every single ingredient concentration on the front of our label. No secret proprietary blends, no false claims. Just honest formulations designed for optimal skin health.
            </p>
          </div>

          <div className="pt-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors"
            >
              <span>Read Our Full Story</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandPhilosophy;
