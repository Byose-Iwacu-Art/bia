"use client";
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState, useCallback } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  amount: number;
  image: string;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  // Load user session + cart on mount
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('userSession') || 'null');
    const uid: number | null = session?.id ?? null;
    setUserId(uid);

    const localCart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

    if (uid) {
      // Fetch DB cart and merge with localStorage
      fetch(`/api/cart?user_id=${uid}`)
        .then(r => r.ok ? r.json() : [])
        .then((dbItems: Array<{ product_id: number; name: string; image: string; price: number; quantity: number }>) => {
          const merged = [...localCart];
          dbItems.forEach(dbItem => {
            const idx = merged.findIndex(l => l.id === dbItem.product_id);
            if (idx !== -1) {
              // DB quantity wins
              merged[idx].amount = dbItem.quantity;
            } else {
              merged.push({
                id: dbItem.product_id,
                name: dbItem.name,
                image: dbItem.image,
                price: Number(dbItem.price),
                amount: dbItem.quantity,
              });
            }
          });
          setCartItems(merged);
          localStorage.setItem('cart', JSON.stringify(merged));
          window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
        })
        .catch(() => setCartItems(localCart));
    } else {
      setCartItems(localCart);
    }
  }, [open]); // re-sync when drawer opens

  // Listen for external cart updates (from product cards)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'cart') {
        setCartItems(JSON.parse(localStorage.getItem('cart') || '[]'));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = useCallback((updated: CartItem[]) => {
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
  }, []);

  const removeItem = (id: number) => {
    const updated = cartItems.filter(item => item.id !== id);
    persist(updated);
    if (userId) {
      fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id: id }),
      }).catch(() => {});
    }
  };

  const updateAmount = (id: number, amount: number) => {
    const qty = Math.max(1, amount);
    const updated = cartItems.map(item => item.id === id ? { ...item, amount: qty } : item);
    persist(updated);
    if (userId) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id: id, quantity: qty }),
      }).catch(() => {});
    }
  };

  const clearCart = () => {
    persist([]);
    localStorage.removeItem('cart');
    if (userId) {
      fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      }).catch(() => {});
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price) * item.amount, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.amount, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <i className="bi bi-cart3 text-white text-xl"></i>
            <span className="text-white font-bold text-[15px]">Your Cart</span>
            {itemCount > 0 && (
              <span className="bg-white/25 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <i className="bi bi-x-lg text-white text-[13px]"></i>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
                <i className="bi bi-cart-x text-orange-300 text-4xl"></i>
              </div>
              <div>
                <p className="text-gray-700 font-semibold text-[15px] mb-1">Your cart is empty</p>
                <p className="text-gray-400 text-[13px]">Add some products to get started</p>
              </div>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-orange-500 text-white rounded-full text-[13px] font-semibold hover:bg-orange-600 transition-colors"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3 px-5 py-4">
                  {/* Image */}
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={item.image || '/imgs/logo.ico'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-800 font-medium line-clamp-2 leading-snug mb-1">
                      {item.name}
                    </p>
                    <p className="text-[12px] text-orange-600 font-bold">
                      {fmt(Number(item.price))} RWF
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateAmount(item.id, item.amount - 1)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-orange-100 hover:text-orange-600 flex items-center justify-center text-gray-600 transition-colors text-[13px] font-bold"
                      >
                        −
                      </button>
                      <span className="text-[13px] font-semibold text-gray-700 w-5 text-center">
                        {item.amount}
                      </span>
                      <button
                        onClick={() => updateAmount(item.id, item.amount + 1)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-orange-100 hover:text-orange-600 flex items-center justify-center text-gray-600 transition-colors text-[13px] font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Right: subtotal + remove */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <i className="bi bi-trash3 text-[13px]"></i>
                    </button>
                    <p className="text-[12px] font-bold text-gray-700">
                      {fmt(Number(item.price) * item.amount)} RWF
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3 flex-shrink-0 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-gray-500">Subtotal ({itemCount} items)</span>
              <span className="text-[16px] font-extrabold text-gray-900">{fmt(subtotal)} RWF</span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-3 rounded-xl text-[14px] transition-all shadow-md shadow-orange-200"
            >
              Proceed to Checkout <i className="bi bi-arrow-right"></i>
            </Link>

            <div className="flex items-center justify-between">
              <button
                onClick={clearCart}
                className="text-[12px] text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear cart
              </button>
              <button
                onClick={onClose}
                className="text-[12px] text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Continue shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
