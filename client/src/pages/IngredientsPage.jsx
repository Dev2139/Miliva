import React from 'react';
import { Link } from 'react-router-dom';

const INGREDIENTS_LIST = [
  { name: 'Niacinamide (Vitamin B3)', percentage: '10%', concern: 'Acne, Oil, Pores', desc: 'Strengthens barrier lipids and regulates sebum production.' },
  { name: 'Pure L-Ascorbic Acid', percentage: '15%', concern: 'Dullness, Dark Spots', desc: 'Potent antioxidant that brightens skin and boosts collagen.' },
  { name: 'Salicylic Acid (BHA)', percentage: '2%', concern: 'Blackheads, Acne', desc: 'Oil-soluble acid that penetrates deep inside pore linings.' },
  { name: 'Multi-Peptide Complex', percentage: '3%', concern: 'Aging, Loss of Firmness', desc: 'Signal peptides that restore dermal matrix resilience.' },
  { name: 'Ceramides NP/AP/EOP', percentage: '3%', concern: 'Dryness, Sensitivity', desc: 'Essential lipids that seal moisture into outer dermis layers.' },
  { name: 'Hyaluronic Acid', percentage: '2%', concern: 'Dehydration', desc: 'Attracts and retains 1000x its weight in water.' },
  { name: 'Alpha Arbutin', percentage: '2%', concern: 'Hyperpigmentation', desc: 'Inhibits tyrosinase enzyme to fade dark sun spots.' },
  { name: 'Retinol Complex', percentage: '0.3%', concern: 'Fine lines, Texture', desc: 'Accelerates cell turnover for smooth refined skin.' }
];

const IngredientsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-12">
      <div className="border-b border-subtle pb-6 space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">Clinical Library</span>
        <h1 className="text-4xl font-light text-neutral-900 font-editorial">Active Ingredients Glossary</h1>
        <p className="text-xs text-neutral-600 max-w-xl">
          Learn about the active ingredients behind our clinical formulations and how they address your skin needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INGREDIENTS_LIST.map((ing, i) => (
          <div key={i} className="p-6 bg-white border border-subtle space-y-3 hover:border-neutral-900 transition-colors shadow-xs">
            <div className="flex items-center justify-between border-b border-subtle pb-2">
              <h3 className="text-base font-bold text-neutral-900 font-editorial">{ing.name}</h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                {ing.percentage}
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">{ing.desc}</p>
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-neutral-400 font-semibold">Target: {ing.concern}</span>
              <Link to={`/shop?ingredient=${encodeURIComponent(ing.name.split(' ')[0])}`} className="font-bold text-neutral-900 underline">
                Browse Products &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsPage;
