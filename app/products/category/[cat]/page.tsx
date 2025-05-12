"use client";
import { useEffect, useState } from "react";
import ProductList from "@/app/pages/ProductList";
import Preloader from "@/app/comps/forms/PreDivLoader";
import FlashSales from "@/app/comps/product/flashsale";

const decodeUrlText = (url: string) => {
  // Decode special characters like %20 (space), %60 (backtick), etc.
  const decoded = decodeURIComponent(url);

  // Optional: replace backticks (`) with apostrophes (') if needed
  const cleaned = decoded.replace(/`/g, "'");

  // Remove leading slash if present
  return cleaned.replace(/^\/+/, '');
};

export default function Home ({ params }: { params: { cat: string } }) {
    const [loading, setLoading] = useState(false);
    const [contentReady, setContentReady] = useState(false);
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState({
        category: "",
        priceMin: 0,
        priceMax: 500000,
        size: "",
        sortBy: "",
    });
    const [filterShow, setFilterShow] = useState(false);


    const handleFilterShow = () => {
        setFilterShow(true);
    }
    const handleCloseFilterShow = () => {
        setFilterShow(false);
    }

    useEffect(() => {
        setContentReady(true);
    }, []);

    useEffect(() => {
        if (contentReady) setLoading(false);
    }, [contentReady]);

  

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const query = new URLSearchParams({
                    category: filter.category,
                    priceMin: filter.priceMin.toString(),
                    priceMax: filter.priceMax.toString(),
                    size: filter.size,
                    sortBy: filter.sortBy,
                });
                const response = await fetch(`/api/products/cat/${params.cat}?${query}`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [filter]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: value,
        }));
    };
    if (loading) return <div className="h-[90vh] w-[90vw] flex justify-center items-center"><Preloader /></div>;

    return (
        <>
            <head>
                <title>{decodeUrlText(params.cat)}</title>
            </head>
            <div className="px-5 py-3 bg-slate-50">
                <FlashSales />
            </div>
            <div>
                <h1 className="px-5 py-4 font-bold text-lg text-red-400">
                    {decodeUrlText(params.cat)} <i className="bi bi-chevron-right text-xs text-cyan-500"></i>
                </h1>
            </div>
            <div className="w-full h-full flex px-4">
               
                {/* Product List and Sort */}
                <div className="mx-1 w-screen">
                    <div className="w-full">
                        <div className="flex justify-end items-center w-full">
                             {/* Filter Panel */}
                <div className="mx-4 max-w-[250px] z-20">
                    <div className="flex border justify-between p-2 rounded-md cursor-pointer" onClick={() => setFilterShow(!filterShow)}>
                        <h4 className="mr-3">Filter</h4>
                        {filterShow ? (
                            <i onClick={handleCloseFilterShow} className="bi bi-x text-red-500 cursor-pointer font-semibold"></i>
                        ):(
                            <i onClick={handleFilterShow} className="bi bi-filter text-red-500 cursor-pointer font-semibold"></i>
                        )}
                    </div>
                    {filterShow && (
                    <div className="bg-white sm:w-[20vw] border p-3 rounded-lg text-sm sm:grid absolute mt-2 right-4 ">
                        <form>
                            <div>
                                <div className="flex justify-between">
                                    <label htmlFor="price" className="font-semibold">Price</label>
                                    <i className="bi bi-chevron-up"></i>
                                </div>
                                <div className="dropdown p-2">
                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <label htmlFor="priceMin" className="font-bold my-2">Min</label>
                                            <input
                                                type="number"
                                                name="priceMin"
                                                placeholder="0.00"
                                                className="border p-2 text-center outline-red-200 w-20 rounded-md bg-slate-50"
                                                onChange={handleFilterChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="priceMax" className="font-bold my-2">Max</label>
                                            <input
                                                type="number"
                                                name="priceMax"
                                                placeholder="500,000"
                                                className="border p-2 text-center outline-red-200 w-[90px] rounded-md bg-slate-50"
                                                onChange={handleFilterChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Size filter */}
                            <div>
                                <div className="flex justify-between py-2">
                                    <label htmlFor="size" className="font-semibold">Size</label>
                                    <i className="bi bi-chevron-up"></i>
                                </div>
                                <div className="dropdown p-2 max-h-[20vh] overflow-hidden overflow-y-auto">
                                    <div className="flex flex-wrap">
                                    {["Any","Newborn", "0-3 Months", "3-6 Months", "6-12 Months", "12-18 Months", 
                                      "18-24 Months", "2T", "3T", "4T", "5-6 Years", 
                                      "7-8 Years", "9-10 Years", "11-12 Years", "XS", "S", 
                                      "M", "L", "XL", "XXL", "XXXL", "4XL", 
                                      "35", "36", "37", "38", "39", "40", 
                                      "41", "42", "43", "44", "45", "46", "47"
                                    ].map((item, index) => (
                                        <div 
                                        key={index} 
                                        className={`py-1 px-3 m-1 border rounded hover:bg-slate-100 ${filter.size === item ? 'border-red-500' : ''}`} 
                                        title={item} 
                                        onClick={() => setFilter({...filter, size: item})}
                                        >
                                          {item}
                                        </div>
                                      ))}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
                </div>
            
                
                            <div className="flex border px-2 py-2 justify-self-end text-sm rounded-md"> 
                                <label htmlFor="sortBy" className="text-slate-300 ">Sort by: </label>
                                <select name="sortBy" className="max-w-[50px] outline-none ml-2 font-semibold" onChange={handleFilterChange}>
                                    <option value="">Any</option>
                                    <option value="popular">Popular</option>
                                    <option value="reviewed">Most Reviewed</option>
                                    <option value="new">New</option>
                                </select>
                            </div>
                        </div>
                        {products.length > 0 ? (
                            <ProductList products={products} itemsPerPage={42} sortPage=""/> 
                        ) : (
                         <div className="h-[30vh] w-[30vw] text-red-500 flex justify-center items-center">No products found</div>
                        )}
                    </div>
                </div>
            </div>
<style jsx global>{`
    .active {
        border: 1px solid #fca5a5;
    }

    /* Custom scrollbar styles */
    ::-webkit-scrollbar {
        width: 6px; /* Width of the scrollbar */
    }

    ::-webkit-scrollbar-thumb {
        background-color: #cbd5e1; /* Color of the scrollbar thumb */
        border-radius: 5px; /* Roundness of the scrollbar thumb */
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #ef4444; /* Color of the scrollbar thumb on hover */
    }

    ::-webkit-scrollbar-track {
        background: transparent; /* Background color of the scrollbar track */
    }
`}</style>

        </>
    );
};