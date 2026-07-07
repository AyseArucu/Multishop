"use client";

import Link from 'next/link';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCcw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HeroSection({ pageSettings }: { pageSettings: any }) {
  
  // Eğer admin panelinden ayarlanmış hero slider varsa onu kullan
  const defaultSlides = [
    {
      subtitle: "YENİ SEZON",
      title: pageSettings?.homeHeroTitle || "Kadın Giyim Koleksiyonu",
      desc: pageSettings?.homeHeroSubtitle || "Şıklığı ve rahatlığı bir arada sunan yeni sezon ürünlerini keşfet.",
      image: pageSettings?.heroMediaUrl || pageSettings?.heroImage || "https://images.unsplash.com/photo-1515347619362-67fd0b0ab1d9?q=80&w=1000&auto=format&fit=crop"
    },
    {
      subtitle: "TREND",
      title: "Yaz Esintisi Elbiseler",
      desc: "Sıcak yaz günlerinde ferahlık ve şıklık arayanlar için tasarlandı.",
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  let slides = defaultSlides;
  if (pageSettings?.homeHeroSlides) {
    try {
      const parsed = typeof pageSettings.homeHeroSlides === 'string' ? JSON.parse(pageSettings.homeHeroSlides) : pageSettings.homeHeroSlides;
      if (Array.isArray(parsed) && parsed.length > 0) {
        slides = parsed;
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <section className="relative w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-2 lg:mt-6 mb-16 group">
      
      {/* Navigation Arrows (Outside) */}
      <button className="hero-prev absolute left-0 lg:left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-slate-600 hover:text-pink-600 hover:scale-105 transition-all z-20 cursor-pointer hidden sm:flex">
        <FiChevronLeft size={24} />
      </button>
      <button className="hero-next absolute right-0 lg:right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-slate-600 hover:text-pink-600 hover:scale-105 transition-all z-20 cursor-pointer hidden sm:flex">
        <FiChevronRight size={24} />
      </button>

      <div 
        className="relative rounded-[2rem] overflow-hidden" 
        style={{ backgroundColor: (!pageSettings?.heroBgType || pageSettings?.heroBgType === 'color') ? (pageSettings?.heroBgColor || '#fdf2f8') : 'transparent' }}
      >
        {/* Background Media */}
        {pageSettings?.heroBgType === 'image' && pageSettings?.heroBgMediaUrl && (
          <img src={pageSettings.heroBgMediaUrl} alt="Hero Background" className="absolute inset-0 w-full h-full object-cover z-0" />
        )}
        {pageSettings?.heroBgType === 'video' && pageSettings?.heroBgMediaUrl && (
          <video src={pageSettings.heroBgMediaUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
        )}

        {/* Overlay */}
        {pageSettings?.heroBgOverlay === 'light' && <div className="absolute inset-0 bg-white/60 z-0"></div>}
        {pageSettings?.heroBgOverlay === 'dark' && <div className="absolute inset-0 bg-black/60 z-0"></div>}
        {pageSettings?.heroBgOverlay === 'blur' && <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-0"></div>}

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          speed={800}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          pagination={{ 
            clickable: true, 
            el: '.hero-pagination',
            bulletClass: 'swiper-pagination-bullet !bg-primary-200 !opacity-100 !w-2.5 !h-2.5 !mx-1.5 transition-all',
            bulletActiveClass: '!bg-primary-500 !w-8 !rounded-full'
          }}
          className="w-full relative z-10"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex flex-col lg:flex-row min-h-[550px] lg:min-h-[600px]">
                
                {/* Left Content */}
                <div className="w-full lg:w-[55%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                  <p 
                    className="font-bold tracking-widest text-sm mb-4"
                    style={{ color: pageSettings?.heroBtnBg || '#ec4899' }}
                  >
                    {slide.subtitle}
                  </p>
                  
                  <h1 
                    className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black leading-[1.1] mb-6 tracking-tight flex flex-col"
                    style={{ color: pageSettings?.heroTitleColor || '#1e293b' }}
                  >
                    {(() => {
                      const words = slide.title.split(' ');
                      if (words.length > 1) {
                        const lastWord = words.pop();
                        return (
                          <>
                            <span>{words.join(' ')}</span>
                            <span className="text-primary-500 mt-2">{lastWord}</span>
                          </>
                        );
                      }
                      return <span>{slide.title}</span>;
                    })()}
                  </h1>
                  
                  <p 
                    className="text-lg mb-10 max-w-md font-medium leading-relaxed"
                    style={{ color: pageSettings?.heroTextColor || '#475569' }}
                  >
                    {slide.desc}
                  </p>
                  
                  <div 
                    className="flex flex-wrap items-center gap-4 mb-8 lg:mb-16"
                  >
                    <Link 
                      href="/products" 
                      className="font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-all shadow-lg hover:-translate-y-0.5"
                      style={{ 
                        backgroundColor: pageSettings?.heroBtnBg || '#ec4899', 
                        color: pageSettings?.heroBtnText || '#ffffff' 
                      }}
                    >
                      <span>Alışverişe Başla</span>
                      <FiArrowRight />
                    </Link>
                    <Link 
                      href="/products?sort=newest" 
                      className="font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-all border border-gray-200"
                      style={{ 
                        backgroundColor: '#ffffff', 
                        color: pageSettings?.heroTitleColor || '#1e293b' 
                      }}
                    >
                      <span>Yeni Gelenler</span>
                      <FiArrowRight />
                    </Link>
                  </div>

                  {/* Trust Badges inside Hero (Desktop) */}
                  <div 
                    className="hidden lg:flex flex-wrap items-center gap-6 sm:gap-10 border-t border-primary-200/50 pt-8"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-pink-500 shadow-sm">
                        <FiTruck size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">Ücretsiz Kargo</span>
                        <span className="text-[11px] text-slate-500 font-medium">750₺ ve üzeri</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-pink-500 shadow-sm">
                        <FiShield size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">Güvenli Alışveriş</span>
                        <span className="text-[11px] text-slate-500 font-medium">256-bit SSL</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-pink-500 shadow-sm">
                        <FiRefreshCcw size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">Kolay İade</span>
                        <span className="text-[11px] text-slate-500 font-medium">30 gün içinde</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Image */}
                <div className="w-full lg:w-[45%] relative min-h-[400px] lg:min-h-full flex items-center justify-center lg:justify-end p-4 sm:p-8 lg:pr-12">
                  <div 
                    className="relative w-full sm:w-[85%] aspect-[4/5] sm:aspect-square max-h-[550px] rounded-[3rem] lg:rounded-[4rem] overflow-hidden shadow-2xl animate-hero-float border-[8px] sm:border-[12px] border-white/30 backdrop-blur-sm"
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      className="w-full h-full object-cover object-top animate-hero-zoom" 
                    />
                  </div>
                </div>

                {/* Trust Badges (Mobile) */}
                <div className="grid lg:hidden grid-cols-3 gap-2 sm:gap-4 border-t border-primary-200/50 pt-6 px-4 pb-6 w-full">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-pink-500 shadow-sm">
                      <FiTruck size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] sm:text-sm font-bold text-slate-800 leading-tight mb-0.5">Ücretsiz Kargo</span>
                      <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium">750₺ ve üzeri</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-pink-500 shadow-sm">
                      <FiShield size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] sm:text-sm font-bold text-slate-800 leading-tight mb-0.5">Güvenli Alışveriş</span>
                      <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium">256-bit SSL</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-pink-500 shadow-sm">
                      <FiRefreshCcw size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] sm:text-sm font-bold text-slate-800 leading-tight mb-0.5">Kolay İade</span>
                      <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium">30 gün içinde</span>
                    </div>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Pagination */}
      <div className="hero-pagination flex justify-center mt-6"></div>

    </section>
  );
}
