"use client";

import { FiInstagram, FiChevronRight, FiChevronLeft, FiStar, FiShield } from "react-icons/fi";
import { IoDiamondOutline } from "react-icons/io5";
import { GiLargeDress } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function PreFooterSection({ pageSettings }: { pageSettings?: any }) {
  const defaultReviews = [
    { name: "Selin A.", rating: 5, comment: "Kumaş kalitesi harika, tam bedeninizi alabilirsiniz. Kargo çok hızlıydı!", avatar: "https://i.pravatar.cc/100?img=5" },
    { name: "Ayşe K.", rating: 5, comment: "Elbise tam göründüğü gibi, çok zarif ve şık. Severek kullanıyorum.", avatar: "https://i.pravatar.cc/100?img=9" },
    { name: "Melis T.", rating: 5, comment: "Alışveriş deneyimi çok keyifliydi. Dürüst satıcı, kesinlikle tavsiye ederim.", avatar: "https://i.pravatar.cc/100?img=1" },
    { name: "Zeynep B.", rating: 5, comment: "Harika paketleme ve mükemmel iletişim. Ürünler de bir o kadar güzel.", avatar: "https://i.pravatar.cc/100?img=2" },
  ];

  const instaBgColor = pageSettings?.instaBgColor || "#f8fafc";
  const instaTitleColor = pageSettings?.instaTitleColor || "#1e293b";
  const instaBtnBg = pageSettings?.instaBtnBg || "#ea5a8b";
  const instaBtnTextColor = pageSettings?.instaBtnTextColor || "#ffffff";
  
  const reviewsBgColor = pageSettings?.reviewsBgColor || "#f8fafc";
  const reviewsTitleColor = pageSettings?.reviewsTitleColor || "#1e293b";
  const reviewsIconColor = pageSettings?.reviewsIconColor || "#ea5a8b";

  const newsletterBgColor = pageSettings?.newsletterBgColor || "#f8fafc";
  const newsletterTitleColor = pageSettings?.newsletterTitleColor || "#1e293b";
  const newsletterBtnBg = pageSettings?.newsletterBtnBg || "#ea5a8b";
  const newsletterBtnTextColor = pageSettings?.newsletterBtnTextColor || "#ffffff";

  let reviews = defaultReviews;
  if (pageSettings?.homeReviews) {
    try {
      const parsed = typeof pageSettings.homeReviews === 'string' ? JSON.parse(pageSettings.homeReviews) : pageSettings.homeReviews;
      if (Array.isArray(parsed) && parsed.length > 0) {
        reviews = parsed;
      }
    } catch (e) {
      console.error("Error parsing home reviews", e);
    }
  }

  return (
    <section className="w-full bg-[#f8f9fa] pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 3 Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          
          {/* 1. Instagram */}
          <div className="rounded-[2rem] p-8 flex flex-col justify-between" style={{ backgroundColor: instaBgColor }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm" style={{ color: instaBtnBg }}>
                <FiInstagram size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg" style={{ color: instaTitleColor }}>Instagram'da Biz</h3>
                <p className="text-slate-500 text-sm font-medium">{pageSettings?.instagramHandle || '@neobasic.co'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                {pageSettings?.instagramImage1 ? (
                  <img src={pageSettings.instagramImage1} alt="Insta 1" className="w-full h-full object-cover" />
                ) : (
                  <FiInstagram className="text-gray-300" size={24} />
                )}
              </div>
              <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                {pageSettings?.instagramImage2 ? (
                  <img src={pageSettings.instagramImage2} alt="Insta 2" className="w-full h-full object-cover" />
                ) : (
                  <FiInstagram className="text-gray-300" size={24} />
                )}
              </div>
              <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                {pageSettings?.instagramImage3 ? (
                  <img src={pageSettings.instagramImage3} alt="Insta 3" className="w-full h-full object-cover" />
                ) : (
                  <FiInstagram className="text-gray-300" size={24} />
                )}
              </div>
              <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                {pageSettings?.instagramImage4 ? (
                  <img src={pageSettings.instagramImage4} alt="Insta 4" className="w-full h-full object-cover" />
                ) : (
                  <FiInstagram className="text-gray-300" size={24} />
                )}
              </div>
            </div>
            
            <a href={pageSettings?.instagramUrl || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-90 shadow-md" style={{ backgroundColor: instaBtnBg, color: instaBtnTextColor }}>
              <FiInstagram size={18} />
              {pageSettings?.instagramBtnText || 'Bizi Takip Et'}
            </a>
          </div>

          {/* 2. Mutlu Müşteriler */}
          <div className="rounded-[2rem] p-8 flex flex-col relative overflow-hidden" style={{ backgroundColor: reviewsBgColor }}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm" style={{ color: reviewsIconColor }}>
                  <HiOutlineUserGroup size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg" style={{ color: reviewsTitleColor }}>Mutlu Müşterilerimiz</h3>
                  <p className="text-slate-500 text-sm font-medium">10.000+ memnun müşteri</p>
                </div>
              </div>
              <FiChevronRight className="text-slate-400" size={24} />
            </div>

            <div className="w-full h-full -mx-2 px-2">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true, bulletClass: 'swiper-pagination-bullet !bg-slate-300 !w-2 !h-2 !mx-1', bulletActiveClass: '!bg-primary-500 !w-4 !rounded-full' }}
                spaceBetween={16}
                slidesPerView={1.2}
                breakpoints={{
                  640: { slidesPerView: 2.2 }
                }}
                className="w-full pb-10"
              >
                {reviews.map((review, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">{review.name}</h4>
                          <div className="flex items-center gap-0.5 text-yellow-400">
                            {[...Array(review.rating)].map((_, i) => <FiStar key={i} size={10} className="fill-current" />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-4">
                        "{review.comment}"
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* 3. İndirimlerden Haberdar Ol */}
          <div className="rounded-[2rem] p-8 flex flex-col justify-center" style={{ backgroundColor: newsletterBgColor }}>
            <h3 className="font-black text-xl mb-3" style={{ color: newsletterTitleColor }}>İndirimlerden Haberdar Ol!</h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8">
              Kampanyalar, yeni ürünler ve özel fırsatlar mail adresine gelsin.
            </p>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-100">
              <input 
                type="email" 
                placeholder="E-posta adresinizi girin" 
                className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-slate-700 placeholder-slate-400 font-medium"
                required
              />
              <button 
                type="submit" 
                className="font-bold py-3 px-6 rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap text-sm shadow-md"
                style={{ backgroundColor: newsletterBtnBg, color: newsletterBtnTextColor }}
              >
                Abone Ol
              </button>
            </form>
          </div>
          
        </div>

        {/* 4 Column Trust Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-gray-200">
          
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
              {pageSettings?.trustBannerIcon1 === 'N' ? <IoDiamondOutline size={32} /> : <span className="font-black text-xl">{pageSettings?.trustBannerIcon1 || 'N'}</span>}
            </div>
            <div className="flex flex-col">
              <span className="text-slate-800 font-black tracking-widest text-[11px] uppercase">{pageSettings?.trustBannerTitle || 'NEOBASIC CO KALİTESİ'}</span>
              <span className="text-slate-500 font-medium text-[10px]">{pageSettings?.trustBannerDesc || 'Kaliteli kumaş, şık tasarım'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
              {pageSettings?.trustBannerIcon2 === 'T' ? <GiLargeDress size={32} /> : <span className="font-black text-xl">{pageSettings?.trustBannerIcon2 || 'T'}</span>}
            </div>
            <div className="flex flex-col">
              <span className="text-slate-800 font-black tracking-widest text-[11px] uppercase">{pageSettings?.trustBannerTitle2 || 'TRENDY TASARIMLAR'}</span>
              <span className="text-slate-500 font-medium text-[10px]">{pageSettings?.trustBannerDesc2 || 'Her hafta yeni ürünler'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
              <HiOutlineUserGroup size={32} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-800 font-black tracking-widest text-[11px] uppercase">{pageSettings?.trustBannerTitle3 || 'MUTLU MÜŞTERİLER'}</span>
              <span className="text-slate-500 font-medium text-[10px]">{pageSettings?.trustBannerDesc3 || '10.000+ memnun müşteri'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
              <FiShield size={32} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-800 font-black tracking-widest text-[11px] uppercase">GÜVENLİ ALIŞVERİŞ</span>
              <span className="text-slate-500 font-medium text-[10px]">256-bit SSL ile koruma</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
