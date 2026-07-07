"use client";

import { useState, useEffect } from "react";
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiSend } from "react-icons/fi";

export default function ContactPage() {
  const [settings, setSettings] = useState({
    contactPageDesc: "Sorularınız, önerileriniz veya işbirlikleri için bizimle iletişime geçmekten çekinmeyin.",
    contactMapEmbed: "",
    contactPhone: "+90 555 555 55 55",
    contactEmail: "iletisim@multishop.com",
    contactAddress: "Merkez Mahallesi, Moda Caddesi No:123 Kadıköy / İstanbul",
    socialInstagram: "",
    socialTwitter: "",
    socialFacebook: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      setSettings(prev => ({ ...prev, ...data }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Yükleniyor...</div>;

  return (
    <div className="bg-[#fafafa] min-h-screen pt-12 pb-24">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6">Bizimle İletişime Geçin</h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            {settings.contactPageDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Info Sidebar */}
          <div className="bg-pink-50 text-pink-900 rounded-[2rem] p-10 shadow-xl border border-pink-100 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
             {/* Decorative Background */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-50"></div>
             
             <h3 className="text-2xl font-bold mb-8 relative z-10">İletişim Bilgileri</h3>
             
             <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-pink-200 flex items-center justify-center flex-shrink-0 text-pink-600">
                     <FiPhone size={20} />
                   </div>
                   <div>
                      <p className="text-sm text-pink-500 font-bold mb-1 uppercase tracking-wider">Telefon</p>
                     <p className="font-medium text-lg text-slate-800">{settings.contactPhone}</p>
                   </div>
                </div>
                
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-pink-200 flex items-center justify-center flex-shrink-0 text-pink-600">
                     <FiMail size={20} />
                   </div>
                   <div>
                      <p className="text-sm text-pink-500 font-bold mb-1 uppercase tracking-wider">E-Posta</p>
                     <p className="font-medium text-lg text-slate-800">{settings.contactEmail}</p>
                   </div>
                </div>


             </div>

             <div className="mt-16 pt-8 border-t border-pink-200 relative z-10">
                <a href={settings.socialInstagram || "https://instagram.com"} target="_blank" rel="noreferrer" className="block text-sm text-pink-500 font-bold mb-4 uppercase tracking-wider hover:text-pink-600 transition-colors">Bizi Takip Edin</a>
                <div className="flex gap-4">
                  {settings.socialInstagram && (
                    <a href={settings.socialInstagram} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center justify-center transition-colors">
                      <FiInstagram size={20} />
                    </a>
                  )}
                  {settings.socialTwitter && (
                    <a href={settings.socialTwitter} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center justify-center transition-colors">
                      <FiTwitter size={20} />
                    </a>
                  )}
                  {settings.socialFacebook && (
                    <a href={settings.socialFacebook} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center justify-center transition-colors">
                      <FiFacebook size={20} />
                    </a>
                  )}
                </div>
             </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             <h3 className="text-3xl font-black text-slate-900 mb-8">Mesaj Gönderin</h3>
             <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Mesajınız başarıyla gönderildi!'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Adınız Soyadınız</label>
                    <input type="text" placeholder="John Doe" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400/20 focus:border-pink-400 outline-none transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">E-Posta Adresiniz</label>
                    <input type="email" placeholder="john@example.com" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400/20 focus:border-pink-400 outline-none transition-all font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Konu</label>
                  <input type="text" placeholder="Hangi konuda yardımcı olabiliriz?" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400/20 focus:border-pink-400 outline-none transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mesajınız</label>
                  <textarea rows={5} placeholder="Detaylı mesajınızı buraya yazın..." required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400/20 focus:border-pink-400 outline-none transition-all font-medium resize-none" />
                </div>
                <button type="submit" className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-colors flex items-center gap-2">
                   <FiSend /> Mesajı Gönder
                </button>
             </form>

             <div className="mt-12 pt-10 border-t border-gray-100">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0 text-pink-500">
                     <FiMapPin size={20} />
                   </div>
                   <div className="w-full">
                     <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Adres</p>
                     <p className="font-medium text-lg leading-relaxed mb-6 text-slate-800">{settings.contactAddress}</p>
                     
                     <div className="w-full h-[250px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                        <div className="w-full h-full opacity-90 hover:opacity-100 transition-opacity" dangerouslySetInnerHTML={{ __html: (settings.contactMapEmbed || '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.650491823907!2d29.0234739!3d40.9893902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab86118d36eb7%3A0xc6df72737af90eb2!2sModa%20Caddesi%2C%20Kad%C4%B1k%C3%B6y%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1689000000000!5m2!1str!2str" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>').replace('<iframe', '<iframe class="w-full h-full border-0"') }} />
                     </div>
                   </div>
                </div>
             </div>
          </div>

        </div>



      </div>
    </div>
  );
}
