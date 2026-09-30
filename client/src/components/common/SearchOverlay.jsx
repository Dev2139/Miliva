import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiArrowRight, FiClock } from 'react-icons/fi';
import { productService } from '../../services/productService';
import PriceDisplay from './PriceDisplay';

const POPULAR_SEARCHES = ['Niacinamide', 'Vitamin C', 'Salicylic Acid', 'Hyaluronic Acid', 'Ceramides', 'Acne', 'Dark Spots'];

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('miliva_recent_searches');
    return saved ? JSON.parse(saved) : ['Niacinamide Serum', 'Sunscreen SPF 50', 'Barrier Repair Cream'];
  });

  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts({ q: query, limit: 5 });
        setResults(res.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (searchTerm) => {
    const term = searchTerm || query;
    if (!term.trim()) return;

    // Save to recent
    const updatedRecent = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('miliva_recent_searches', JSON.stringify(updatedRecent));

    onClose();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start animate-fade-in">
      <div className="bg-white border-b border-subtle shadow-xl w-full max-h-[85vh] flex flex-col">
        {/* Top bar with input */}
        <div className="max-w-4xl mx-auto w-full px-4 py-6 flex items-center gap-4">
          <FiSearch className="w-6 h-6 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            placeholder="Search by ingredient, concern, or product..."
            className="w-full text-xl md:text-2xl font-light text-neutral-900 bg-transparent border-none outline-none placeholder:text-neutral-300"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-neutral-900 p-1">
              <FiX className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 font-semibold px-3 py-1 border border-neutral-300"
          >
            Esc
          </button>
        </div>

        {/* Results / Quick Suggestions container */}
        <div className="overflow-y-auto max-w-4xl mx-auto w-full px-4 pb-8 flex-1">
          {loading ? (
            <div className="py-12 text-center text-neutral-400 text-sm">Searching formulation database...</div>
          ) : query.trim() ? (
            results.length > 0 ? (
              <div>
                <div className="flex items-center justify-between border-b border-subtle pb-3 mb-4">
                  <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                    Matching Products ({results.length})
                  </span>
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="text-xs font-semibold text-neutral-900 flex items-center gap-1 hover:underline"
                  >
                    View all results <FiArrowRight />
                  </button>
                </div>

                <div className="divide-y divide-subtle">
                  {results.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => {
                        onClose();
                        navigate(`/product/${product.slug}`);
                      }}
                      className="py-3 flex items-center gap-4 hover:bg-neutral-50 px-2 cursor-pointer transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 object-cover border border-subtle bg-white"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-neutral-900">{product.name}</h4>
                        <p className="text-xs text-neutral-500 line-clamp-1">{product.shortDescription}</p>
                        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" className="mt-1" />
                      </div>
                      <FiArrowRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-neutral-600 text-sm">No formulations matched "{query}".</p>
                <button
                  onClick={() => handleSearchSubmit()}
                  className="mt-3 text-xs uppercase tracking-wider font-semibold text-neutral-900 underline"
                >
                  Search all products
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">Recent Searches</h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(term);
                          handleSearchSubmit(term);
                        }}
                        className="flex items-center gap-1.5 text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 border border-neutral-200 transition-colors"
                      >
                        <FiClock className="w-3 h-3 text-neutral-400" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular trends */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">Popular Ingredients & Concerns</h4>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(item);
                        handleSearchSubmit(item);
                      }}
                      className="text-xs text-neutral-800 bg-cream hover:bg-neutral-200 px-3 py-1.5 border border-neutral-300 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
