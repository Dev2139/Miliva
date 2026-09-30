import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiPackage, FiHelpCircle } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-16">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">Our Story & Ethos</span>
        <h1 className="text-4xl md:text-5xl font-light text-neutral-900 font-editorial leading-tight">
          Science-Led Skincare. <br />
          <span className="font-semibold italic">100% Transparent Formulations.</span>
        </h1>
        <p className="text-sm md:text-base text-neutral-600 font-light leading-relaxed">
          MILIVA was built to eliminate marketing gimmicks and arbitrary fragrance additives. We formulate clinically proven active ingredients at precise active percentages.
        </p>
      </div>

      {/* Hero Image */}
      <div className="aspect-21/9 bg-cream border border-subtle overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop"
          alt="Miliva Lab Cleanroom"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-subtle">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-neutral-900 font-editorial">1. Clinical Transparency</h3>
          <p className="text-xs text-neutral-600 leading-relaxed font-light">
            We list the active percentage of every key ingredient right on the front label. No hidden proprietary complexes.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-neutral-900 font-editorial">2. Zero Essential Oils</h3>
          <p className="text-xs text-neutral-600 leading-relaxed font-light">
            Fragrances and essential oils are the #1 cause of contact dermatitis. All Miliva products are 100% fragrance-free.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-neutral-900 font-editorial">3. Ethical Formulations</h3>
          <p className="text-xs text-neutral-600 leading-relaxed font-light">
            Cruelty-free, vegan-certified, and packaged in recyclable materials to minimize environmental impact.
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div id="faq" className="space-y-6 pt-12 border-t border-subtle max-w-4xl">
        <h2 className="text-2xl font-light text-neutral-900 font-editorial">Frequently Asked Questions</h2>
        <div className="space-y-4 text-xs text-neutral-700">
          <div className="p-5 bg-cream border border-subtle space-y-1">
            <h4 className="font-bold text-neutral-900 text-sm">Are Miliva products safe for sensitive skin?</h4>
            <p>Yes. All formulations undergo human repeat insult patch testing (HRIPT) to ensure zero sensitization.</p>
          </div>
          <div className="p-5 bg-cream border border-subtle space-y-1">
            <h4 className="font-bold text-neutral-900 text-sm">How fast is shipping?</h4>
            <p>Orders are dispatched within 24 hours. Express transit takes 2-4 business days across India.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
