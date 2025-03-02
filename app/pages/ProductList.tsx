import React, { useState } from "react";
import ProductCard from "../comps/product/card";
import Preloader from "../comps/forms/PreDivLoader";

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
}

interface ProductListProps {
  products: Product[]; // Accept products as a prop
  itemsPerPage: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!products.length) {
    return <Preloader />; // Show preloader if no products are passed
  }

  // Calculate total pages
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Get products for the current page
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle pagination navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Render current page products */}
      <div className="flex flex-wrap justify-evenly gap-1">
        {currentProducts.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            details={item.description}
            price={item.price}
            size={item.sizes}
            color={item.colors}
            image={item.image}
            hashed_id={item.hashed_id}
          />
        ))}
      </div>

     {/* Pagination Controls */}
<div className="flex justify-center items-center space-x-2 mt-4">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
      currentPage === 1
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-white text-gray-700 hover:bg-gray-100 hover:text-black"
    }`}
  >
    Previous
  </button>

  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index + 1}
      className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
        currentPage === index + 1
          ? "bg-red-400 text-white border-red-500"
          : "bg-white text-gray-700 hover:bg-gray-100 hover:text-black"
      }`}
      onClick={() => handlePageChange(index + 1)}
    >
      {index + 1}
    </button>
  ))}

  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
      currentPage === totalPages
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-white text-gray-700 hover:bg-gray-100 hover:text-black"
    }`}
  >
    Next
  </button>
</div>

    </>
  );
};

export default ProductList;
