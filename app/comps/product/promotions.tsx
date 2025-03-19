"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Preloader from "../forms/PreDivLoader";
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { redirect } from "next/navigation";

interface Product {
    id: number;
    name: string;
    discount: number;
    image: string;
    hashed_id: string;
}

const Promotions = () => {
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

    if(products.length <= 0){
        return <div></div>
    }

    return (
        <>
        

        <Swiper
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-[50vh] sm:h-[70vh]"
        modules={[Autoplay]} 
        speed={2000}
      >
            {products.map((item) => (
              <SwiperSlide key={item.id} className="disbg relative w-full h-screen">
                <div key={item.id} className="flex items-center h-full w-full bg-opacity-90 transition-all hover:shadow-sm">
                    <div className="text-center px-6 lg:px-10 w-[70%]">
                        <h1 className=" text-white leading-[30px] sm:leading-[60px] mb-6">
                          <p className="text-xl sm:text-6xl capitalize my-5 text-slate-300"> Shop With Largest Discount Ever Now</p>
                            <span className="text-2xl sm:text-5xl text-green-400">{item.discount}% OFF</span> DISCOUNT
                        </h1>
                        <Link href={`/products/${item.hashed_id}`} onClick={() => redirect(`/products/${item.hashed_id}`)} className="bg-red-500 bg-opacity-75 px-3 sm:px-6 md:px-10 rounded-3xl py-2 md:py-3 hover:bg-red-400 text-white text-nowrap">
                            Shop now <i className="bi bi-box-arrow-right ml-2 md:ml-3"></i>
                        </Link>
                    </div>
                    <div className="h-full w-full">
                        <img src={item.image} alt="category" className="w-full h-full object-contain rounded-r-lg" />
                    </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        </>
    );
};

export default Promotions;
