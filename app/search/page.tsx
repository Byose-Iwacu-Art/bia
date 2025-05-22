"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Preloader from "../comps/forms/PreDivLoader";
import ProductCard from "../comps/product/card";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  otherImages: string[];
  rating: number;
  sold: number;
  colors: string[];
  delivery_days: number;
  hashed_id: string;
  promotion: number;
}

const Search = () => {
  const [products, setProducts] = useState<Product[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");
  // Fetch products based on the search query parameter (?q=)
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get("q");

      if (!query) {
        setError("No search query provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/search?q=${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch search results.");
        }

        const data = await response.json();
        setProducts(data.products); // Use the API's products array
        setLoading(false);
      } catch (err: any) {
        setError("Failed to load search results: " + err.message);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, []);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center text-gray-500 py-20 text-xl">No results found for {'"'}<b>{query}</b>{'"'}.</div>;
  }

  return (
    <>
     <head><title>Search Results </title></head>
      {products.length > 0 && (
        <>
      <div className="results text-slate-500 px-3 py-3">
      {products.length+" "} Results for {'"'}<b>{query}</b>{'"'} <br />

     </div>
        <div className="flex flex-wrap">
        {products.map((item, index) => (
            <ProductCard 
            key = {item.id}
            id = {item.id}
            name={item.name} 
            details={item.description}
            price={item.price}
            image={item.image}
            color=""
            size=""
            hashed_id={item.hashed_id}
            promotion={item.promotion}
            />
        ))}
    </div>
    </>
      )}
  
    </>
  );
}
export default Search;