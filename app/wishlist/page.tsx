"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuthModal } from '../comps/auth/AuthModalContext';

interface WishlistItem {
  product_id: number;
  name: string;
  image: string;
  price: number;
  promotion: number;
  hashed_id: string;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const { openLogin } = useAuthModal();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('userSession') || 'null');
    const uid: number | null = session?.id ?? null;
    setUserId(uid);

    const cart: Array<{ id: number }> = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartIds(cart.map(c => c.id));

    if (uid) {
      fetch(`/api/wishlist?user_id=${uid}`)
        .then(r => r.ok ? r.json() : [])
        .then(data => { setItems(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      // Not logged in — show localStorage wishlist IDs as a prompt
      setLoading(false);
    }
  }, []);

  const removeFromWishlist = async (productId: number) => {
    setItems(prev => prev.filter(i => i.product_id !== productId));
    // Update localStorage
    const wl: number[] = JSON.parse(localStorage.getItem('wishlist') || '[]');
    localStorage.setItem('wishlist', JSON.stringify(wl.filter(id => id !== productId)));
    window.dispatchEvent(new StorageEvent('storage', { key: 'wishlist' }));

    if (userId) {
      await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id: productId }),
      }).catch(() => {});
    }
  };

  const addToCart = (item: WishlistItem) => {
    const cart: Array<{ id: number; name: string; image: string; price: number; amount: number }> =
      JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex(c => c.id === item.product_id);
    if (idx !== -1) {
      cart[idx].amount += 1;
    } else {
      cart.push({ id: item.product_id, name: item.name, image: item.image, price: item.price, amount: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
    setCartIds(prev => [...new Set([...prev, item.product_id])]);

    if (userId) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id: item.product_id, quantity: 1 }),
      }).catch(() => {});
    }
  };

  if (!userId && !loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
          <i className="bi bi-heart text-red-300 text-4xl"></i>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Log in to view your wishlist</h2>
        <p className="text-gray-400 text-[14px] mb-6">
          Save your favourite items and come back to them anytime.
        </p>
        <button
          onClick={() => openLogin(() => {
            const session = JSON.parse(localStorage.getItem('userSession') || 'null');
            if (!session?.id) return;
            const uid: number = session.id;
            setUserId(uid);
            setLoading(true);
            fetch(`/api/wishlist?user_id=${uid}`)
              .then(r => r.ok ? r.json() : [])
              .then(data => { setItems(data); setLoading(false); })
              .catch(() => setLoading(false));
          })}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-full text-[14px] transition-colors"
        >
          Log in <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">My Wishlist</h1>
          {!loading && (
            <span className="bg-orange-100 text-orange-600 text-[12px] font-bold px-2.5 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        <Link href="/products" className="text-[13px] text-orange-600 hover:text-orange-700 font-medium transition-colors">
          Continue browsing <i className="bi bi-arrow-right ml-1"></i>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                <div className="h-8 bg-gray-100 rounded-xl mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <i className="bi bi-heart text-red-200 text-5xl"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-400 text-[14px] mb-6 max-w-xs">
            Browse our products and click the heart icon to save items you love.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-full text-[14px] transition-colors"
          >
            Browse products <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map(item => {
            const discounted = item.promotion > 0
              ? item.price - (item.price * item.promotion / 100)
              : item.price;
            const inCart = cartIds.includes(item.product_id);

            return (
              <div key={item.product_id} className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col relative">
                {/* Remove from wishlist */}
                <button
                  onClick={() => removeFromWishlist(item.product_id)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <i className="bi bi-heart-fill text-[11px]"></i>
                </button>

                {/* Discount badge */}
                {item.promotion > 0 && (
                  <span className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                    -{item.promotion}%
                  </span>
                )}

                {/* Image */}
                <Link href={`/products/${item.hashed_id}`} className="block">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image
                      src={item.image || '/imgs/logo.ico'}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  <Link href={`/products/${item.hashed_id}`}>
                    <p className="text-[12px] text-gray-700 font-medium line-clamp-2 leading-snug hover:text-orange-600 transition-colors mb-2">
                      {item.name}
                    </p>
                  </Link>

                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-[15px] font-extrabold text-orange-600">{fmt(discounted)}</span>
                    <span className="text-[10px] text-gray-400 font-medium">RWF</span>
                    {item.promotion > 0 && (
                      <span className="text-[10px] text-gray-400 line-through ml-auto">{fmt(item.price)} RWF</span>
                    )}
                  </div>

                  <button
                    onClick={() => !inCart && addToCart(item)}
                    className={`mt-auto w-full py-2 rounded-xl text-[11px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      inCart
                        ? 'bg-orange-500 text-white cursor-default'
                        : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-500 hover:text-white hover:border-transparent'
                    }`}
                  >
                    <i className={`bi text-[12px] ${inCart ? 'bi-check2' : 'bi-cart-plus'}`}></i>
                    {inCart ? 'In Cart' : 'Add to cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
