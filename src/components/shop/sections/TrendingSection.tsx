"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiArrowRight, FiStar, FiEye, FiShoppingCart } from 'react-icons/fi';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useCartStore } from '@/store/useCartStore';
import EditableText from '@/components/shop/EditableText';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { motion } from 'framer-motion';

export default function TrendingSection({ pageSettings }: { pageSettings: any }) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const addItem = useCartStore(state => state.addItem);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          const shuffled = [...data.products].sort(() => 0.5 - Math.random());
          setProducts(shuffled.slice(0, 10));
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
        <div className="text-center mb-20">
          <EditableText
            as="h2"
            settingKey="homeTrendingTitle"
            defaultValue={pageSettings.homeTrendingTitle || "Güncel Ürünler"}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
          />
          <EditableText
            as="p"
            settingKey="homeTrendingDesc"
            defaultValue={pageSettings.homeTrendingDesc || "Sizin için seçtiğimiz, sezonun öne çıkan ürünleri."}
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
            1024: { slidesPerView: 4, spaceBetween: 32 },
            1280: { slidesPerView: 5, spaceBetween: 40 }
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
                <Link href={`/product/${product.id}`} className="group flex flex-col relative w-full transition-all duration-300">
                  
                  {/* Image Area */}
                  <div className="relative aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 items-start">
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
                      className="absolute top-3 right-3 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 hover:text-pink-500 hover:scale-110 active:scale-95 transition-all duration-300"
                    >
                      <FiHeart size={16} className={isFavorite(product.id) ? "fill-current text-pink-500" : ""} />
                    </button>

                    {/* Add to Cart Button */}
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
                      className="absolute bottom-3 right-3 z-20 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center shadow-md text-white hover:bg-pink-500 hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    >
                      <FiShoppingCart size={14} />
                    </button>

                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    ) : (
                      <div className="text-gray-300">Görsel Yok</div>
                    )}
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex flex-col items-center text-center px-2">
                    <h3 className="text-[14px] font-bold text-slate-800 leading-snug mb-1 group-hover:text-pink-600 transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-yellow-400 mb-2">
                      <FiStar className="fill-current" size={12} />
                      <FiStar className="fill-current" size={12} />
                      <FiStar className="fill-current" size={12} />
                      <FiStar className="fill-current" size={12} />
                      <FiStar className="fill-current" size={12} />
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <>
                          <span className="text-[13px] text-slate-400 line-through font-medium">{product.originalPrice} ₺</span>
                          <span className="text-[15px] font-black text-primary-600">{product.price} ₺</span>
                        </>
                      ) : (
                        <span className="text-[15px] font-black text-slate-900">{product.price} ₺</span>
                      )}
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
