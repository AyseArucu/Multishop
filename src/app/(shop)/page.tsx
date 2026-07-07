"use client";

import { useState, useEffect } from 'react';
import HeroSection from '@/components/shop/sections/HeroSection';
import CategoriesSection from '@/components/shop/sections/CategoriesSection';
import TrendingSection from '@/components/shop/sections/TrendingSection';
import NewArrivalsSection from '@/components/shop/sections/NewArrivalsSection';
import InfoSection from '@/components/shop/sections/InfoSection';
import VideoSection from '@/components/shop/sections/VideoSection';
import CategoryProductsSection from '@/components/shop/sections/CategoryProductsSection';
import MediaGallerySection from '@/components/shop/sections/MediaGallerySection';
import { useEditStore } from '@/store/useEditStore';
import { FiChevronUp, FiChevronDown, FiEyeOff } from 'react-icons/fi';
import PreFooterSection from '@/components/shop/sections/PreFooterSection';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const { isEditMode, setDraftSettings, draftSettings, moveSectionUp, moveSectionDown } = useEditStore();

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' }).then(res => res.json()).then(data => {
      if (data && typeof data === 'object') {
        const defaultSettings = {
          homeHeroTitle: "Kadın Giyim Koleksiyonu",
          homeHeroSubtitle: "Şıklığı ve rahatlığı bir arada sunan yeni sezon ürünlerini keşfet.",
          homeHeroButton: "Alışverişe Başla",
          homeCategoriesTitle: "Kategorileri Keşfet",
          homeCategoriesDesc: "İhtiyacınıza en uygun ürünleri bulmak için sizin için özenle seçilmiş kategorilerimize göz atın.",
          homeTrendingTitle: "Güncel Ürünler",
          homeTrendingDesc: "Müşterilerimizin en çok tercih ettiği, sınırları zorlayan tasarımlar ve premium kaliteli ürünler.",
          homeNewArrivalsTitle: "Yeni Gelenler",
          homeNewArrivalsDesc: "Mağazamıza eklenen en son ürünleri keşfedin.",
          homeVideosTitle: "Öne Çıkan Videolar",
          homeVideosDesc: "En yeni trendleri ve ürün incelemelerini izleyin.",
          homepageLayout: "hero,categories,categoryProducts,videos,info"
        };
        
        setDraftSettings({
          ...defaultSettings,
          ...data
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [setDraftSettings]);

  if (loading) return null;

  let currentLayoutStr = draftSettings.homepageLayout || "hero,info,categoryProducts,mediaGallery,videos";
  const layoutOrder = currentLayoutStr.split(',').filter(Boolean);

  const renderSection = (id: string, pageSettings: any) => {
    switch (id) {
      case 'hero': return <HeroSection key={id} pageSettings={pageSettings} />;
      case 'categories': return <CategoriesSection key={id} pageSettings={pageSettings} />;
      case 'newarrivals': return <NewArrivalsSection key={id} pageSettings={pageSettings} />;
      case 'trending': return <TrendingSection key={id} pageSettings={pageSettings} />;
      case 'videos': return <VideoSection key={id} pageSettings={pageSettings} />;
      case 'info': return <InfoSection key={id} pageSettings={pageSettings} />;
      case 'categoryProducts': return <CategoryProductsSection key={id} pageSettings={pageSettings} />;
      case 'mediaGallery': return <MediaGallerySection key={id} pageSettings={pageSettings} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-transparent">
      {layoutOrder.map((sectionId, index) => (
        <div key={`${sectionId}-${index}`} className="relative group/section">
          {/* Section Reorder Controls (Only visible in Edit Mode) */}
          {isEditMode && (
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-xl border border-gray-200">
              <button 
                onClick={() => moveSectionUp(index)}
                disabled={index === 0}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-primary-100 text-slate-600 hover:text-primary-600 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Yukarı Taşı"
              >
                <FiChevronUp size={24} />
              </button>
              <button 
                onClick={() => moveSectionDown(index)}
                disabled={index === layoutOrder.length - 1}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-primary-100 text-slate-600 hover:text-primary-600 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Aşağı Taşı"
              >
                <FiChevronDown size={24} />
              </button>
            </div>
          )}
          
          <div className={isEditMode ? "border-y border-transparent hover:border-primary-500/30 transition-colors" : ""}>
            {renderSection(sectionId, draftSettings)}
          </div>
        </div>
      ))}

      <PreFooterSection pageSettings={draftSettings} />
    </div>
  );
}
