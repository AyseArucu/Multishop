"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiArrowRight, FiEye, FiShoppingCart } from 'react-icons/fi';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useCartStore } from '@/store/useCartStore';
import EditableText from '@/components/shop/EditableText';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { motion } from 'framer-motion';

export default function NewArrivalsSection({ pageSettings }: { pageSettings: any }) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const addItem = useCartStore(state => state.addItem);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products.slice(0, 10)); 
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    toggleFavorite(id);
  };

  if (loading || products.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/40 backdrop-blur-sm py-32 border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]"
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <EditableText
            as="h2"
            settingKey="homeNewArrivalsTitle"
            defaultValue={pageSettings.homeNewArrivalsTitle || "Yeni Gelenler"}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
          />
          <EditableText
            as="p"
            settingKey="homeNewArrivalsDesc"
            defaultValue={pageSettings.homeNewArrivalsDesc || "Mağazamıza eklenen en son ürünleri keşfedin."}
            className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed"
            multiline
          />
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          breakpoints={{
            320: { slidesPerView: 1.5, spaceBetween: 16 },
            640: { slidesPerView: 2.5, spaceBetween: 24 },
            1024: { slidesPerView: 5, spaceBetween: 32 }
          }}
          className="w-full pb-12"
        >
          {products.map((product: any, index: number) => (
            <SwiperSlide key={product.id} className="pb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="h-full"
              >
                <Link href={`/product/${product.id}`} className="group bg-white rounded-[2rem] border border-gray-100/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-primary-100 transition-all duration-500 overflow-hidden flex flex-col relative block h-full hover:-translate-y-1">
                  {/* Image Area */}
                  <div className="relative aspect-[4/5] bg-slate-50 flex items-center justify-center p-8 overflow-hidden">
                    {/* Badges */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span 
                        className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-sm shadow-sm"
                        style={{ 
                          backgroundColor: pageSettings?.productCardDiscountBg || '#ec4899', 
                          color: pageSettings?.productCardDiscountText || '#ffffff' 
                        }}
                      >
                        %{(Math.round((product.originalPrice - product.price) / product.originalPrice * 100))} İNDİRİM
                      </span>
                    )}
                    {product.isNew && (
                      <span 
                        className="bg-pink-500 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-sm shadow-sm"
                              
                      >
                        YENİ SEZON
                      </span>
                    )}
                  </div>
                    
                    {/* Favorite Button */}
                    <button 
                      onClick={(e) => handleToggleFavorite(e, product.id)}
                      className="absolute top-5 right-5 z-20 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-gray-400 hover:text-pink-500 hover:scale-110 active:scale-95 transition-all duration-300 border border-white/50"
                    >
                      <FiHeart size={18} className={isFavorite(product.id) ? "fill-accent-500 text-accent-500" : ""} />
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
                        <span className="text-xl font-black text-slate-900 tracking-tight">{product.price} ₺</span>
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
                            variant: 'M'
                          });
                        }}
                        className="w-10 h-10 rounded-full bg-slate-900 border border-slate-900 flex items-center justify-center text-white hover:bg-pink-500 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/25 transition-all shrink-0"
                      >
                        <FiShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.section>
  );
}
