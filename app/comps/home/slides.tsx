// pages/index.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { NextPage } from 'next';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { redirect } from 'next/navigation';

const slides = [
  { image: '/imgs/rm/c2-removebg-preview.png', text: 'Discover the Elegance of Rwandan Fashion', description: 'Discover the architecture made by Rwandan on this cloth as the result of culture dress', reference: '/products/category/Women Dress', category: 'Outfits'},
  { image: '/imgs/rm/cat9-removebg-preview.png', text: 'Handcrafted Baskets with a Touch of Tradition', description: 'Discover the architecture made by Rwandan on this clothing', reference: '/products/category/Men Shirts', category: 'Home Made Decoration'},
  { image: '/imgs/rm/d7-removebg-preview.png', text: 'Learn the Art of Tailoring with Us', description: 'Discover the architecture made by Rwandan on this cloth as the result of culture Clothing', reference: 'tailors.kamero.rw', category: 'Tailors Dream College'},
  { image: '/imgs/rm/cat20-removebg-preview.png', text: 'Discover the Elegance of Rwandan Fashions', description: 'Discover the architecture made by Rwandan on this cloth as the result of culture Matts', reference: '/products/category/Table Matt', category: 'Craftsmanship'},
];

const SlideShow: NextPage = () => {
  return (
    <>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-[70vh] sm:h-[80vh]"
        modules={[Autoplay, Pagination]} 
        speed={1000}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.reference} className="slidebg relative w-full h-full">
            <div className='flex flex-col md:flex-row justify-center sm:justify-between items-center px-5 md:px-20'>
              <div className="text w-full px-4 sm:px-auto md:w-3/5 mb-5 md:mb-0 absolute md:sticky">
                <h4 className='py-2 text-sm text-red-500'>{slide.category}</h4>
                <h1 className='text-3xl md:text-6xl font-semibold text-white'>{slide.text}</h1>
                <p className='my-3 md:my-5 text-sm md:text-base text-slate-50'>{slide.description}</p>
                <Link href={slide.reference} onClick={()=> redirect(slide.reference)} className='bg-red-500 bg-opacity-75 px-6 md:px-10 rounded-3xl py-2 md:py-3 hover:bg-red-400 text-white'>
                  Shop now <i className="bi bi-box-arrow-right ml-2 md:ml-3"></i>
                </Link>
              </div>
              <div className="img w-full md:w-auto">
                <Image
                  src={slide.image}
                  alt={`Slide`}
                  width={1920} 
                  height={1080} 
                  className="w-full h-60 md:h-full object-contain"
                  style={{ width: '100%', height: 'calc(92vh - 4rem)' }} 
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
  
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #fff; /* Light color for inactive dots */
          border-radius: 50%;
          width: 10px; /* Size of the dot */
          height: 10px;
          transition: 0.7s;
          opacity: 0.8; /* Slightly transparent */
        }
        .swiper-pagination-bullet-active {
          background-color: #ff5722; /* Color for the active dot */
          opacity: 1; /* Fully opaque */
          width: 40px;
          border-radius: 10px;
        }
      `}</style>
  </>
    
  );
};

export default SlideShow;
