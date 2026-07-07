"use client";

import Link from 'next/link';
import { DUMMY_PRODUCTS } from '@/lib/dummyData';
import { useCartStore } from '@/store/useCartStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { FiHeart } from 'react-icons/fi';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const addItem = useCartStore(state => state.addItem);
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  
  // Basic mock mapping
  const categoryMap: Record<string, string> = {
    'giyim': 'Giyim',
    'elektronik': 'Elektronik',
    'kozmetik': 'Kozmetik',
    'ev-yasam': 'Ev & Yaşam',
    'kadin': 'Giyim',
    'erkek': 'Giyim',
    'ev': 'Ev & Yaşam',
  };

  const mappedCat = categoryMap[params.slug.toLowerCase()] || 'Giyim';
  const filteredProducts = DUMMY_PRODUCTS.filter(p => p.category === mappedCat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">{categoryName} Ürünleri</h1>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Bu kategoride henüz ürün bulunmuyor.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {filteredProducts.map((product) => (
               <Link href={`/product/${product.id}`} key={product.id} className="group bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 overflow-hidden flex flex-col">
                  <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                     <button 
                        onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
                     >
                        <FiHeart className={isFavorite(product.id) ? "fill-red-500 text-red-500" : ""} />
                     </button>
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20">
                        <button 
                           onClick={(e) => {
                             e.preventDefault();
                             addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, variant: 'M' });
                           }}
                           className="w-full bg-slate-900/90 backdrop-blur-sm hover:bg-primary-600 text-white font-semibold py-3 rounded-xl shadow-lg"
                        >
                           Sepete Ekle
                        </button>
                     </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                     <div className="text-xs text-primary-600 font-bold mb-2 uppercase tracking-wider">{product.category}</div>
                     <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-pink-600 transition">{product.name}</h3>
                     <div className="mt-auto flex items-end justify-between">
                        <span className="text-xl font-extrabold text-slate-900">{product.price} ₺</span>
                     </div>
                  </div>
               </Link>
             ))}
        </div>
      )}
    </div>
  );
}
