"use client";

import { useEffect, useRef, useState } from 'react';
import { FiMusic, FiVolume2 } from 'react-icons/fi';

export default function MusicPlayer() {
  const [musicUrl, setMusicUrl] = useState("");
  const [autoplay, setAutoplay] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default 50%
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.siteMusicUrl) {
          setMusicUrl(data.siteMusicUrl);
          setAutoplay(data.siteMusicAutoplay === 'true' || data.siteMusicAutoplay === true);
          if (data.siteMusicVolume !== undefined) {
            setVolume(Number(data.siteMusicVolume) / 100);
          }
        }
      })
      .catch(err => console.error("Error fetching music settings", err));
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, musicUrl]);

  useEffect(() => {
    if (musicUrl && audioRef.current && autoplay && !hasInteracted) {
      // Try to autoplay
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.log("Autoplay prevented by browser. User interaction needed.");
          setIsPlaying(false);
        });
      }
    }
  }, [musicUrl, autoplay, hasInteracted]);

  const togglePlay = () => {
    setHasInteracted(true);
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop />
      
      <div className="fixed bottom-6 left-6 z-50 flex items-center group">
        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center transition-all duration-300 relative ${isPlaying ? 'bg-primary-500 text-white scale-105' : 'bg-white text-slate-700 hover:bg-gray-50'}`}
        >
          {isPlaying ? <FiVolume2 size={16} className="animate-pulse" /> : <FiMusic size={16} />}
          
          {isPlaying && (
            <div className="absolute -inset-1 rounded-full border border-primary-500 opacity-50 animate-ping"></div>
          )}
        </button>
        
        <div className="absolute left-12 ml-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-white text-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
          {isPlaying ? 'Müziği Durdur' : 'Müziği Aç'}
        </div>
      </div>
    </>
  );
}
