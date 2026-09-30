import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

const INGREDIENTS_DATA = [
  {
    id: 'niacinamide',
    name: 'Niacinamide (Vitamin B3)',
    potency: '10%',
    role: 'Oil Control & Pore Reduction',
    description: 'A water-soluble vitamin that works with natural substances in your skin to visibly minimize enlarged pores, tighten lax pores, improve uneven skin tone, and soften fine lines.',
    benefits: ['Controls sebum production', 'Fades post-acne dark marks', 'Tightens skin pore walls', 'Supports barrier ceramic lipids'],
    link: '/shop?ingredient=Niacinamide'
  },
  {
    id: 'vitaminc',
    name: 'Pure L-Ascorbic Acid',
    potency: '15%',
    role: 'Antioxidant & Brightening',
    description: 'The purest biologically active form of Vitamin C. Neutralizes free radical damage from sun pollution while stimulating natural skin collagen synthesis.',
    benefits: ['Evens out dark pigmentation', 'Protects against UV photoaging', 'Boosts skin radiant glow', 'Firms sagging collagen'],
    link: '/shop?ingredient=Vitamin C'
  },
  {
    id: 'salicylic',
    name: 'Salicylic Acid (BHA)',
    potency: '2%',
    role: 'Pore Unclogging Exfoliator',
    description: 'An oil-soluble Beta Hydroxy Acid capable of penetrating deep into pore linings to dissolve accumulated sebum, dead skin debris, and stubborn blackheads.',
    benefits: ['Dissolves pore blockages', 'Soothes inflamed pimples', 'Smooths rough skin bumps', 'Controls T-zone shine'],
    link: '/shop?ingredient=Salicylic Acid'
  },
  {
    id: 'ceramides',
    name: 'Ceramides NP/AP/EOP',
    potency: '3%',
    role: 'Lipid Barrier Restoration',
    description: 'Identical skin lipids that make up over 50% of skin composition. Restores moisture lock and prevents transepidermal water loss (TEWL).',
    benefits: ['Locks in 48-hr moisture', 'Prevents stinging & redness', 'Strengthens compromised skin', 'Protects against cold dry weather'],
    link: '/shop?ingredient=Ceramides'
  }
];

const IngredientFocus = () => {
  const [activeTab, setActiveTab] = useState(0);
  const current = INGREDIENTS_DATA[activeTab];

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">Full Transparency</span>
        <h2 className="text-3xl font-light text-neutral-900 font-editorial">
          Ingredient-Led <span className="font-semibold italic">Formulation</span>
        </h2>
        <p className="text-xs text-neutral-600">
          Every active ingredient is calibrated to clinically proven active percentages.
        </p>
      </div>

      <div className="bg-white border border-subtle grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-xs">
        {/* Left Tabs List */}
        <div className="lg:col-span-4 border-r border-subtle divide-y divide-subtle bg-cream/40">
          {INGREDIENTS_DATA.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`w-full p-6 text-left transition-all flex items-center justify-between ${
                activeTab === idx
                  ? 'bg-white border-l-4 border-l-neutral-900 shadow-xs'
                  : 'hover:bg-neutral-100/80 text-neutral-600'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">
                  Active Concentration: {item.potency}
                </span>
                <h4 className="text-sm font-bold text-neutral-900">{item.name}</h4>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 border ${
                activeTab === idx ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-300 text-neutral-500'
              }`}>
                {item.potency}
              </span>
            </button>
          ))}
        </div>

        {/* Right Tab Content */}
        <div className="lg:col-span-8 p-8 md:p-12 flex flex-col justify-between space-y-8 bg-white">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-cream text-neutral-900 text-xs font-bold uppercase tracking-wider border border-subtle">
                {current.role}
              </span>
              <span className="text-xs text-neutral-400 font-mono">Derm-Grade Standard</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-light text-neutral-900 font-editorial">
              {current.name}
            </h3>

            <p className="text-sm text-neutral-600 font-light leading-relaxed max-w-2xl">
              {current.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-subtle">
              {current.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-800 font-medium">
                  <FiCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-subtle">
            <Link
              to={current.link}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors"
            >
              <span>Shop {current.name.split(' ')[0]} Formulations</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IngredientFocus;
