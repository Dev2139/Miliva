import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import ProductGrid from '../product/ProductGrid';
import { productService } from '../../services/productService';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts({ limit: 6 });
        setProducts(res.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-subtle pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">Clinical Formulations</span>
          <h2 className="text-3xl font-light text-neutral-900 font-editorial mt-1">
            The Official MILIVA <span className="font-semibold">Lineup</span>
          </h2>
        </div>

        <Link
          to="/shop"
          className="text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-600 flex items-center gap-2 border-b border-neutral-900 pb-0.5 self-start md:self-auto"
        >
          <span>View All Products</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <ProductGrid products={products} loading={loading} columns={3} />
    </section>
  );
};

export default BestSellers;
