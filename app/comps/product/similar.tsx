import Link from "next/link";
import React, { useEffect, useState } from "react";
import Preloader from "../forms/PreDivLoader";
import ProductList from "@/app/pages/ProductList";
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    orders: number;
    status: string;
    stock: number;
    sizes: string;
    colors: string;
    image: string;
    description: string;
    hashed_id: string;
    promotion: number;
  }

const Similar = ({ id }: { id: string }) => {
   
    const [products, setProducts] = useState<Product[]>([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // Fetch similar products when `product.category` is available
    useEffect(() => {
      
        const fetchSimilarProducts = async () => {
            if (!id) {
                setError("Error occured");
                return;
            }
        
            try {
                let response = await fetch(`/api/products/similar/${id}`);
                if (!response.ok) {
                    throw new Error('--');
                }
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err: any) {
                setError('Network error!');
                setLoading(false);
            }
        };
        

        fetchSimilarProducts();
    }, [id]); // Only fetch similar products when `product` is available

    if (loading) {
        return <Preloader />; // Ensure to return loading state component
    }

    if (error) {
        return <div className="text-center text-red-500 py-6">{error}</div>;
    }
    
    return (
        <>
            <h1 className="font-semibold text-2xl text-slate-500 pb-3">Similar products</h1>
            <ProductList products={products} itemsPerPage={18} sortPage=""/>
        </>
    );
}
export default Similar;


