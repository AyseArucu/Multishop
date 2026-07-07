"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { FiPlay, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoSection({ pageSettings }: { pageSettings: any }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const title = pageSettings?.homeVideosTitle || "Öne Çıkan Videolar";
  const desc = pageSettings?.homeVideosDesc || "En yeni trendleri ve ürün incelemelerini izleyin.";
  
  let videos: { url: string; title: string; cover?: string }[] = [];
  try {
    if (pageSettings?.homeVideos) {
      videos = JSON.parse(pageSettings.homeVideos);
    }
  } catch(e) {}

  // Function to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let embedUrl = url;
    
    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('shorts/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // TikTok (Basic embed)
    else if (url.includes('tiktok.com')) {
      const videoId = url.split('/video/')[1]?.split('?')[0];
      if (videoId) {
        embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
      }
    }
    // Instagram (Basic embed)
    else if (url.includes('instagram.com')) {
      embedUrl = url.split('?')[0] + 'embed';
    }

    return embedUrl;
  };

  const getThumbnail = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('shorts/')[1].split('?')[0];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    // Direct videos or fallbacks
    return 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop';
  };

  if (!videos || videos.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-24 bg-white/40 backdrop-blur-sm relative overflow-hidden"
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              {desc}
            </p>
          </div>
          <div className="flex gap-2 mt-6 md:mt-0">
            <button className="video-prev w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-slate-600 hover:border-primary-500 hover:text-pink-500 hover:bg-primary-50 hover:scale-105 active:scale-95 transition-all z-10 relative bg-white shadow-sm">
              <FiChevronLeft size={24} />
            </button>
            <button className="video-next w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-slate-600 hover:border-primary-500 hover:text-pink-500 hover:bg-primary-50 hover:scale-105 active:scale-95 transition-all z-10 relative bg-white shadow-sm">
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: '.video-prev',
            nextEl: '.video-next',
          }}
          pagination={{ clickable: true, el: '.video-pagination' }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {videos.map((video, idx) => (
            <SwiperSlide key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="h-full"
              >
                <div className="group relative rounded-[2rem] overflow-hidden aspect-[9/16] bg-slate-900 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-1" onClick={() => setActiveVideo(video.url)}>
                  {/* Thumbnail or Video Background */}
                  {!video.url.includes('youtube.com') && !video.url.includes('youtu.be') && !video.url.includes('tiktok') && !video.url.includes('instagram') ? (
                    <video 
                      src={video.url} 
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105"
                      muted loop playsInline autoPlay
                    />
                  ) : (
                    <img 
                      src={video.cover || getThumbnail(video.url)} 
                      alt={video.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary-600/90 text-white rounded-full flex items-center justify-center pl-1 shadow-lg shadow-primary-600/30 group-hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-sm group-hover:bg-pink-500">
                      <FiPlay size={28} />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent">
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="video-pagination flex justify-center mt-6"></div>

      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10"
          >
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              &times;
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative"
            >
              {!activeVideo.includes('youtube.com') && !activeVideo.includes('youtu.be') && !activeVideo.includes('tiktok') && !activeVideo.includes('instagram') ? (
                <video 
                  src={activeVideo} 
                  className="absolute inset-0 w-full h-full object-contain" 
                  controls autoPlay 
                />
              ) : (
                <iframe
                  src={getEmbedUrl(activeVideo)}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
