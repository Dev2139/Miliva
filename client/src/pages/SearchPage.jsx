import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) return;
      try {
        setLoading(true);
        const res = await productService.getProducts({ q: query, limit: 24 });
        setProducts(res.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8">
      <div className="border-b border-subtle pb-6 space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Search Results</span>
        <h1 className="text-3xl font-light text-neutral-900 font-editorial">
          Query: "<span className="font-semibold italic">{query}</span>"
        </h1>
        <p className="text-xs text-neutral-500">Found {products.length} formulations matching your search.</p>
      </div>

      <ProductGrid products={products} loading={loading} columns={4} />
    </div>
  );
};

export default SearchPage;
