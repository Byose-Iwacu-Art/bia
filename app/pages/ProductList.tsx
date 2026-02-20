"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "../comps/product/card";
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  orders: number;
  status: string;
  stock: number;
  sizes: string;
  colors: string;
  image: string;
  description: string;
  hashed_id: string;
  promotion: number;
}

interface ProductListProps {
  products: Product[];
  itemsPerPage: number;
  sortPage: string;
  loading?: boolean;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-8 bg-gray-100 rounded-xl mt-2"></div>
    </div>
  </div>
);

const ProductList: React.FC<ProductListProps> = ({ products, sortPage, loading }) => {
  const [visible, setVisible] = useState(12);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Reset visible when sort or any filter changes
  useEffect(() => {
    setVisible(12);
  }, [sortPage, selectedCats, priceMax, onSaleOnly, inStockOnly]);

  // Derived filter options from product data
  const allCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort() as string[];
  const maxPrice = products.length ? Math.max(...products.map(p => Number(p.price))) : 100000;

  const toggleCat = (cat: string) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearAll = () => {
    setSelectedCats([]);
    setPriceMax(0);
    setOnSaleOnly(false);
    setInStockOnly(false);
  };

  const activeFilterCount =
    selectedCats.length +
    (priceMax > 0 ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  // Apply filters
  const filtered = products
    .filter(p => selectedCats.length === 0 || selectedCats.includes(p.category))
    .filter(p => priceMax === 0 || Number(p.price) <= priceMax)
    .filter(p => !onSaleOnly || p.promotion > 0)
    .filter(p => !inStockOnly || p.stock > 0);

  const visibleProducts = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const onSaleCount = products.filter(p => p.promotion > 0).length;

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Skeleton sidebar */}
        <div className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-[5px] p-4 shadow animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 bg-gray-100 rounded w-full"></div>
            ))}
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
            <div className="h-6 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
        {/* Skeleton grid */}
        <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <i className="bi bi-bag-x text-5xl block mb-3"></i>
        <p className="text-[14px]">No products found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-3 lg:hidden">
        <button
          onClick={() => setFilterOpen(o => !o)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-[13px] font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors shadow-sm"
        >
          <i className="bi bi-funnel text-[13px]"></i>
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="text-[12px] text-gray-400">{filtered.length} products</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── FILTER SIDEBAR ─────────────────────────────────────── */}
        <aside className={`w-full lg:w-60 flex-shrink-0 lg:self-start lg:sticky lg:top-[calc(165px+8px)] ${filterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white border border-gray-200 rounded-[5px] p-4 shadow space-y-5 max-h-[calc(100vh-8rem)] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5">
                <i className="bi bi-funnel-fill text-orange-500"></i>
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[11px] text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5 -mt-2">
                {selectedCats.map(c => (
                  <span key={c} className="flex items-center gap-1 bg-orange-50 text-orange-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-orange-200">
                    {c}
                    <button onClick={() => toggleCat(c)} className="hover:text-red-500">
                      <i className="bi bi-x text-[11px]"></i>
                    </button>
                  </span>
                ))}
                {onSaleOnly && (
                  <span className="flex items-center gap-1 bg-orange-50 text-orange-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-orange-200">
                    On sale
                    <button onClick={() => setOnSaleOnly(false)} className="hover:text-red-500">
                      <i className="bi bi-x text-[11px]"></i>
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="flex items-center gap-1 bg-orange-50 text-orange-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-orange-200">
                    In stock
                    <button onClick={() => setInStockOnly(false)} className="hover:text-red-500">
                      <i className="bi bi-x text-[11px]"></i>
                    </button>
                  </span>
                )}
                {priceMax > 0 && (
                  <span className="flex items-center gap-1 bg-orange-50 text-orange-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-orange-200">
                    ≤ {fmt(priceMax)} RWF
                    <button onClick={() => setPriceMax(0)} className="hover:text-red-500">
                      <i className="bi bi-x text-[11px]"></i>
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* ── Category ── */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category</h4>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 custom-scroll">
                {allCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group/item">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(cat)}
                      onChange={() => toggleCat(cat)}
                      className="w-3.5 h-3.5 accent-orange-500 rounded flex-shrink-0"
                    />
                    <span className="text-[12px] text-gray-600 group-hover/item:text-orange-600 transition-colors truncate">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Price range ── */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Max Price</h4>
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={Math.max(1, Math.ceil(maxPrice / 20))}
                value={priceMax || maxPrice}
                onChange={e => setPriceMax(Number(e.target.value) === maxPrice ? 0 : Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] mt-1">
                <span className="text-gray-400">0 RWF</span>
                <span className="text-orange-600 font-semibold">{fmt(priceMax || maxPrice)} RWF</span>
              </div>
            </div>

            {/* ── Deals ── */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Deals</h4>
              <label className="flex items-center gap-2 cursor-pointer group/item">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={e => setOnSaleOnly(e.target.checked)}
                  className="w-3.5 h-3.5 accent-orange-500 rounded"
                />
                <span className="text-[12px] text-gray-600 group-hover/item:text-orange-600 transition-colors">
                  On sale only
                </span>
                <span className="ml-auto text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-semibold">
                  {onSaleCount}
                </span>
              </label>
            </div>

            {/* ── Availability ── */}
            <div>
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Availability</h4>
              <label className="flex items-center gap-2 cursor-pointer group/item">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="w-3.5 h-3.5 accent-orange-500 rounded"
                />
                <span className="text-[12px] text-gray-600 group-hover/item:text-orange-600 transition-colors">
                  In stock only
                </span>
              </label>
            </div>

          </div>
        </aside>

        {/* ── PRODUCT GRID ───────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <i className="bi bi-search text-5xl block mb-3"></i>
              <p className="text-[14px]">No products match your filters.</p>
              <button onClick={clearAll} className="mt-3 text-orange-500 text-[13px] font-semibold hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {visibleProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    details={item.description}
                    price={item.price}
                    size={item.sizes}
                    color={item.colors}
                    image={item.image}
                    hashed_id={item.hashed_id}
                    promotion={item.promotion}
                  />
                ))}
              </div>

              {/* Load More */}
              <div className="flex flex-col items-center gap-2 mt-8">
                <p className="text-[13px] text-gray-400">
                  Showing {Math.min(visible, filtered.length)} of {filtered.length} products
                </p>
                {hasMore && (
                  <button
                    onClick={() => setVisible(v => v + 12)}
                    className="px-8 py-2.5 rounded-full border-2 border-orange-400 text-orange-600 font-semibold text-[13px] hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all active:scale-95"
                  >
                    Load more <i className="bi bi-arrow-down ml-1"></i>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </>
  );
};

export default ProductList;
