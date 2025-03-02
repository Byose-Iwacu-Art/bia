"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Preloader from "../forms/PreDivLoader";
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import ProductCard from "./card";
import Discount from "./discount";

interface Product {
    id: number;
    name: string;
    discount: number;
    image: string;
    price: string;
    hashed_id: string;
}

const FlashSales =  () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      fetch("/api/products/discount")
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Failed to fetch categories");
              }
              return response.json();
          })
          .then((data) => {
              setProducts(data);
              setLoading(false);
          })
          .catch((err) => {
              setError(err.message);
              setLoading(false);
          });
  }, []);

  if (loading) {
      return <Preloader />;
  }

  if (error) {
      return <div className="text-center text-red-500 py-6">{error}</div>;
  }
  return(
    <>
     <div className="flex flex-wrap sm:flex-nowrap">
      <div className="disbg text-white w-full sm:w-[18vw] p-6">
        <h1 className="text-3xl text-center font-semibold">Flash Sale</h1>
        <p className="my-3 text-center">
          Up to 50% OFF
        </p>
        <div className="text-2xl pb-4 text-center text-red-500 px-2">Shop More Get Larger Discount</div>
        <button className="p-2 w-full rounded-3xl bg-slate-300 text-slate-900 mx-auto">Start now</button>
      </div>
      
        <Discount />
    </div>
    </>
  );
}
export default FlashSales;