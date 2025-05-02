// page.tsx
"use client";
import React, { useEffect, useState } from "react";
import SlideShow from "./comps/home/slides";
import Category from "./comps/product/category";
import ProductList from "./pages/ProductList";
import Preloader from "./comps/forms/PreDivLoader";

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
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?sortPage=${sort}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sort]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-6">{error}</div>;
  }

  return (
    <>
      <head>
        <title>
          Byose Iwacu Art | Home - Made in Rwanda | Online Shopping
        </title>
      </head>
      <div className="w-full">
        <SlideShow />
      </div>
      <div className="pt-10">
        <div className="px-5">
          <Category />
        </div>
      </div>
      <div className="py-10 px-5">
        <h1 className="text-3xl font-semibold text-center">Top picks</h1>
        <div className="py-4 text-center">
          <button className={`px-6 py-2 ${sort === "popular" ? 'bg-slate-300 border-2' : ''} border-emerald-200 rounded-2xl border m-2 hover:border-2 hover:bg-slate-200`}
            onClick={() => setSort("popular")}
          >
            Most Popular
          </button>
          <button className={`px-6 py-2 ${sort === "hot" ? 'bg-slate-300 border-2' : ''} border-emerald-200 rounded-2xl border m-2 hover:border-2 hover:bg-slate-200`}
            onClick={() => setSort("hot")}
          >
            Hot Selling
          </button>
          <button className={`px-6 py-2 ${sort === "new" ? 'bg-slate-300 border-2' : ''} border-emerald-200 rounded-2xl border m-2 hover:border-2 hover:bg-slate-200`}
            onClick={() => setSort("new")}
          >
            New Picks
          </button>
          <button className={`px-6 py-2 ${sort === "reviewed" ? 'bg-slate-300 border-2' : ''} border-emerald-200 rounded-2xl border m-2 hover:border-2 hover:bg-slate-200`}
            onClick={() => setSort("reviewed")}
          >
            Best Reviewed
          </button>
        </div>
      </div>
      <div className="py-4 px-5">
        <ProductList products={products} itemsPerPage={18} sortPage={sort}/>
      </div>
    </>
  );
}
