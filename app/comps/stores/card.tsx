"use client";

import Link from "next/link";
import React from 'react';

// Define the props interface
interface ProductCardProps {
  name: string;
  image: string;
  location: string;
  reviews: number;
  tel: number;
  id: number;
  products: number;
  logo: string;
}

const StoreCard: React.FC<ProductCardProps> = ({ name, image, location, reviews, tel, id, products, logo }) => {
  return (
    <>
      <div className="relative w-full md:w-[48%] lg:w-[32%] bg-yellow-600 h-[35vh] md:h-[40vh] lg:h-[45vh] m-2 flex rounded-lg pb-1">
        <div className="h-full w-full">
          <img src={image} alt={name} className="w-full h-full object-cover opacity-80 rounded-lg" />
        </div>
        <div className="absolute p-4 sm:p-6 flex flex-col w-full h-full justify-between">
          <div className="w-full flex justify-between items-center">
            <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px] rounded-full bg-slate-100 p-1 md:p-2">
              <img src={logo} alt={`${name} logo`} className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <Link href={`/store/${id}`} className="px-4 md:px-5 py-1 md:py-2 text-xs md:text-sm rounded-lg font-semibold text-slate-200 bg-red-500 hover:bg-red-600">
                Visit
              </Link>
            </div>
          </div>
          <h1 className="font-semibold text-lg md:text-xl my-2 md:my-4 text-black">{name}</h1>
          <div className="text-slate-100 bg-green-600 bg-opacity-30 rounded-3xl w-max flex py-1 px-3 md:px-4 text-xs md:text-base font-semibold">
            <i className="bi bi-telephone mr-1"></i>
            <span>+{tel}</span>
          </div>
          <div className="loc w-max ml-auto flex justify-end py-1 md:py-2 px-3 md:px-5 font-semibold bg-slate-50 bg-opacity-30 text-slate-800">
            <span>{location}</span>
            <i className="bi bi-geo-alt ml-1"></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreCard;
