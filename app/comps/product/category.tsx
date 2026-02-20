"use client";
import React from 'react';
import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Category {
  id: number;
  cat_name: string;
  avatar: string;
  products: number;
}

const Category: React.FC = () => {
  const [categoriez, setCategoriez] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    fetch(`/api/products/category/${'any'}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch categories");
        return response.json();
      })
      .then((data) => { setCategoriez(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  if (error) {
    return <div className="text-center text-red-500 py-6 text-[13px]">Failed to load categories.</div>;
  }

  return (
    <>
      {/* Feature chips */}
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

      {/* Section heading */}
      <div className="text-center my-7 w-max text-slate-500 mx-auto">
        <h1 className="text-lg border-b border-slate-200 py-2">Shop by category</h1>
      </div>

      {/* Category carousel */}
      <div className="w-full lg:px-1">
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 px-1 py-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse">
                <div className="h-28 bg-gray-200 w-full"></div>
                <div className="h-2.5 bg-gray-200 rounded w-3/4 mt-1 mx-1"></div>
                <div className="h-2 bg-gray-100 rounded w-1/2 mt-0.5 mx-1 mb-1"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative px-10">
            <Swiper
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              slidesPerView={6}
              slidesPerGroup={3}
              spaceBetween={8}
              loop={categoriez.length >= 6}
              modules={[Navigation]}
              navigation={{
                prevEl: '.cat-prev',
                nextEl: '.cat-next',
              }}
              breakpoints={{
                0:    { slidesPerView: 3, slidesPerGroup: 3 },
                640:  { slidesPerView: 4, slidesPerGroup: 3 },
                1024: { slidesPerView: 6, slidesPerGroup: 3 },
              }}
              className="!py-2"
            >
              {categoriez.map((cat, key) => (
                <SwiperSlide key={key}>
                  <Link
                    href={`/products/category/${cat.cat_name}`}
                    className="group block relative h-28 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
                  >
                    <Image
                      src={cat.avatar || '/imgs/logo.ico'}
                      alt={cat.cat_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width:640px) 33vw, (max-width:1024px) 25vw, 16vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-[12px] font-bold truncate leading-tight">{cat.cat_name}</p>
                      <p className="text-white/75 text-[10px]">{cat.products} products</p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Prev arrow */}
            <button
              className="cat-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-colors"
              aria-label="Previous categories"
            >
              <i className="bi bi-chevron-left text-gray-600 text-sm"></i>
            </button>

            {/* Next arrow */}
            <button
              className="cat-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-colors"
              aria-label="Next categories"
            >
              <i className="bi bi-chevron-right text-gray-600 text-sm"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Category;
