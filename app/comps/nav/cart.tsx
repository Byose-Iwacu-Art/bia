"use client";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  amount: number;
  image: string;
}

interface CartDropdownProps {
  setCartItem: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onClose: () => void; 
}

const CartDropdown: React.FC<CartDropdownProps> = ({setCartItem, onClose }) => {
  // Calculate the total cart amount globally
  // Initialize cartItems from localStorage or set it as an empty array
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCartItems = localStorage.getItem('cart');
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    }
    return [];
  });
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.amount, 0).toFixed(2);
  };

  // Sync cart items with localStorage whenever the cartItems state changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to remove an item from the cart based on its id
  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    setCartItem(updatedCart);
  };

  // Function to update the amount of a specific item
  const updateAmount = (id: number, amount: number) => {
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, amount: Math.max(1, amount) } : item
    );
    setCartItems(updatedCart);
    setCartItem(updatedCart);
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]); // Clear the cartItems array
    setCartItem([]);
    localStorage.removeItem('cart'); // Clear from localStorage
  };

  const totalPrice = calculateTotal();

  return (
    <div className="py-5 px-5">
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
           <div className='flex justify-between items-center border-b'>
              <h4 className='text-lg font-medium'><i className="bi bi-cart-plus mr-1"></i> Your cart</h4>
              <button
              className="text-red-500"
              onClick={clearCart}
            >
              Clear
            </button>
            </div>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
            
            
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between space-x-4">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                </div>

                <div className="flex-1">
                  <h4 className="text-gray-700 font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Intl.NumberFormat('en-US').format(Number(item.price))} RWF
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition"
                      onClick={() => updateAmount(item.id, item.amount - 1)}
                    >
                      -
                    </button>
                    <span className="text-gray-700">{item.amount}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition"
                      onClick={() => updateAmount(item.id, item.amount + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-red-500 hover:text-red-600 transition"
                    onClick={() => removeItem(item.id)}
                  >
                    <i className="bi bi-trash text-lg"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-gray-700 font-semibold">
              <span>Total:</span>
              <span>
                {new Intl.NumberFormat('en-US').format(Number(totalPrice))} RWF
              </span>
            </div>
          </div>

          <div
            className="mt-3 w-full bg-red-400 py-2 text-center text-white rounded hover:bg-red-500 transition"
          >
            <Link href="/checkout"  className=" w-[100%]" onClick={() =>{onClose(); redirect("/heckout") }}>
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDropdown;
