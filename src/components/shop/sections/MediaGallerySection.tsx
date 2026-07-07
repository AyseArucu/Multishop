"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';

export default function MediaGallerySection({ pageSettings }: { pageSettings: any }) {
  let gallery: { id: string, type: string, url: string, targetUrl: string }[] = [];
  
  try {
    if (pageSettings?.homeMediaGallery) {
      gallery = JSON.parse(pageSettings.homeMediaGallery);
    }
  } catch(e) {}

  // Remove empty items
  gallery = gallery.filter(item => item.url);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="bg-white/40 backdrop-blur-sm py-16">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 12 },
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
            1280: { slidesPerView: 5, spaceBetween: 24 }
          }}
          className="w-full pb-8"
        >
          {gallery.map((media) => {
            const Content = (
              <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-slate-100 group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                {media.type === 'video' ? (
                  <video 
                    src={media.url} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                  />
                ) : (
                  <img 
                    src={media.url} 
                    alt="Gallery Media" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
            );

            return (
              <SwiperSlide key={media.id}>
                {media.targetUrl ? (
                  <Link href={media.targetUrl} className="block w-full h-full">
                    {Content}
                  </Link>
                ) : (
                  Content
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
