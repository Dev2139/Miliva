import React from 'react';
import { FiShield, FiHeart, FiEye, FiCheckSquare } from 'react-icons/fi';

const ProductBenefits = () => {
  const BENEFITS = [
    {
      icon: <FiShield className="w-8 h-8 text-neutral-900" />,
      title: 'Dermatologically Tested',
      desc: 'Tested on sensitive human skin under strict clinical supervision for safety and low irritation.'
    },
    {
      icon: <FiHeart className="w-8 h-8 text-neutral-900" />,
      title: '100% Fragrance Free',
      desc: 'Zero synthetic perfumes or essential oils that trigger redness, sensitization and inflammation.'
    },
    {
      icon: <FiEye className="w-8 h-8 text-neutral-900" />,
      title: 'Full Ingredient Transparency',
      desc: 'We disclose exact active ingredient percentages right on the bottle label. Zero hidden blends.'
    },
    {
      icon: <FiCheckSquare className="w-8 h-8 text-neutral-900" />,
      title: 'Cruelty-Free & Vegan',
      desc: 'Formulated strictly without animal testing or animal-derived ingredients.'
    }
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {BENEFITS.map((b, i) => (
          <div key={i} className="p-8 bg-white border border-subtle text-left space-y-4 hover:border-neutral-900 transition-colors">
            <div className="p-3 bg-cream inline-block border border-subtle mb-2">
              {b.icon}
            </div>
            <h4 className="text-base font-bold text-neutral-900 font-editorial">{b.title}</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductBenefits;
