"use client";
import React from 'react';
import { useEffect, useState } from "react";
import Preloader from '../forms/PreDivLoader';
import Link from 'next/link';
import FlashSales from './flashsale';

interface Category {
  id: number;
  cat_name: string;
  avatar: string;
  products: number;

}


const Category: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriez, setCategoriez] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch(`/api/products/category/${'any'}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categorys");
        }
        return response.json();
      })
      .then((data) => {
        setCategoriez(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/products/category/${6}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categorys");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    <Preloader />
  }

  if (error) {
    return <div className="text-center text-red-500 py-6"> <Preloader /></div>;
  }
  return (
    <>
   <div className="cat flex w-full gap-2 flex-wrap md:flex-wrap lg:justify-between lg:flex-nowrap">
  {[
    { icon: "bi-bag", color: "text-violet-500", text: "Special Offers" },
    { icon: "bi-star", color: "text-orange-500", text: "Most Reviewed" },
    { icon: "bi-geo-alt", color: "text-green-500", text: "Near by Quality" },
    { icon: "bi-truck", color: "text-cyan-500", text: "New Arrivals" },
    { icon: "bi-arrow-down", color: "text-red-500", text: "Low Prices Offers" },
    { icon: "bi-fire", color: "text-red-500", text: "Popular" },
    { icon: "bi-credit-card", color: "text-red-500", text: "Discounts" },
    { icon: "bi-cart", color: "text-red-500", text: "Special Order Option" },
  ].map((item, index) => (
    <div
      key={index}
      className="w-auto py-2 px-3 border border-slate-400 rounded-xl flex items-center"
    >
      <div className="w-1/2 flex justify-center mr-3">
        <i className={`bi ${item.icon} text-base ${item.color}`}></i>
      </div>
      <Link href="" className="text-base sm:text-sm text-nowrap text-center">
        {item.text}
      </Link>
    </div>
  ))}
</div>

      <div className='text-center my-7 w-max text-slate-500 mx-auto'>
       <h1 className="text-lg border-b border-slate-200 py-2">Shop by category</h1>
      </div>
      <div className="w-full lg:px-1">
  {/* First Row of Categories */}
  <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-7 gap-4 p-3">
    {categoriez.map((cat,key) => (
     <div key={key} className="flex flex-col bg-white p-2 shadow-md rounded-lg hover:shadow-lg transition-transform transform hover:scale-80">
     <div className="w-full h-20 mb-2">
       <img src={cat.avatar} alt={cat.cat_name} className='w-full h-full object-contain rounded-lg' />
     </div>
     <Link href={`/products/category/${cat.cat_name}`} onClick={() => window.location.assign(`/products/category/${cat.cat_name}`)} className='flex flex-col'>
       <div className="name text-black text-sm md:text-base font-semibold truncate">{cat.cat_name}</div>
       {/*}<div className="count text-blue-500 text-xs">{cat.products} +</div>{*/}
       <button className='mt-2 bg-red-50 text-slate-600 px-3 py-2 text-xs rounded-md flex items-center justify-center transition-colors hover:bg-red-200 hover:text-slate-700'>
         View more <i className="bi bi-arrow-right ml-1"></i>
       </button>
     </Link>
   </div>
    ))}
  </div>

  {/* Second Row of Categories with Discount Component */}
  <div className="row-1 w-full flex flex-col-reverse lg:flex-row gap-2">
   <FlashSales />
  </div>
</div>

  </>
  );
};

export default Category;