"use client";

import { useCartStore } from '@/store/useCartStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getDiscount, getFinalPrice, addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const [mounted, setMounted] = useState(false);
  const [discountThreshold, setDiscountThreshold] = useState(2000);
  const [discountRate, setDiscountRate] = useState(10);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) {
        if (data.cartDiscountThreshold) setDiscountThreshold(Number(data.cartDiscountThreshold));
        if (data.cartDiscountRate) setDiscountRate(Number(data.cartDiscountRate));
      }
    }).catch(console.error);
    
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          const shuffled = [...data.products].sort(() => 0.5 - Math.random());
          setRecommendedProducts(shuffled.slice(0, 8));
        }
      })
      .catch(console.error);
      
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-[60vh]"></div>;

  const currentTotal = getTotalPrice();
  const discountAmount = currentTotal >= discountThreshold ? Math.round(currentTotal * (discountRate / 100)) : 0;
  const finalPrice = currentTotal - discountAmount;
  const shippingCost = finalPrice > 1000 ? 0 : 49.90;
  const totalWithShipping = finalPrice + shippingCost;
  
  const remainingForDiscount = Math.max(0, discountThreshold - currentTotal);
  const progressPercent = Math.min(100, (currentTotal / discountThreshold) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Sepetim</h1>
      
      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-4xl">🛒</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Sepetiniz Boş</h2>
          <p className="text-gray-500 mb-8">Sepetinizde henüz ürün bulunmuyor. İhtiyacınız olan ürünleri hemen keşfedin!</p>
          <Link href="/products" className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-[2] space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.variant}-${item.color}`} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
                <div className="w-20 h-28 sm:w-24 sm:h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-1.5">Beden: <span className="font-semibold text-slate-700">{item.variant || 'Standart'}</span> {item.color && <>| Renk: <span className="font-semibold text-slate-700">{item.color}</span></>}</p>
                  <div className="text-lg font-extrabold text-slate-900">{item.price} ₺</div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <button 
                    onClick={() => removeItem(item.id, item.variant, item.color)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <FiTrash2 size={20} />
                  </button>
                  
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variant, item.color)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition"
                    >
                      <FiMinus size={12} />
                    </button>
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-900 bg-white border-x border-gray-200 text-sm">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant, item.color)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1">
            <div className="bg-pink-50 text-slate-900 p-8 rounded-3xl shadow-xl sticky top-24 border border-pink-100">
              <h2 className="text-2xl font-bold mb-6 border-b border-pink-200 pb-4 text-pink-600">Sipariş Özeti</h2>
              
              {/* Discount Progress Bar */}
              <div className="mb-6 bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    {remainingForDiscount > 0 
                      ? <><span className="text-pink-600 font-bold">{remainingForDiscount.toLocaleString('tr-TR')} ₺</span> daha ekleyin, <span className="text-green-600 font-bold">%{discountRate}</span> indirim kazanın!</>
                      : <span className="text-green-600 font-bold">Tebrikler! %{discountRate} İndirim Kazandınız 🎉</span>
                    }
                  </span>
                </div>
                <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${remainingForDiscount === 0 ? 'bg-green-500' : 'bg-pink-500'}`} 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4 mb-6 font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Ürün Toplamı</span>
                  <span className="text-slate-900">{currentTotal.toLocaleString('tr-TR')} ₺</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Sepet İndirimi (%{discountRate})</span>
                    <span>-{discountAmount.toLocaleString('tr-TR')} ₺</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Kargo Ücreti</span>
                  <span className={shippingCost === 0 ? "text-green-600 font-bold" : "text-slate-900"}>
                    {shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toLocaleString('tr-TR')} ₺`}
                  </span>
                </div>
                <div className="border-t border-pink-200 my-4"></div>
                <div className="flex justify-between text-2xl font-black text-pink-600">
                  <span>Toplam</span>
                  <span>{totalWithShipping.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>
              
              <Link href="/checkout" className="w-full block text-center bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg text-lg">
                Sepeti Onayla
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Products */}
      {recommendedProducts && recommendedProducts.length > 0 && (
        <div className="mt-16 border-t border-gray-100 pt-16 w-full">
          <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Bunlar da İlginizi Çekebilir</h2>
          
          <Swiper
            modules={[Navigation]}
            navigation
            breakpoints={{
              320: { slidesPerView: 2.2, spaceBetween: 12 },
              640: { slidesPerView: 2.5, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 }
            }}
            className="w-full pb-8"
          >
            {recommendedProducts.map((sp: any) => (
              <SwiperSlide key={sp.id} className="pb-4">
                <Link href={`/product/${sp.id}`} className="group bg-white rounded-[1.5rem] border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary-200 transition-all duration-300 overflow-hidden flex flex-col relative block h-full">
                  <div className="relative aspect-[4/5] bg-slate-50 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                      {sp.originalPrice && sp.originalPrice > sp.price && (
                        <span className="bg-red-700 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                          %{Math.round((sp.originalPrice - sp.price) / sp.originalPrice * 100)}
                        </span>
                      )}
                      {sp.isNew && <span className="bg-blue-600 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm">YENİ ÜRÜN</span>}
                      {sp.isDiscounted && <span className="bg-orange-500 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm">İNDİRİMLİ</span>}
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleFavorite(sp.id); }}
                      className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:scale-110 transition-all border border-white/50"
                    >
                      <FiHeart size={16} className={isFavorite(sp.id) ? "fill-red-500 text-red-500" : ""} />
                    </button>
                    {/* Add to Cart Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem({
                          id: sp.id,
                          name: sp.title,
                          price: sp.price,
                          image: sp.images?.[0] || '',
                          quantity: 1,
                          variant: 'M'
                        });
                      }}
                      className="absolute bottom-4 right-4 z-20 w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center shadow-lg text-white hover:bg-pink-500 hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    >
                      <FiShoppingCart size={15} />
                    </button>
                    {sp.images && sp.images.length > 0 ? (
                      <>
                        <img src={sp.images[0]} alt={sp.title} className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 ease-out absolute inset-0 group-hover:opacity-0" />
                        {sp.images[1] ? (
                          <img src={sp.images[1]} alt={sp.title} className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 ease-out absolute inset-0 opacity-0 group-hover:opacity-100" />
                        ) : (
                          <img src={sp.images[0]} alt={sp.title} className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 ease-out absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-110" />
                        )}
                      </>
                    ) : (
                       <div className="text-gray-300">Görsel Yok</div>
                    )}
                  </div>
                  <div className="p-5 bg-white flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-900 text-sm mb-2 truncate group-hover:text-pink-600 transition-colors">{sp.title}</h3>
                    <div className="flex flex-col mt-auto">
                       {sp.originalPrice && sp.originalPrice > sp.price && <span className="text-[11px] text-gray-400 line-through font-medium leading-none mb-1">{sp.originalPrice} ₺</span>}
                       <span className="text-lg font-black text-slate-900 tracking-tight leading-none">{sp.price} ₺</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
