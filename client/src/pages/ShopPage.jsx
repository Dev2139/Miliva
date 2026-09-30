import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSliders, FiX, FiChevronDown } from 'react-icons/fi';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';

const SKIN_CONCERNS = ['Acne', 'Hyperpigmentation', 'Dryness', 'Large Pores', 'Aging', 'Dullness', 'Sensitized Skin'];
const INGREDIENTS = ['Niacinamide', 'Vitamin C', 'Hyaluronic Acid', 'Salicylic Acid', 'Peptides', 'Ceramides', 'Alpha Arbutin'];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filter drawer mobile
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  // Filters state
  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const selectedConcern = searchParams.get('skinConcern') || '';
  const selectedIngredient = searchParams.get('ingredient') || '';
  const isBestSeller = searchParams.get('isBestSeller') === 'true';
  const isNew = searchParams.get('isNew') === 'true';
  const inStockOnly = searchParams.get('inStock') === 'true';

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productService.getCategories();
        setCategories(res.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          category: selectedCategory,
          sort: selectedSort,
          skinConcern: selectedConcern,
          ingredient: selectedIngredient,
          isBestSeller: isBestSeller ? 'true' : undefined,
          isNew: isNew ? 'true' : undefined,
          inStock: inStockOnly ? 'true' : undefined,
          q: searchParams.get('q') || undefined
        };
        const res = await productService.getProducts(params);
        setProducts(res.products || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsData();
  }, [searchParams, page]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Breadcrumb & Header */}
      <div className="mb-8 space-y-2 border-b border-subtle pb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
          Formulation Catalog ({total})
        </span>
        <h1 className="text-3xl md:text-4xl font-light text-neutral-900 font-editorial">
          {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || 'Formulations' : isBestSeller ? 'Best Sellers' : isNew ? 'New Arrivals' : 'All Skincare'}
        </h1>
      </div>

      {/* Top Filter / Sort Bar */}
      <div className="flex items-center justify-between py-4 border-b border-subtle mb-8 text-xs font-semibold text-neutral-800">
        <button
          onClick={() => setIsFilterMobileOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 border border-neutral-300 bg-white uppercase tracking-wider"
        >
          <FiFilter className="w-4 h-4" />
          <span>Filters ({[selectedCategory, selectedConcern, selectedIngredient, isBestSeller, isNew, inStockOnly].filter(Boolean).length})</span>
        </button>

        <span className="hidden lg:inline-block text-neutral-500 font-normal">
          Showing {products.length} of {total} formulations
        </span>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-neutral-500 font-normal hidden sm:inline-block">Sort by:</span>
          <select
            value={selectedSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="px-3 py-2 border border-neutral-300 bg-white text-xs font-semibold text-neutral-900 focus:outline-none uppercase tracking-wider"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4 border-r border-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-subtle">
            <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-900">Filter By</h3>
            {(selectedCategory || selectedConcern || selectedIngredient || isBestSeller || isNew || inStockOnly) && (
              <button onClick={clearAllFilters} className="text-xs font-medium text-neutral-500 hover:text-neutral-900 underline">
                Clear All
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Category</h4>
            <div className="space-y-1.5 text-xs text-neutral-600">
              <button
                onClick={() => updateParam('category', '')}
                className={`block w-full text-left py-1 hover:text-neutral-900 ${!selectedCategory ? 'font-bold text-neutral-900' : ''}`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => updateParam('category', c.slug)}
                  className={`block w-full text-left py-1 hover:text-neutral-900 ${selectedCategory === c.slug ? 'font-bold text-neutral-900' : ''}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Concerns */}
          <div className="space-y-3 border-t border-subtle pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Skin Concern</h4>
            <div className="space-y-1.5 text-xs text-neutral-600">
              {SKIN_CONCERNS.map((sc) => (
                <label key={sc} className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-neutral-900">
                  <input
                    type="checkbox"
                    checked={selectedConcern === sc}
                    onChange={(e) => updateParam('skinConcern', e.target.checked ? sc : '')}
                    className="rounded-none border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span>{sc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Key Ingredients */}
          <div className="space-y-3 border-t border-subtle pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Key Ingredient</h4>
            <div className="space-y-1.5 text-xs text-neutral-600">
              {INGREDIENTS.map((ing) => (
                <label key={ing} className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-neutral-900">
                  <input
                    type="checkbox"
                    checked={selectedIngredient === ing}
                    onChange={(e) => updateParam('ingredient', e.target.checked ? ing : '')}
                    className="rounded-none border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span>{ing}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stock Availability */}
          <div className="space-y-3 border-t border-subtle pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Availability</h4>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                className="rounded-none border-neutral-300 text-neutral-900 focus:ring-0"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Main Product Grid Column */}
        <main className="lg:col-span-9 space-y-8">
          <ProductGrid products={products} loading={loading} columns={3} />

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-10 border-t border-subtle">
              {Array.from({ length: pages }).map((_, idx) => {
                const pNum = idx + 1;
                return (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`w-9 h-9 text-xs font-semibold flex items-center justify-center border transition-all ${
                      page === pNum
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-900'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start animate-fade-in">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-subtle">
                <h3 className="text-sm uppercase font-bold tracking-wider text-neutral-900">Filter Formulations</h3>
                <button onClick={() => setIsFilterMobileOpen(false)} className="p-1 text-neutral-400">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Category</h4>
                <div className="space-y-1 text-xs">
                  <button onClick={() => { updateParam('category', ''); setIsFilterMobileOpen(false); }} className="block w-full text-left py-1">All Categories</button>
                  {categories.map((c) => (
                    <button key={c._id} onClick={() => { updateParam('category', c.slug); setIsFilterMobileOpen(false); }} className={`block w-full text-left py-1 ${selectedCategory === c.slug ? 'font-bold' : ''}`}>{c.name}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-subtle space-y-2">
              <button onClick={() => setIsFilterMobileOpen(false)} className="w-full py-3 bg-neutral-900 text-white text-xs uppercase font-bold">Apply Filters</button>
              <button onClick={() => { clearAllFilters(); setIsFilterMobileOpen(false); }} className="w-full py-2 text-xs text-neutral-500 uppercase font-semibold">Clear All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
