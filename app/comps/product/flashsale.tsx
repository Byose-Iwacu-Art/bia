"use client";
import { useEffect, useState } from "react";
import Preloader from "../forms/PreDivLoader";
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FlashCard } from "./card";

interface Product {
  id: number;
  name: string;
  discount: number;
  image: string;
  hashed_id: string;
  price: string;
  promotion: number;
}

const FlashSales =  () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [slidesPerView, setSlidesPerView] = useState(5);

  useEffect(() => {
      fetch("/api/products/discount")
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Failed to fetch discount");
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

  // Adjust slides per view based on screen size
useEffect(() => {
  const handleResize = () => {
    setSlidesPerView(window.innerWidth < 640 ? 2 : 5);
  };

  // Set initial slidesPerView value
  handleResize();

  // Listen for window resize
  window.addEventListener("resize", handleResize);

  // Cleanup event listener on component unmount
  return () => window.removeEventListener("resize", handleResize);
}, []);
  if (loading) {
      return <Preloader />;
  }

  if (error) {
      return <div className="text-center text-red-500 py-6">{error}</div>
  }
  if(products.length <= 0){
    return <div></div>
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
      <div className="w-full sm:w-[75vw] h-max">
        

        <Swiper
        spaceBetween={0}
        slidesPerView={slidesPerView}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full rounded-xl sm:rounded-none"
        modules={[Autoplay]} 
        speed={2000}
      >
            {products.map((item) => (
              <SwiperSlide key={item.id} className="relative w-full h-full border-b border-slate-50">
                <>
                <FlashCard
                 id={item.id}
                 hashed_id={item.hashed_id}
                 price={item.price}
                 name={item.name}
                 image={item.image}
                 details=""
                 color=""
                 size={item.discount}
                 promotion={item.promotion}
                /></>
              </SwiperSlide>
            ))}
        </Swiper>
        </div>
        
    </div>
    </>
  );
}
export default FlashSales;