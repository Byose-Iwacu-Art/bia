"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
// Define the props interface
interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: string | number;
  size: string | number;
  color: string;
  details: string;
  hashed_id: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, image, size, color, price, hashed_id }) => {
  const [isInCart, setIsInCart] = useState(false);

  // Check if the item is in the cart
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === id);
    if (existingItem) {
      setIsInCart(true);
    }
  }, [id]);
  // Function to handle adding item to cart in local storage
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex((item: any) => item.id === id);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].amount += 1;
    } else {
      const newItem = { id, name, image, price, color, size, amount: 1 };
      cart.push(newItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setIsInCart(true); // Update the state to reflect the item is added
  };

  
  return (
    <div 
     className="w-full h-max py-1 sm:py-2 md:py-3 lg:py-3 px-2 rounded-sm overflow-hidden shadow-xs bg-white text-center mx-auto sm:mx-auto md:mx-auto lg:mx-1 my-2 hover:shadow-xl"
    >
      <div className="w-full h-[30vh] p-1 cursor-pointer  rounded-md" onClick={() => window.location.assign(`/products/${hashed_id}`)}>
          <img className="w-full h-full object-cover" src={image || "/no_image.jpeg"} alt={""} />
      </div>
     
      <div className="px-3 pt-2 pb-1 flex flex-col">
        <Link href={`/products/${hashed_id}`} onClick={() => window.location.assign(`/products/${hashed_id}`)}>
          <div className="text-base text-gray-900">{name}</div>
        </Link>

        <div className={`flex flex-col justify-between`}>
          <span className="font-bold text-lg">
            <span className="text-xs">RWF</span>{new Intl.NumberFormat("en-US").format(Number(price))} 
          </span>

          <button
            className={`flex flex-nowrap mx-auto text-slate-400 my-2 px-4 py-[4px] border rounded-md text-sm ${
              isInCart ? "text-white  bg-red-400 cursor-no-drop w-max" : "hover:text-white hover:bg-red-500"
            }`}
            onClick={!isInCart ? addToCart : undefined} // Disable adding if already in the cart
          >
            <span className="mr-1 text-nowrap">{isInCart ? "Added":'Add to cart'}</span>
            <i className={`bi ${isInCart ? "bi-check-sm" : "bi-cart-plus"}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};
const FlashCard: React.FC<ProductCardProps> = ({ id, name, image, size, color, price, hashed_id }) => {
  const [isInCart, setIsInCart] = useState(false);

  const router = useRouter();

  // Check if the item is in the cart
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === id);
    if (existingItem) {
      setIsInCart(true);
    }
  }, [id]);
  // Function to handle adding item to cart in local storage
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex((item: any) => item.id === id);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].amount += 1;
    } else {
      const newItem = { id, name, image, price, color, size, amount: 1 };
      cart.push(newItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setIsInCart(true); // Update the state to reflect the item is added
  };
  const discountPrice = Number(price) - (Number(price) * (Number(size) / 100));
  return (
    <div 
     className="w-[45vw] h-max sm:w-[200px] py-1 sm:py-2 md:py-3 lg:py-3 px-2 rounded-sm overflow-hidden shadow-md bg-white text-center mx-auto sm:mx-auto md:mx-auto lg:mx-1  hover:shadow-xl"
    >
      <div className="w-full h-[30vh] p-1 cursor-pointer  rounded-md" onClick={() => window.location.assign(`/products/${hashed_id}`)}>
          <div className="absolute text-left bg-red-500 text-sm text-white flex items-center p-1 font-medium rounded">{"-"+size+"%"}</div>
          <img className="w-full h-full object-cover" src={image} alt={""} />
      </div>
     
      <div className="px-3 pt-2 pb-1 flex flex-col">
        <Link href={`/products/${hashed_id}`} onClick={() => window.location.assign(`/products/${hashed_id}`)}>
          <div className="text-base text-gray-700">{name}</div>
        </Link>
       
        <div className={`flex flex-col justify-between`}>
          <span className="font-medium text-red-500 text-lg">
            RWF{new Intl.NumberFormat("en-US").format(Number(discountPrice))} 
          </span>

          <button
            className={`flex flex-nowrap mx-auto text-slate-400 my-2 px-4 py-[4px] border rounded-md text-sm ${
              isInCart ? "text-white  bg-red-400 cursor-no-drop w-max" : "hover:text-white hover:bg-red-500"
            }`}
            onClick={!isInCart ? addToCart : undefined} // Disable adding if already in the cart
          >
            <span className="mr-1 text-nowrap">{isInCart ? "Added":'Add to cart'}</span>
            <i className={`bi ${isInCart ? "bi-check-sm" : "bi-cart-plus"}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
export {FlashCard};
