"use client";
import { useEffect, useState } from 'react';
import Head from "next/head";
import Preloader from "@/app/comps/forms/PreDivLoader";
import Item from "@/app/comps/product/item";
import Similar from "@/app/comps/product/similar";

interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    images: string[];
    rating: number;
    sold: number;
    colors: string[];
    sizes: string;
    delivery_days: number;
    hashed_id: string;
}

// The new way to handle dynamic route params in Next.js 13
export default function ProductDetails({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) return <div className='w-full h-full flex justify-center items-center'><Preloader /></div>;
  if (error) return <p className='p-20 text-red-500 w-full h-full text-center'>{error}</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <>
     <head>
      <title>{product.name}</title>
     </head>
      <Item product={product} /> {/* Passing the product object to the Item component */}
      <div className="bg-white p-7">
        <Similar id={product.id}/>
      </div>
    </>
  );
}
