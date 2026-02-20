"use client";

import Link from 'next/link';
import Image from 'next/image';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

const slides = [
  {
    image: '/imgs/rm/c2-removebg-preview.png',
    text: 'Discover the Elegance of Rwandan Fashion',
    description: 'Handcrafted with pride — experience authentic African style that tells a story.',
    href: '/products',
    category: 'Outfits',
  },
  {
    image: '/imgs/rm/cat9-removebg-preview.png',
    text: 'Handcrafted Baskets with a Touch of Tradition',
    description: 'Woven by skilled artisans, each basket carries the spirit of Rwandan craftsmanship.',
    href: '/products',
    category: 'Home Decoration',
  },
  {
    image: '/imgs/rm/d7-removebg-preview.png',
    text: 'Learn the Art of Tailoring with Us',
    description: 'Join Tailors College and become a leading fashion designer across Africa.',
    href: 'https://tailors.biafricantouch.com',
    category: "Tailors College",
  },
  {
    image: '/imgs/rm/cat20-removebg-preview.png',
    text: 'Beautiful Table Matts from Rwanda',
    description: 'Add authentic African artistry to your home with our handmade matts and decor.',
    href: '/products',
    category: 'Craftsmanship',
  },
];

const SlideShow = () => {
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop={true}
      className="w-full h-[360px] sm:h-[420px] lg:h-[500px] rounded-xl overflow-hidden"
      modules={[Autoplay, Pagination]}
      speed={900}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className="slidebg relative w-full h-full">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.text}
              fill
              className="object-contain object-right-bottom"
              sizes="(max-width: 768px) 100vw, 65vw"
              priority={index === 0}
              loading={index === 0 ? undefined : 'lazy'}
            />
          </div>

          {/* Text overlay */}
          <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 max-w-[60%]">
            <span className="inline-block text-amber-400 text-[12px] font-semibold uppercase tracking-widest mb-2">
              {slide.category}
            </span>
            <h2 className="text-white font-extrabold text-xl sm:text-3xl lg:text-4xl leading-tight mb-3 drop-shadow-md">
              {slide.text}
            </h2>
            <p className="hidden sm:block text-white/80 text-[13px] sm:text-[14px] mb-5 leading-relaxed max-w-xs">
              {slide.description}
            </p>
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-bold px-5 py-2.5 rounded-full text-[13px] transition-all w-fit shadow-lg shadow-orange-500/30"
            >
              Shop now <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </SwiperSlide>
      ))}

      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: rgba(255,255,255,0.6);
          width: 8px;
          height: 8px;
          transition: 0.4s;
        }
        .swiper-pagination-bullet-active {
          background-color: #f97316;
          width: 28px;
          border-radius: 8px;
          opacity: 1;
        }
      `}</style>
    </Swiper>
  );
};

export default SlideShow;
