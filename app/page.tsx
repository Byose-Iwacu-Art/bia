"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SlideShow from "./comps/home/slides";
import Category from "./comps/product/category";
import ProductList from "./pages/ProductList";
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

interface DiscountProduct {
  id: number;
  name: string;
  image: string;
  price: string;
  discount: number;
  promotion: number;
  hashed_id: string;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));

// ── Discounted products side panel (vertical Swiper slider) ─────────────────
const DiscountPanel = () => {
  const [items, setItems] = useState<DiscountProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/discount")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="w-full h-full bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <i className="bi bi-fire text-white text-lg"></i>
          <span className="text-white font-bold text-[14px]">Hot Deals</span>
        </div>
        <span className="bg-white/20 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
          Up to 50% off
        </span>
      </div>

      {/* Items */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-2 gap-2 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-2 space-y-1">
                  <div className="h-2.5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2.5 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400 text-[12px] py-8">No deals right now</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 p-2">
            {items.map((item) => {
              const pct = item.discount || item.promotion || 0;
              const discounted = Number(item.price) - Number(item.price) * pct / 100;
              return (
                <Link
                  key={item.id}
                  href={`/products/${item.hashed_id}`}
                  className="group rounded-xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200 bg-white flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={item.image || '/imgs/logo.ico'}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width:640px) 45vw, 18vw"
                    />
                    {pct > 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
                        -{pct}%
                      </span>
                    )}
                  </div>
                  <div className="p-1.5 flex flex-col gap-0.5">
                    <p className="text-[11px] text-gray-700 font-medium line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[9px] text-gray-400 line-through">{fmt(Number(item.price))} RWF</p>
                    <p className="text-[12px] font-extrabold text-orange-600">{fmt(discounted)} RWF</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <Link
        href="/products"
        className="block text-center text-[12px] font-semibold text-orange-600 hover:text-orange-700 py-3 border-t border-gray-100 hover:bg-orange-50 transition-colors flex-shrink-0"
      >
        View all deals <i className="bi bi-arrow-right ml-1"></i>
      </Link>
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/products?sortPage=${sort}`)
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch products"); return r.json(); })
      .then((data) => { setProducts(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [sort]);

  const sortOptions = [
    { key: "popular", label: "Most Popular" },
    { key: "hot", label: "Hot Selling" },
    { key: "new", label: "New Picks" },
    { key: "reviewed", label: "Best Reviewed" },
  ];

  return (
    <>
      <head>
        <title>Byose Iwacu Art | Home — Made in Rwanda</title>
      </head>

      <div className="w-full px-3 sm:px-5 space-y-6">

        {/* ── HERO: SlideShow 60% left + Hot Deals 40% right ───────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="w-full sm:w-[60%] min-w-0">
            <SlideShow />
          </div>
          <div className="w-full sm:w-[40%] min-w-0 h-[360px] sm:h-[420px] lg:h-[500px]">
            <DiscountPanel />
          </div>
        </div>

        {/* ── CATEGORIES ──────────────────────────────────────────── */}
        <div>
          <Category />
        </div>

        {/* ── TOP PICKS ───────────────────────────────────────────── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Top Picks</h2>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSort(opt.key)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                    sort === opt.key
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="text-center py-10 text-red-500 text-[14px]">
              <i className="bi bi-exclamation-triangle block text-3xl mb-2"></i>
              {error}
            </div>
          ) : (
            <ProductList products={products} itemsPerPage={12} sortPage={sort} loading={loading} />
          )}
        </div>

      </div>
    </>
  );
}
