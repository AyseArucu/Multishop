"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 mb-2">
            En iyi deneyim için kontrol sizde!
          </h3>
          <p className="text-sm text-slate-600 mb-2 leading-relaxed">
            Platformlarımızdaki deneyiminizi geliştirmek ve size daha çok ilginizi çekecek ürünleri sunabilmek amacıyla web sitemizde çerezler kullanıyoruz. Tüm bu çalışmayı üstün bir hassasiyet ile sizin için gerçekleştiriyoruz 😊
          </p>
          <p className="text-xs text-slate-500 mb-2">
            Web sitemizin alt kısmında yer alan &quot;Çerez Tercihleri&quot; bölümünü ziyaret ederek dilediğiniz zaman tercihlerinizi değiştirebilirsiniz.
          </p>
          <p className="text-xs text-slate-500">
            Sitemizde kullanılan çerezler hakkında detaylı bilgi için <Link href="/gizlilik" className="text-blue-600 font-medium hover:underline">Gizlilik ve Çerez Politikası</Link>&apos;na göz atabilirsiniz.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 justify-center">
          <button 
            onClick={handleReject}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto active:scale-95"
          >
            Reddet
          </button>
          <button 
            onClick={handleAccept}
            className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto active:scale-95"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
