import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const CONCERNS = [
  {
    title: 'Acne & Blemishes',
    concern: 'Acne',
    desc: 'Target active breakouts, clogged pores and sebum with Salicylic Acid & Niacinamide.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Dark Spots & Pigmentation',
    concern: 'Hyperpigmentation',
    desc: 'Inhibit melanin synthesis with stabilized Vitamin C and Alpha Arbutin.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Dehydration & Dryness',
    concern: 'Dryness',
    desc: 'Replenish lost skin lipids with multi-molecular Hyaluronic Acid & Ceramides.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Damaged Moisture Barrier',
    concern: 'Sensitized Skin',
    desc: 'Restore skin resilience with 5-Signal Peptides, Ectoin and Centella Asiatica.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop'
  }
];

const SkinConcernSection = () => {
  return (
    <section className="py-20 bg-cream border-y border-subtle">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">Targeted Care</span>
          <h2 className="text-3xl font-light text-neutral-900 font-editorial">
            Shop by <span className="font-semibold italic">Skin Concern</span>
          </h2>
          <p className="text-xs text-neutral-600">
            Formulations crafted specifically around skin physiological needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONCERNS.map((item, idx) => (
            <Link
              key={idx}
              to={`/shop?skinConcern=${encodeURIComponent(item.concern)}`}
              className="group bg-white border border-subtle p-6 flex flex-col justify-between hover:border-neutral-900 transition-all duration-300 shadow-xs"
            >
              <div>
                <div className="aspect-square bg-cream overflow-hidden mb-6 border border-subtle">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2 font-editorial">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900 group-hover:underline">
                <span>Explore Formulations</span>
                <FiArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkinConcernSection;
