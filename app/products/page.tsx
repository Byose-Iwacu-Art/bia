"use client";
import { useEffect, useState } from "react";
import ProductList from "../pages/ProductList";
import Preloader from "../comps/forms/PreDivLoader";
import FlashSales from "../comps/product/flashsale";


interface Category {
    id: number;
    cat_name: string;
    products: number;
}

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [contentReady, setContentReady] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filter, setFilter] = useState({
        category: "",
        priceMin: 0,
        priceMax: 500000,
        size: "",
        sortBy: "",
    });
    const [filterShow, setFilterShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null); // State for active category


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

    // Fetch categories dynamically
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/products/category");
                const data = await response.json();
                setCategories(data); // Directly set the fetched data as categories
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const query = new URLSearchParams({
                    category: filter.category,
                    priceMin: filter.priceMin.toString(),
                    priceMax: filter.priceMax.toString(),
                    size: filter.size,
                    sortPage: filter.sortBy,
                });
                const response = await fetch(`/api/products?${query}`);
                const data = await response.json();
                setProducts(data);
                setLoading(false)
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false)
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
        setFilterShow(!filterShow)
    };

    const handleCategoryClick = (category: Category) => {
        setFilter((prev) => ({ ...prev, category: category.cat_name }));
        setSearchTerm(""); // Clear search term after selecting
        setActiveCategoryId(category.id); // Set the clicked category as active
        setFilterShow(!filterShow)
    };

    const filteredCategories = categories.filter((category) =>
        category.cat_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="h-[90vh] w-[90vw] flex justify-center items-center"><Preloader /></div>;

    return (
        <>
            <head>
                <title>Products | Shirts, Trousers, Completes, Dress...</title>
            </head>
            <div className="px-5 py-3 bg-slate-50">
                <FlashSales />
            </div>
            <div>
                <h1 className="px-5 py-4 font-bold text-lg text-red-400">
                    Products <i className="bi bi-chevron-right text-xs text-cyan-500"></i>
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
                                    <label htmlFor="category">Category</label>
                                    <i className="bi bi-chevron-up"></i>
                                </div>
                                <div className="dropdown py-2">
                                    <div>
                                        <div className="flex items-center border px-4 rounded-lg bg-gray-50">
                                            <i className="bi bi-search text-sm text-slate-400"></i>
                                            <input
                                                type="search"
                                                name="category"
                                                placeholder="Search category"
                                                className="bg-transparent py-2 text-sm mx-1 outline-none"
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                value={searchTerm}
                                            />
                                        </div>
                                        <ul className="p-2 max-h-[20vh] overflow-hidden overflow-y-auto">
                                            <li
                                                className={`flex justify-between items-center px-[7px] py-[3px] rounded-md font-medium cursor-pointer my-[2px] hover:bg-slate-50 hover:text-slate-500 ${activeCategoryId === null ? "active" : ""}`}
                                                onClick={() => handleCategoryClick({ id: 0, cat_name: "", products: 0 })}
                                            >
                                                <h1>Any</h1>
                                                {activeCategoryId === null && <i className="bi bi-check text-2xl text-red-500"></i>}
                                            </li>
                                            {filteredCategories.map((category) => (
                                                <li
                                                    key={category.id} // Use category.id as key for uniqueness
                                                    className={`flex justify-between items-center px-[7px] py-[3px] rounded-md font-medium cursor-pointer my-[2px] hover:bg-slate-50 hover:text-slate-500 ${activeCategoryId === category.id ? "active" : ""}`}
                                                    onClick={() => handleCategoryClick(category)}
                                                >
                                                   <h1>{category.cat_name} <span className="text-slate-200 pt-[-10px] ml-1">{category.products}</span></h1>
                                                   {activeCategoryId === category.id && <i className="bi bi-check text-2xl text-red-500"></i>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
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
                            <ProductList products={products} itemsPerPage={38} sortPage=""/> 
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

export default Home;
