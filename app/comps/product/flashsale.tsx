"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Product {
  id: number;
  name: string;
  discount: number;
  image: string;
  hashed_id: string;
  price: string;
  promotion: number;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));

const FlashSales = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(5);

  useEffect(() => {
    fetch("/api/products/discount")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handle = () => setSlidesPerView(window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 5);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row w-full gap-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm my-6">
      {/* Label panel */}
      <div className="disbg text-white w-full sm:w-[180px] flex-shrink-0 p-6 flex flex-col justify-center items-center text-center">
        <i className="bi bi-fire text-3xl text-orange-400 mb-2"></i>
        <h2 className="text-xl font-extrabold mb-1">Flash Sale</h2>
        <p className="text-white/70 text-[13px] mb-3">Up to 50% OFF</p>
        <p className="text-orange-300 text-[12px] font-semibold">Shop more, save more</p>
      </div>

      {/* Swiper */}
      <div className="flex-1 min-w-0">
        <Swiper
          spaceBetween={8}
          slidesPerView={slidesPerView}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          modules={[Autoplay]}
          speed={1800}
          className="w-full h-full p-3"
        >
          {products.map((item) => {
            const discountedPrice = Number(item.price) - (Number(item.price) * (item.discount || item.promotion) / 100);
            return (
              <SwiperSlide key={item.id} className="h-auto">
                <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col h-full">
                  <Link href={`/products/${item.hashed_id}`}>
                    <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                      <Image
                        src={item.image || '/imgs/logo.ico'}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width:640px) 50vw, 20vw"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        -{item.discount || item.promotion}%
                      </span>
                    </div>
                  </Link>
                  <div className="p-2 flex flex-col flex-1">
                    <Link href={`/products/${item.hashed_id}`}>
                      <p className="text-[11px] text-gray-800 font-medium line-clamp-2 mb-1 hover:text-orange-600 transition-colors">
                        {item.name}
                      </p>
                    </Link>
                    <p className="text-[10px] text-gray-400 line-through">{fmt(Number(item.price))} RWF</p>
                    <p className="text-[12px] font-bold text-orange-600">{fmt(discountedPrice)} RWF</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default FlashSales;
