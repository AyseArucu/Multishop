"use client";

import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { FiTrash2, FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useEffect, useState } from 'react';

export default function FavoritesPage() {
  const { items, toggleFavorite } = useFavoriteStore();
  const addItem = useCartStore(state => state.addItem);
  const [mounted, setMounted] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const maxPage = Math.ceil(favoriteProducts.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [favoriteProducts, currentPage]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      setLoading(true);
      fetch(`/api/products?ids=${items.join(',')}`)
        .then(res => res.json())
        .then(data => {
          if (data.products) {
            setFavoriteProducts(data.products);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setFavoriteProducts([]);
    }
  }, [items]);

  if (!mounted) return <div className="min-h-[60vh]"></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Favorilerim</h1>
      
      {favoriteProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 text-4xl">♥</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Favori Ürününüz Yok</h2>
          <p className="text-gray-500 mb-8">Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.</p>
          <Link href="/products" className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all">
            Ürünleri Keşfet
          </Link>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {favoriteProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group bg-white rounded-[2rem] border border-gray-100/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-primary-100 transition-all duration-500 overflow-hidden flex flex-col relative h-full hover:-translate-y-1">
              {/* Image Area */}
              <div className="relative aspect-[4/5] bg-slate-50 flex items-center justify-center p-8 overflow-hidden">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span 
                      className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-sm shadow-sm"
                      style={{ backgroundColor: '#ec4899', color: '#ffffff' }}
                    >
                      %{(Math.round((product.originalPrice - product.price) / product.originalPrice * 100))} İNDİRİM
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-pink-500 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
                      YENİ SEZON
                    </span>
                  )}
                </div>
                
                {/* Favorite Button (Filled for Favorites) */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-5 right-5 z-20 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-pink-500 hover:text-gray-400 hover:scale-110 active:scale-95 transition-all duration-300 border border-white/50"
                >
                  <FiHeart size={18} className="fill-current" />
                </button>

                {product.images && product.images.length > 0 ? (
                  <>
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 ease-out absolute inset-0 group-hover:opacity-0 group-hover:scale-105" />
                    {product.images[1] ? (
                       <img src={product.images[1]} alt={product.title} className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 ease-out absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105" />
                    ) : (
                       <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 ease-out absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105" />
                    )}
                  </>
                ) : (
                   <div className="text-gray-300">Görsel Yok</div>
                )}

                {/* View Overlay */}
                <div className="absolute inset-0 bg-slate-900/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 pointer-events-none">
                  <div className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 shadow-xl scale-50 group-hover:scale-100 transition-transform duration-500 delay-75">
                    <FiEye size={20} />
                  </div>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-6 flex flex-col flex-grow bg-white z-10">
                <div className="text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-widest">{product.category?.name || "Genel"}</div>
                <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                  {product.title}
                </h3>
                
                <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    {product.originalPrice && product.originalPrice > product.price && (
                       <span className="text-[12px] text-gray-400 line-through font-medium mb-0.5">{product.originalPrice} ₺</span>
                    )}
                    <span className="text-xl font-black text-slate-900 tracking-tight">{product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addItem({
                        id: product.id,
                        name: product.title,
                        price: product.price,
                        image: product.images?.[0] || '',
                        quantity: 1,
                        variant: 'M' // Optional fallback
                      });
                    }}
                    className="w-10 h-10 rounded-full bg-slate-900 border border-slate-900 flex items-center justify-center text-white hover:bg-pink-500 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/25 transition-all shrink-0"
                  >
                    <FiShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {Math.ceil(favoriteProducts.length / ITEMS_PER_PAGE) > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Önceki
            </button>
            {Array.from({ length: Math.ceil(favoriteProducts.length / ITEMS_PER_PAGE) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition font-bold ${
                  currentPage === idx + 1 
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 border border-pink-500' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(favoriteProducts.length / ITEMS_PER_PAGE), p + 1))}
              disabled={currentPage === Math.ceil(favoriteProducts.length / ITEMS_PER_PAGE)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Sonraki
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
