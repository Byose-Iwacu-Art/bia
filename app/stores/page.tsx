import React from "react";
import StoreCard from "../comps/stores/card";
import Head from "next/head";

const Store = () => {
    return (
        <>
            <Head>
                <title>Shopping Stores - BIARwanda</title>
            </Head>
            <div className="p-3">
                <h1 className="text-3xl text-yellow-600 font-semibold">Our shopping stores</h1>
                {/* Sort content */}
                <div>
                    <div className="viewby flex flex-wrap py-4">
                        <div className="search border px-4 mr-3 mb-3 w-full sm:w-1/4"><input type="search" placeholder="Search store" className="py-3 w-full text-slate-500 outline-none" /></div>
                        <div className="category w-full sm:w-1/4 border px-4 mr-3 mb-3">
                            <select name="sortby" className="py-3 w-full text-slate-500">
                                <option className="p-2 text-slate-700" value="">Choose category</option>
                                <option className="p-2 text-slate-700" value="design">Design</option>
                                <option className="p-2 text-slate-700" value="tailors">Tailoring</option>
                                <option className="p-2 text-slate-700" value="fashion">Fashion</option>
                            </select>
                        </div>
                        <div className="location w-full sm:w-1/4 border px-4 mr-3 mb-3">
                            <select name="" className="py-3 w-full text-slate-500">
                                <option className="p-2 text-slate-700" value="">Choose location</option>
                                <option className="p-2 text-slate-700" value="rw">Rwanda</option>
                                <option className="p-2 text-slate-700" value="ke">Kenya</option>
                                <option className="p-2 text-slate-700" value="ug">Uganda</option>
                            </select>
                        </div>
                        <div className="px-4 py-1 w-full sm:w-1/4 flex items-center mb-3 border">
                            <label htmlFor="sortby" className="text-nowrap mr-2">Sort by:</label>
                            <select name="sortby" className="py-3 w-full text-slate-500">
                                <option className="p-2 text-slate-700" value="on">Old to new</option>
                                <option className="p-2 text-slate-700" value="no">New to old</option>
                                <option className="p-2 text-slate-700" value="hl">High to low</option>
                                <option className="p-2 text-slate-700" value="lw">Low to high</option>
                                <option className="p-2 text-slate-700" value="za">Z to A</option>
                                <option className="p-2 text-slate-700" value="az">A to Z</option>
                            </select>
                        </div>
                    </div>

                    <div className="stores flex flex-wrap justify-center sm:justify-start">
                        <StoreCard 
                            name="Bia Musanze"
                            reviews={10}
                            tel={250781121117}
                            location="Kigali, Musanze"
                            id={1}
                            products={10}
                            logo="/imgs/logo.ico"
                            image="/imgs/bgslide1.jpg"
                        />
                        <StoreCard 
                            name="Bia Musanze"
                            reviews={10}
                            tel={250781121117}
                            location="Kigali, Musanze"
                            id={1}
                            products={10}
                            logo="/imgs/logo.ico"
                            image="/imgs/bgslide1.jpg"
                        />
                        <StoreCard 
                            name="Bia Musanze"
                            reviews={10}
                            tel={250781121117}
                            location="Kigali, Musanze"
                            id={1}
                            products={10}
                            logo="/imgs/logo.ico"
                            image="/imgs/bgslide1.jpg"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Store;
