import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import RatingStars from '../common/RatingStars';

const REVIEWS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai, MH',
    rating: 5,
    title: 'Reduced my stubborn acne marks',
    comment: 'The 10% Niacinamide serum completely changed my texture. Within three weeks of consistent morning application, my hyperpigmentation faded by half.',
    product: 'Niacinamide 10% + Zinc 1%'
  },
  {
    name: 'Ananya Verma',
    location: 'Bengaluru, KA',
    rating: 5,
    title: 'Savior for damaged skin barrier!',
    comment: 'I overused AHA peels and my skin was stinging every time I applied water. The Multi-Peptide Repair cream restored my barrier in 48 hours. Unreal quality.',
    product: 'Multi-Peptide Repair Cream'
  },
  {
    name: 'Rohan Mehta',
    location: 'Delhi, NCR',
    rating: 5,
    title: 'Zero white cast on wheatish skin',
    comment: 'Finding a zinc sunscreen that doesn’t turn gray on Indian skin tones is rare. Miliva SPF 50 fluid melts invisibly and stays matte under humidity.',
    product: 'Fluid Mineral Sunscreen SPF 50'
  }
];

const CustomerReviews = () => {
  return (
    <section className="py-24 bg-cream border-y border-subtle">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">Real Results</span>
          <h2 className="text-3xl font-light text-neutral-900 font-editorial">
            Community <span className="font-semibold italic">Testimonials</span>
          </h2>
          <p className="text-xs text-neutral-600">
            Over 50,000 verified buyers trust Miliva formulations daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((r, i) => (
            <div key={i} className="p-8 bg-white border border-subtle flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-3">
                <RatingStars rating={r.rating} size={14} />
                <h4 className="text-sm font-bold text-neutral-900">{r.title}</h4>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">"{r.comment}"</p>
              </div>

              <div className="pt-4 border-t border-subtle flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-900 flex items-center gap-1">
                    <span>{r.name}</span>
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </p>
                  <p className="text-[10px] text-neutral-400">{r.location}</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 bg-cream px-2 py-1 border border-subtle">
                  {r.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
