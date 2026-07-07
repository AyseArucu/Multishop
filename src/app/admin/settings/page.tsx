"use client";

import { useState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiSettings, FiPhone, FiMail, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";


const SettingSection = ({ title, children, openSection, setOpenSection }: any) => {
  const isOpen = openSection === title;
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <button 
        type="button"
        onClick={() => setOpenSection(isOpen ? null : title)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <span className="text-2xl text-slate-400">{isOpen ? '\u2212' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-8 pt-4 border-t border-gray-100 space-y-6 animate-fade-in-up">
           {children}
        </div>
      )}
    </div>
  );
};

export default function AdminSettings() {
  const [openSection, setOpenSection] = useState<string | null>("Genel Site Ayarları");
  const [settings, setSettings] = useState({
    globalThemeColor: "#ea5a8b",
    topBannerAnimated: "false",
    marqueeText: "",
    marqueeColor: "#000000",
    contactPhone: "",
    contactEmail: "",
    contactAddress: "",
    contactMapEmbed: "",
    contactPageDesc: "",
    socialInstagram: "",
    socialTwitter: "",
    socialFacebook: "",
    instagramHandle: "",
    instagramUrl: "",
    instagramBtnText: "",
    instaBgColor: "#f8fafc",
    instaTitleColor: "#1e293b",
    instaBtnBg: "#ea5a8b",
    instaBtnTextColor: "#ffffff",
    reviewsBgColor: "#f8fafc",
    reviewsTitleColor: "#1e293b",
    reviewsIconColor: "#ea5a8b",
    newsletterBgColor: "#f8fafc",
    newsletterTitleColor: "#1e293b",
    newsletterBtnBg: "#ea5a8b",
    newsletterBtnTextColor: "#ffffff",
    instagramImage1: "",
    instagramImage2: "",
    instagramImage3: "",
    instagramImage4: "",
    siteTitle: "MultiShop | Premium E-Commerce",
    siteFavicon: "",
    siteMusicUrl: "",
    siteMusicAutoplay: "false",
    siteMusicVolume: "50",
    siteLogoUrl: "",
    siteLogoText: "",
    siteLogoFont: "Inter",
    siteLogoColor: "#000000",
    socialLinks: "[]",
    homeReviews: "[]",
    cartDiscountThreshold: "2000",
    cartDiscountRate: "10",
    homeVideosTitle: "Öne Çıkan Videolar",
    homeVideosDesc: "En yeni trendleri ve ürün incelemelerini izleyin.",
    homeVideos: "[]",
    sliderArrowColor: "#ff1493",
    sliderArrowStyle: "default",
    homeMediaGallery: "[]",
    siteBgUrl: "",
    siteBgType: "none",
    siteBgOverlay: "none",
    homeCategoriesConfig: JSON.stringify({ showMixed: false, mixedTitle: "Öne Çıkan Ürünler", limitMode: "all", selectedIds: [], maxCount: 0 }),
    footerBgType: "color",
    footerBgColor: "#292524",
    footerBgMediaUrl: "",
    footerBgOverlay: "none",
    footerTitleColor: "#ffffff",
    footerTextColor: "#d1d5db",
    footerBtnBg: "#ffffff",
    footerBtnText: "#292524",
    footerInputBg: "rgba(0,0,0,0.2)",
    footerInputText: "#ffffff",
    infoBgType: "color",
    infoBgColor: "#1e293b",
    infoBgMediaUrl: "",
    infoBgOverlay: "none",
    infoTitleColor: "#ffffff",
    infoTextColor: "#94a3b8",
    infoBtnBg: "#3b82f6",
    infoBtnText: "#ffffff",
    infoCardBg: "rgba(255, 255, 255, 0.05)",
    heroBoxBgType: "color",
    heroBoxMediaUrl: "",
    heroBoxBgOverlay: "none",
    heroBgColor: "#292524",
    heroMediaType: "image",
    heroMediaUrl: "",
    heroCustomerCount: "10.000+",
    heroAvatar1: "",
    heroAvatar2: "",
    heroAvatar3: "",
    heroAvatar4: "",
    heroTitleColor: "#ffffff",
    heroTextColor: "#cbd5e1",
    heroBtnBg: "#ffffff",
    heroBtnText: "#292524",
    heroShowCustomers: "true",
    productCardDiscountBg: "#ec4899",
    productCardDiscountText: "#ffffff",
    productCardNewBg: "#292524",
    productCardNewText: "#ffffff",
    trustBannerTitle: "Neobasic Co Kalitesi",
    trustBannerDesc: "Premium ürün garantisi",
    trustBannerIcon1: "N",
    trustBannerTitle2: "Trendy Tasarımlar",
    trustBannerDesc2: "Her sezon yenilenen koleksiyon",
    trustBannerIcon2: "T",
    trustBannerTitle3: "Mutlu Müşteriler",
    trustBannerDesc3: "Bizimle alışveriş yapan binler",
    iyzicoApiKey: "",
    iyzicoSecretKey: "",
    iyzicoEnvironment: "sandbox",
  });
  
  const [allCategories, setAllCategories] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploadingFavicon(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        handleChange('siteFavicon', data.url);
      } else {
        alert(data.error || 'Yükleme başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      alert('Yükleme sırasında hata oluştu.');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploadingMusic(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        handleChange('siteMusicUrl', data.url);
      } else {
        alert(data.error || 'Yükleme başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      alert('Yükleme sırasında hata oluştu.');
    } finally {
      setUploadingMusic(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploadingLogo(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        handleChange('siteLogoUrl', data.url);
      } else {
        alert(data.error || 'Yükleme başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      alert('Yükleme sırasında hata oluştu.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        const currentGallery = settings.homeMediaGallery ? JSON.parse(settings.homeMediaGallery) : [];
        const newGallery = [...currentGallery];
        
        // Determine type based on file extension or mime type
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        
        newGallery[index].url = data.url;
        newGallery[index].type = type;
        
        handleChange('homeMediaGallery', JSON.stringify(newGallery));
      } else {
        alert(data.error || 'Yükleme başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      alert('Yükleme sırasında hata oluştu.');
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        handleChange('siteBgUrl', data.url);
        handleChange('siteBgType', type);
      } else {
        alert(data.error || 'Yükleme başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      alert('Yükleme sırasında hata oluştu.');
    }
  };

  const handleFooterBgUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        handleChange(fieldName, data.url);
      } else {
        alert(data.error || 'Yükleme başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      alert('Yükleme sırasında hata oluştu.');
    }
  };

  const handleHomeVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        const videos = settings.homeVideos ? JSON.parse(settings.homeVideos) : [];
        const newVids = [...videos];
        newVids[index].url = data.url;
        handleChange('homeVideos', JSON.stringify(newVids));
      } else {
        alert(data.error || 'Yükleme başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      alert('Yükleme sırasında hata oluştu.');
    }
  };

  const handleReviewAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        const reviews = settings.homeReviews ? JSON.parse(settings.homeReviews) : [];
        const newReviews = [...reviews];
        newReviews[index].avatar = data.url;
        handleChange('homeReviews', JSON.stringify(newReviews));
      } else {
        alert(data.error || 'Yükleme başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      alert('Yükleme sırasında hata oluştu.');
    }
  };

  const handleHeroSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        let slides = settings.homeHeroSlides ? JSON.parse(settings.homeHeroSlides) : [];
        if (slides.length === 0) {
          slides = [
            { subtitle: "YENİ SEZON", title: settings.homeHeroTitle || "Kadın Giyim Koleksiyonu", desc: settings.homeHeroSubtitle || "Şıklığı ve rahatlığı bir arada sunan yeni sezon ürünlerini keşfet.", image: settings.heroMediaUrl || "https://images.unsplash.com/photo-1515347619362-67fd0b0ab1d9?q=80&w=1000&auto=format&fit=crop" },
            { subtitle: "TREND", title: "Yaz Esintisi Elbiseler", desc: "Sıcak yaz günlerinde ferahlık ve şıklık arayanlar için tasarlandı.", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop" }
          ];
        }
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], image: data.url };
        handleChange('homeHeroSlides', JSON.stringify(newSlides));
      } else {
        alert(data.error || 'Yükleme başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      alert('Yükleme sırasında hata oluştu.');
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ]).then(([settingsData, categoriesData]) => {
      if (settingsData && typeof settingsData === 'object') {
        setSettings(prev => ({ ...prev, ...settingsData }));
      }
      if (Array.isArray(categoriesData)) {
        setAllCategories(categoriesData);
      } else if (categoriesData && categoriesData.categories) {
        setAllCategories(categoriesData.categories);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleChange = (key: string, value: any) => {
    startTransition(() => {
      setSettings(prev => ({ ...prev, [key]: value }));
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Tüm ayarlar başarıyla kaydedildi!');
    } catch (error) {
      console.error(error);
      alert('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500 font-medium">Ayarlar Yükleniyor...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 min-h-screen pb-24">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-50 bg-gray-50/95 backdrop-blur-md p-4 -mx-4 sm:-mx-8 px-4 sm:px-8 border-b border-gray-200 flex items-center justify-between mb-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
             <FiSettings size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Site Ayarları</h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium hidden sm:block">Sitenin genel bilgilerini ve duyurularını yönetin.</p>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-slate-900 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
        >
          <FiSave size={20} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* DUYURU AYARLARI */}
        <SettingSection title="Üst Duyuru Bandı (Navbar Üstü)" openSection={openSection} setOpenSection={setOpenSection}>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Animasyon Stili</label>
            <select 
              value={settings.topBannerAnimated?.toString() || 'false'} 
              onChange={e => handleChange('topBannerAnimated', e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
            >
              <option value="false">Düz Metin (Sabit)</option>
              <option value="true">Metin Kayması (Animasyonlu)</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">Navbar üzerindeki kampanya yazılarının kayarak geçmesini sağlar.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Metin (Tüm Sitede Görünür - Opsiyonel)</label>
            <input 
              type="text" 
              value={settings.marqueeText} 
              onChange={e => handleChange('marqueeText', e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Yazı Rengi</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
               <input 
                 type="color" 
                 value={settings.marqueeColor || '#000000'} 
                 onChange={e => handleChange('marqueeColor', e.target.value)} 
                 className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
               />
               <span className="text-sm text-slate-900 font-mono font-bold bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">{settings.marqueeColor || '#000000'}</span>
            </div>
          </div>
                </SettingSection>

        {/* SEPET INDIRIM AYARLARI */}
        <SettingSection title="Sepet İndirimi" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-4">Belirli bir sepet tutarına ulaşıldığında müşteriye otomatik indirim uygular.</p>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">İndirim Barajı (TL)</label>
            <input 
              type="number" 
              value={settings.cartDiscountThreshold} 
              onChange={e => handleChange('cartDiscountThreshold', e.target.value)} 
              placeholder="Örn: 2000"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">İndirim Oranı (%)</label>
            <input 
              type="number" 
              value={settings.cartDiscountRate} 
              onChange={e => handleChange('cartDiscountRate', e.target.value)} 
              placeholder="Örn: 10"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
            />
          </div>
                </SettingSection>

        {/* ÖDEME SİSTEMLERİ */}
        <SettingSection title="Ödeme Sistemleri Ayarları (Sanal POS)" openSection={openSection} setOpenSection={setOpenSection}>
        <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm mb-4">
          Gerçek kartlarla ödeme almak için <strong>Iyzico</strong> hesabınızdan aldığınız API anahtarlarını aşağıya girin. Anahtarlar boş bırakıldığında sistem <strong>Test Ödeme Modu</strong> ile çalışmaya devam edecektir.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Iyzico API Anahtarı</label>
            <input 
              type="text" 
              value={settings.iyzicoApiKey || ""} 
              onChange={e => setSettings({...settings, iyzicoApiKey: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
              placeholder="sandbox-..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Iyzico Güvenlik Anahtarı (Secret)</label>
            <input 
              type="password" 
              value={settings.iyzicoSecretKey || ""} 
              onChange={e => setSettings({...settings, iyzicoSecretKey: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-all font-medium"
              placeholder="sandbox-..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Çalışma Ortamı</label>
            <select 
              value={settings.iyzicoEnvironment || "sandbox"} 
              onChange={e => setSettings({...settings, iyzicoEnvironment: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-400 font-medium"
            >
              <option value="sandbox">Sandbox (Test Ortamı)</option>
              <option value="production">Production (Gerçek Ödemeler)</option>
            </select>
          </div>
        </div>
      </SettingSection>

        {/* GENEL AYARLAR */}
        <SettingSection title="Genel Site Ayarları" openSection={openSection} setOpenSection={setOpenSection}>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Site Başlığı (Title)</label>
              <input 
                type="text" 
                value={settings.siteTitle} 
                onChange={e => handleChange('siteTitle', e.target.value)} 
                placeholder="Örn: MultiShop | Premium E-Commerce"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
              />
              <p className="text-xs text-gray-500 mt-2">Tarayıcı sekmesinde görünen site başlığı.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Site İkonu (Favicon)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={settings.siteFavicon} 
                  onChange={e => handleChange('siteFavicon', e.target.value)} 
                  placeholder="Örn: /favicon.ico veya URL"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
                />
                <label className="cursor-pointer whitespace-nowrap bg-white border border-gray-300 hover:border-primary-500 hover:text-primary-600 text-slate-700 font-medium px-4 rounded-xl transition flex items-center justify-center shadow-sm">
                  {uploadingFavicon ? '...' : 'PC\'den Yükle'}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.ico" 
                    onChange={handleFaviconUpload} 
                    disabled={uploadingFavicon} 
                  />
                </label>
              </div>
              <div className="flex items-center gap-3 mt-2">
                {settings.siteFavicon && (
                  <img src={settings.siteFavicon} alt="Favicon preview" className="w-6 h-6 rounded border border-gray-200 object-contain bg-white" />
                )}
                <p className="text-xs text-gray-500">Tarayıcı sekmesinde görünen küçük ikon (1:1 oran önerilir).</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Site Logosu</label>
            <div className="flex items-center gap-6">
              {settings.siteLogoUrl ? (
                <div className="relative w-32 h-32 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                  <img src={settings.siteLogoUrl} alt="Logo Preview" className="object-contain w-full h-full p-2" />
                  <button 
                    onClick={() => handleChange('siteLogoUrl', '')}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition shadow"
                    title="Logoyu Kaldır"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-xs font-medium text-center px-2 mt-2">Logo Yok</span>
                </div>
              )}
              
              <div className="flex-1">
                <label className="cursor-pointer bg-white border border-gray-300 hover:border-primary-500 hover:text-primary-600 text-slate-700 font-medium py-2 px-6 rounded-xl transition inline-flex items-center gap-2 shadow-sm">
                  {uploadingLogo ? 'Yükleniyor...' : 'Yeni Logo Yükle'}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    disabled={uploadingLogo} 
                  />
                </label>
                <p className="text-xs text-gray-400 mt-3">Maksimum 2MB. Önerilen format: PNG (Şeffaf arkaplan).</p>
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Veya URL girin:</label>
                  <input 
                    type="text" 
                    value={settings.siteLogoUrl} 
                    onChange={e => handleChange('siteLogoUrl', e.target.value)} 
                    placeholder="https://site.com/logo.png"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Arkaplan Müziği</h3>
            <p className="text-xs text-gray-500 mb-4">Sitenize giren ziyaretçilere çalması için bir müzik/melodi (MP3, WAV) ekleyebilirsiniz.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Müzik Yükle veya URL Gir</label>
                
                <div className="mb-3">
                  <label className="cursor-pointer bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-700 font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-sm w-full text-sm">
                    {uploadingMusic ? 'Yükleniyor...' : '🎵 PC\'den Müzik Yükle'}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="audio/*" 
                      onChange={handleMusicUpload} 
                      disabled={uploadingMusic} 
                    />
                  </label>
                </div>
                
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400 font-bold whitespace-nowrap">Veya URL:</span>
                  <input 
                    type="text" 
                    value={settings.siteMusicUrl} 
                    onChange={e => handleChange('siteMusicUrl', e.target.value)} 
                    placeholder="https://site.com/music.mp3"
                    className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-xs"
                  />
                </div>
                {settings.siteMusicUrl && (
                  <div className="mt-3 flex items-center gap-3">
                    <audio src={settings.siteMusicUrl} controls className="h-8 w-full max-w-[200px]" />
                    <button onClick={() => handleChange('siteMusicUrl', '')} className="text-xs text-red-500 hover:underline">Kaldır</button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Otomatik Çalma</label>
                <select 
                  value={settings.siteMusicAutoplay} 
                  onChange={e => handleChange('siteMusicAutoplay', e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                >
                  <option value="false">Kapalı (Kullanıcı kendi açmalı)</option>
                  <option value="true">Açık (Otomatik başlamaya çalışır)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-2 mb-4">Not: Modern tarayıcılar, kullanıcı etkileşimi olmadan sesli medyayı engelleyebilir. Sitede küçük bir oynatıcı butonu gösterilecektir.</p>
                
                <label className="block text-xs font-bold text-slate-500 mb-2">Ses Seviyesi: %{settings.siteMusicVolume || "50"}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={settings.siteMusicVolume || "50"}
                  onChange={e => handleChange('siteMusicVolume', e.target.value)}
                  className="w-full accent-primary-500"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Site Arkaplanı (Global)</h3>
            <p className="text-xs text-gray-500 mb-4">Sitenin genel arkaplanına resim veya video yükleyin. Bu, sayfaların arkasında görünecektir (cam/glassmorphism efekti).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Mevcut Arkaplan</label>
                {settings.siteBgUrl ? (
                  <div className="relative w-full h-32 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    {settings.siteBgType === 'video' ? (
                      <video src={settings.siteBgUrl} className="w-full h-full object-cover" muted autoPlay loop />
                    ) : (
                      <img src={settings.siteBgUrl} className="w-full h-full object-cover" alt="Background" />
                    )}
                    <button 
                      onClick={() => {
                        handleChange('siteBgUrl', '');
                        handleChange('siteBgType', 'none');
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition shadow"
                      title="Kaldır"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs font-medium">
                    Arkaplan Yok
                  </div>
                )}
                <div className="mt-4">
                  <label className="cursor-pointer bg-white border border-gray-300 hover:border-primary-500 hover:text-primary-600 text-slate-700 font-medium py-2 px-6 rounded-xl transition inline-flex items-center gap-2 shadow-sm w-full justify-center">
                    PC'den Seç ve Yükle
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,video/mp4,video/webm" 
                      onChange={handleBgUpload} 
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Arkaplan Efekti / Karartma</label>
                <select 
                  value={settings.siteBgOverlay || 'none'} 
                  onChange={e => handleChange('siteBgOverlay', e.target.value)} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 text-sm font-bold"
                >
                  <option value="none">Efekt Yok (Orijinal Görünüm)</option>
                  <option value="light">Açık Cam Efekti (Hafif beyaz pus)</option>
                  <option value="dark">Koyu Karartma (Siyah yarı-saydam)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Veya Yazı İle Logo Oluşturun (Görsel yüklü değilse geçerlidir)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Logo Metni</label>
                <input 
                  type="text" 
                  value={settings.siteLogoText} 
                  onChange={e => handleChange('siteLogoText', e.target.value)} 
                  placeholder="Örn: Benim Mağazam"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Yazı Tipi (Font)</label>
                <select 
                  value={settings.siteLogoFont} 
                  onChange={e => handleChange('siteLogoFont', e.target.value)} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 text-sm font-bold"
                >
                  <option value="Inter">Inter (Modern & Sade)</option>
                  <option value="Playfair Display">Playfair Display (Zarif & Klasik)</option>
                  <option value="Montserrat">Montserrat (Kalın & Güçlü)</option>
                  <option value="Pacifico">Pacifico (El Yazısı & Eğlenceli)</option>
                  <option value="Cinzel">Cinzel (Şık & İhtişamlı)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Logo Rengi</label>
                <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200">
                  <input 
                    type="color" 
                    value={settings.siteLogoColor || '#000000'} 
                    onChange={e => handleChange('siteLogoColor', e.target.value)} 
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <span className="text-xs font-mono font-bold text-slate-700">{settings.siteLogoColor || '#000000'}</span>
                </div>
              </div>
            </div>
            {/* Logo Önizleme */}
            <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
               {/* Fontu yüklemek için önizlemede link etiketi kullanıyoruz */}
               <link href={`https://fonts.googleapis.com/css2?family=${settings.siteLogoFont?.replace(' ', '+')}&display=swap`} rel="stylesheet" />
               <div style={{ fontFamily: `'${settings.siteLogoFont}', sans-serif`, color: settings.siteLogoColor }} className="text-4xl">
                 {settings.siteLogoText || 'MULTISHOP'}
               </div>
            </div>
          </div>
                </SettingSection>

        {/* KAYDIRMA OKLARI (SLIDER) AYARLARI */}
        <SettingSection title="Ürün Kaydırma Okları (Slider) Ayarları" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-4">Ürün resim galerisi, anasayfa vitrini vb. kaydırılabilir tüm alanlardaki yön oklarının tasarımını özelleştirin.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Ok İkonu Stili</label>
              <select 
                value={settings.sliderArrowStyle || 'default'} 
                onChange={e => handleChange('sliderArrowStyle', e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
              >
                <option value="default">Klasik İnce Çizgi (Varsayılan)</option>
                <option value="bold">Kalın Çizgi (Belirgin)</option>
                <option value="solid">Düz Üçgen Ok</option>
                <option value="circle">Yuvarlak Arkaplanlı Ok</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Ok Rengi</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                 <input 
                   type="color" 
                   value={settings.sliderArrowColor || '#ff1493'} 
                   onChange={e => handleChange('sliderArrowColor', e.target.value)} 
                   className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                 />
                 <span className="text-sm text-slate-900 font-mono font-bold bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">{settings.sliderArrowColor || '#ff1493'}</span>
                 <button 
                   type="button"
                   onClick={() => handleChange('sliderArrowColor', '#ff1493')}
                   className="ml-auto text-xs bg-pink-100 text-pink-600 font-bold px-3 py-1.5 rounded-lg hover:bg-pink-200 transition"
                 >
                   Pembeye Sıfırla
                 </button>
              </div>
            </div>
          </div>
                </SettingSection>

        {/* ALT BILGI (FOOTER) ARKAPLAN AYARLARI */}
        <SettingSection title="Altbilgi (Footer) Görünüm Ayarları" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-6">Sitenin en alt kısmında yer alan Altbilgi (Footer) alanının arkaplanını ve renklerini ayarlayın.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Arkaplan Türü</label>
              <select 
                value={settings.footerBgType || 'color'} 
                onChange={e => handleChange('footerBgType', e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
              >
                <option value="color">Sabit Renk</option>
                <option value="image">Resim</option>
                <option value="video">Video</option>
              </select>

              {settings.footerBgType === 'color' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Arkaplan Rengi</label>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input 
                      type="color" 
                      value={settings.footerBgColor || '#292524'} 
                      onChange={e => handleChange('footerBgColor', e.target.value)} 
                      className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-sm text-slate-900 font-mono font-bold bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">{settings.footerBgColor || '#292524'}</span>
                  </div>
                </div>
              )}

              {(settings.footerBgType === 'image' || settings.footerBgType === 'video') && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Medya Yükle (PC'den)</label>
                  <label className="cursor-pointer bg-white border border-gray-300 hover:border-primary-500 hover:text-primary-600 text-slate-700 font-medium py-3 px-6 rounded-xl transition inline-flex items-center gap-2 shadow-sm w-full justify-center">
                    PC'den Dosya Seç
                    <input 
                      type="file" 
                      className="hidden" 
                      accept={settings.footerBgType === 'image' ? "image/*" : "video/mp4,video/webm"} 
                      onChange={e => handleFooterBgUpload(e, 'footerBgMediaUrl')} 
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">Mevcut dosya url'i: {settings.footerBgMediaUrl || 'Yok'}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Yazı Karartması (Overlay)</label>
              <select 
                value={settings.footerBgOverlay || 'none'} 
                onChange={e => handleChange('footerBgOverlay', e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
              >
                <option value="none">Yok (Sadece Renk / Medya Görünür)</option>
                <option value="light">Hafif Siyah Karartma (%30)</option>
                <option value="medium">Orta Siyah Karartma (%60)</option>
                <option value="dark">Koyu Siyah Karartma (%85)</option>
                <option value="blur">Buzlu Cam / Bulanıklaştırma (Blur)</option>
              </select>

              <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Önizleme Bilgisi</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Resim veya Video kullandığınızda yazıların daha net okunabilmesi için "Orta" veya "Koyu Siyah Karartma" seçeneğini kullanmanızı tavsiye ederiz.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-gray-100">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Başlık Rengi</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.footerTitleColor || '#ffffff'} 
                  onChange={e => handleChange('footerTitleColor', e.target.value)} 
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-sm text-slate-900 font-mono font-bold bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">{settings.footerTitleColor || '#ffffff'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Metin Rengi</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.footerTextColor || '#d1d5db'} 
                  onChange={e => handleChange('footerTextColor', e.target.value)} 
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-sm text-slate-900 font-mono font-bold bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">{settings.footerTextColor || '#d1d5db'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Buton Arkaplanı</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.footerBtnBg || '#ffffff'} 
                  onChange={e => handleChange('footerBtnBg', e.target.value)} 
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-sm text-slate-900 font-mono font-bold bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">{settings.footerBtnBg || '#ffffff'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Buton Yazı Rengi</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.footerBtnText || '#292524'} 
                  onChange={e => handleChange('footerBtnText', e.target.value)} 
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-sm text-slate-900 font-mono font-bold bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">{settings.footerBtnText || '#292524'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Kutu (E-posta) Arkaplanı</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="text" 
                  value={settings.footerInputBg || 'rgba(0,0,0,0.2)'} 
                  onChange={e => handleChange('footerInputBg', e.target.value)} 
                  className="w-full bg-transparent border-none outline-none text-sm font-mono"
                  placeholder="rgba(0,0,0,0.2) veya #hex"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Kutu (E-posta) Yazı Rengi</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.footerInputText || '#ffffff'} 
                  onChange={e => handleChange('footerInputText', e.target.value)} 
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-sm text-slate-900 font-mono font-bold bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">{settings.footerInputText || '#ffffff'}</span>
              </div>
            </div>

          </div>
                </SettingSection>

        {/* ÖZELLİKLER (INFO) BÖLÜMÜ ARKAPLAN AYARLARI */}
        <SettingSection title="Özellikler (Üst) Bölümü Görünüm Ayarları" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-6">"Işık Hızında Teslimat" gibi kartların bulunduğu üst kısmın arkaplan ve renklerini ayarlayın.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Arkaplan Türü</label>
              <select 
                value={settings.infoBgType || 'color'} 
                onChange={e => handleChange('infoBgType', e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
              >
                <option value="color">Sabit Renk</option>
                <option value="image">Resim</option>
                <option value="video">Video</option>
              </select>

              {settings.infoBgType === 'color' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Arkaplan Rengi</label>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input 
                      type="color" 
                      value={settings.infoBgColor || '#1e293b'} 
                      onChange={e => handleChange('infoBgColor', e.target.value)} 
                      className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-sm text-slate-900 font-mono font-bold bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">{settings.infoBgColor || '#1e293b'}</span>
                  </div>
                </div>
              )}

              {(settings.infoBgType === 'image' || settings.infoBgType === 'video') && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Medya Yükle (PC'den)</label>
                  <label className="cursor-pointer bg-white border border-gray-300 hover:border-primary-500 hover:text-primary-600 text-slate-700 font-medium py-3 px-6 rounded-xl transition inline-flex items-center gap-2 shadow-sm w-full justify-center">
                    PC'den Dosya Seç
                    <input 
                      type="file" 
                      className="hidden" 
                      accept={settings.infoBgType === 'image' ? "image/*" : "video/mp4,video/webm"} 
                      onChange={e => handleFooterBgUpload(e, 'infoBgMediaUrl')} 
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">Mevcut dosya url'i: {settings.infoBgMediaUrl || 'Yok'}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Yazı Karartması (Overlay)</label>
              <select 
                value={settings.infoBgOverlay || 'none'} 
                onChange={e => handleChange('infoBgOverlay', e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
              >
                <option value="none">Yok</option>
                <option value="light">Hafif Siyah Karartma (%30)</option>
                <option value="medium">Orta Siyah Karartma (%60)</option>
                <option value="dark">Koyu Siyah Karartma (%85)</option>
                <option value="blur">Buzlu Cam / Bulanıklaştırma</option>
              </select>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pt-8 border-t border-gray-100">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Başlık Rengi</label>
              <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.infoTitleColor || '#ffffff'} 
                  onChange={e => handleChange('infoTitleColor', e.target.value)} 
                  className="w-10 h-10 flex-shrink-0 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-slate-900 font-mono font-bold bg-white px-2 py-1.5 rounded shadow-sm border border-gray-100 truncate flex-1">{settings.infoTitleColor || '#ffffff'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Metin Rengi</label>
              <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.infoTextColor || '#94a3b8'} 
                  onChange={e => handleChange('infoTextColor', e.target.value)} 
                  className="w-10 h-10 flex-shrink-0 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-slate-900 font-mono font-bold bg-white px-2 py-1.5 rounded shadow-sm border border-gray-100 truncate flex-1">{settings.infoTextColor || '#94a3b8'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">İkon Arkaplanı</label>
              <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.infoBtnBg || '#3b82f6'} 
                  onChange={e => handleChange('infoBtnBg', e.target.value)} 
                  className="w-10 h-10 flex-shrink-0 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-slate-900 font-mono font-bold bg-white px-2 py-1.5 rounded shadow-sm border border-gray-100 truncate flex-1">{settings.infoBtnBg || '#3b82f6'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">İkon Rengi</label>
              <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.infoBtnText || '#ffffff'} 
                  onChange={e => handleChange('infoBtnText', e.target.value)} 
                  className="w-10 h-10 flex-shrink-0 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-slate-900 font-mono font-bold bg-white px-2 py-1.5 rounded shadow-sm border border-gray-100 truncate flex-1">{settings.infoBtnText || '#ffffff'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Kart Arkaplanı</label>
              <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={(settings.infoCardBg && settings.infoCardBg.startsWith('#')) ? settings.infoCardBg : '#ffffff'} 
                  onChange={e => handleChange('infoCardBg', e.target.value)} 
                  className="w-10 h-10 flex-shrink-0 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-slate-900 font-mono font-bold bg-white px-2 py-1.5 rounded shadow-sm border border-gray-100 truncate flex-1">
                  {settings.infoCardBg || 'Varsayılan'}
                </span>
                <button 
                  onClick={() => handleChange('infoCardBg', 'rgba(255, 255, 255, 0.05)')}
                  className="w-full mt-1 text-xs bg-slate-200 text-slate-700 px-2 py-1.5 rounded hover:bg-slate-300 font-bold transition-colors"
                >
                  Şeffaf Yap
                </button>
              </div>
            </div>
          </div>
                </SettingSection>

        {/* ANA VİTRİN (HERO) AYARLARI */}
        <SettingSection title="Ana Vitrin (Hero) Görünüm Ayarları" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-6">Sitenizin en üstündeki devasa karşılama alanının kaydırmalı (slider) resimlerini, yazılarını ve renklerini belirleyin.</p>
          
          <div className="space-y-4">
            {(() => {
              const parsedSlides = settings.homeHeroSlides ? JSON.parse(settings.homeHeroSlides) : [];
              const slides: { subtitle: string; title: string; desc: string; image: string }[] = parsedSlides.length > 0 ? parsedSlides : [
                {
                  subtitle: "YENİ SEZON",
                  title: settings.homeHeroTitle || "Kadın Giyim Koleksiyonu",
                  desc: settings.homeHeroSubtitle || "Şıklığı ve rahatlığı bir arada sunan yeni sezon ürünlerini keşfet.",
                  image: settings.heroMediaUrl || "https://images.unsplash.com/photo-1515347619362-67fd0b0ab1d9?q=80&w=1000&auto=format&fit=crop"
                },
                {
                  subtitle: "TREND",
                  title: "Yaz Esintisi Elbiseler",
                  desc: "Sıcak yaz günlerinde ferahlık ve şıklık arayanlar için tasarlandı.",
                  image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop"
                }
              ];
              return (
                <>
                  {slides.map((slide, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      
                      {/* Image Upload */}
                      <div className="w-full md:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative flex items-center justify-center border border-gray-300">
                         {slide.image ? (
                           <img src={slide.image} className="w-full h-full object-cover" alt="Slide" />
                         ) : (
                           <span className="text-[10px] font-bold text-center text-gray-500">Resim<br/>Seç</span>
                         )}
                         <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                           <span className="text-white text-[10px] font-bold px-2 py-1 bg-primary-600 rounded">Değiştir</span>
                           <input 
                             type="file" 
                             accept="image/*" 
                             className="hidden" 
                             onChange={(e) => handleHeroSlideUpload(e, idx)} 
                           />
                         </label>
                      </div>

                      <div className="flex-1 w-full space-y-3">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={slide.subtitle} 
                            onChange={e => {
                              const newSlides = [...slides];
                              newSlides[idx] = { ...newSlides[idx], subtitle: e.target.value };
                              handleChange('homeHeroSlides', JSON.stringify(newSlides));
                            }} 
                            placeholder="Üst Başlık (Örn: YENİ SEZON)" 
                            className="w-1/3 p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm font-bold text-primary-600" 
                          />
                          <input 
                            type="text" 
                            value={slide.title} 
                            onChange={e => {
                              const newSlides = [...slides];
                              newSlides[idx] = { ...newSlides[idx], title: e.target.value };
                              handleChange('homeHeroSlides', JSON.stringify(newSlides));
                            }} 
                            placeholder="Ana Başlık (Örn: Yaz Koleksiyonu)" 
                            className="flex-1 p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm font-bold" 
                          />
                        </div>
                        <textarea 
                          value={slide.desc} 
                          onChange={e => {
                            const newSlides = [...slides];
                            newSlides[idx] = { ...newSlides[idx], desc: e.target.value };
                            handleChange('homeHeroSlides', JSON.stringify(newSlides));
                          }} 
                          placeholder="Açıklama (Örn: Şıklığı ve rahatlığı bir arada sunan...)" 
                          rows={2}
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm resize-none" 
                        />
                      </div>
                      
                      <button 
                        onClick={() => {
                          const newSlides = slides.filter((_, i) => i !== idx);
                          handleChange('homeHeroSlides', JSON.stringify(newSlides));
                        }}
                        className="w-full md:w-auto p-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition whitespace-nowrap self-stretch flex items-center justify-center font-bold"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newSlides = [...slides, { subtitle: "YENİ", title: "Yeni Koleksiyon", desc: "Açıklama yazısı", image: "" }];
                      handleChange('homeHeroSlides', JSON.stringify(newSlides));
                    }}
                    className="w-full py-4 bg-primary-50 text-primary-600 font-bold rounded-xl border border-dashed border-primary-200 hover:border-primary-400 hover:bg-primary-100 transition"
                  >
                    + Yeni Kaydırma (Slayt) Ekle
                  </button>
                </>
              );
            })()}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 space-y-8">
            {/* HERO BACKGROUND */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Kutu Arkaplan Türü</label>
                <select 
                  value={settings.heroBgType || 'color'} 
                  onChange={e => handleChange('heroBgType', e.target.value)} 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
                >
                  <option value="color">Sabit Renk</option>
                  <option value="image">Resim</option>
                  <option value="video">Video</option>
                </select>

                {(!settings.heroBgType || settings.heroBgType === 'color') && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Arkaplan Rengi</label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <input 
                        type="color" 
                        value={settings.heroBgColor || '#fdf2f8'} 
                        onChange={e => handleChange('heroBgColor', e.target.value)} 
                        className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                      <span className="text-sm text-slate-900 font-mono font-bold bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">{settings.heroBgColor || '#fdf2f8'}</span>
                    </div>
                  </div>
                )}

                {(settings.heroBgType === 'image' || settings.heroBgType === 'video') && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 mt-4">Medya Yükle (PC'den)</label>
                    <label className="cursor-pointer bg-white border border-gray-300 hover:border-primary-500 hover:text-primary-600 text-slate-700 font-medium py-3 px-6 rounded-xl transition inline-flex items-center gap-2 shadow-sm w-full justify-center">
                      PC'den Dosya Seç
                      <input 
                        type="file" 
                        className="hidden" 
                        accept={settings.heroBgType === 'image' ? "image/*" : "video/mp4,video/webm"} 
                        onChange={e => handleFooterBgUpload(e, 'heroBgMediaUrl')} 
                      />
                    </label>
                    <p className="text-xs text-gray-400 mt-2">Mevcut dosya url'i: {settings.heroBgMediaUrl || 'Yok'}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Arkaplan Karartması (Overlay)</label>
                <select 
                  value={settings.heroBgOverlay || 'none'} 
                  onChange={e => handleChange('heroBgOverlay', e.target.value)} 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
                >
                  <option value="none">Yok (Sadece Renk / Medya Görünür)</option>
                  <option value="light">Hafif Beyaz Karartma</option>
                  <option value="dark">Koyu Siyah Karartma</option>
                  <option value="blur">Buzlu Cam / Bulanıklaştırma (Blur)</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">Arkaplan olarak resim/video seçtiğinizde yazıların daha okunaklı olması için yarı saydam bir katman (karartma veya buzlu cam) ekleyebilirsiniz.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 mt-4">Başlık Rengi</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.heroTitleColor || '#1e293b'} 
                  onChange={e => handleChange('heroTitleColor', e.target.value)} 
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-slate-900 font-mono font-bold bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{settings.heroTitleColor || '#1e293b'}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 mt-4">Alt Metin Rengi</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.heroTextColor || '#475569'} 
                  onChange={e => handleChange('heroTextColor', e.target.value)} 
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-slate-900 font-mono font-bold bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{settings.heroTextColor || '#475569'}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 mt-4">Buton Arkaplanı</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.heroBtnBg || '#ec4899'} 
                  onChange={e => handleChange('heroBtnBg', e.target.value)} 
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-slate-900 font-mono font-bold bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{settings.heroBtnBg || '#ec4899'}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 mt-4">Buton Yazı Rengi</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="color" 
                  value={settings.heroBtnText || '#ffffff'} 
                  onChange={e => handleChange('heroBtnText', e.target.value)} 
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs text-slate-900 font-mono font-bold bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{settings.heroBtnText || '#ffffff'}</span>
              </div>
            </div>
          </div>
        </div>
              </SettingSection>

      {/* ANASAYFA KATEGORİ VİTRİNİ */}
        <SettingSection title="Anasayfa Kategori Vitrini" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-6">Anasayfada alt alta listelenecek kategorileri ve bu vitrinlerin sınırlarını belirleyin.</p>
          
          {(() => {
            const config = settings.homeCategoriesConfig ? JSON.parse(settings.homeCategoriesConfig) : { showMixed: false, mixedTitle: "Öne Çıkan Ürünler", limitMode: "all", selectedIds: [], maxCount: 0 };
            const setConfig = (newConfig: any) => handleChange('homeCategoriesConfig', JSON.stringify({ ...config, ...newConfig }));
            
            return (
              <div className="space-y-8">
                {/* 1. Limit Modu & Seçim */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Hangi Kategoriler Gösterilsin?</h3>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <input 
                        type="radio" 
                        name="limitMode" 
                        checked={config.limitMode === 'all'} 
                        onChange={() => setConfig({ limitMode: 'all' })} 
                        className="text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="text-sm font-bold text-slate-700">Tüm Aktif Kategoriler</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <input 
                        type="radio" 
                        name="limitMode" 
                        checked={config.limitMode === 'custom'} 
                        onChange={() => setConfig({ limitMode: 'custom' })} 
                        className="text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="text-sm font-bold text-slate-700">Sadece Seçtiklerim</span>
                    </label>
                  </div>
                  
                  {config.limitMode === 'custom' && (
                    <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-100 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {allCategories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={config.selectedIds.includes(cat.id)}
                            onChange={(e) => {
                              const newIds = e.target.checked 
                                ? [...config.selectedIds, cat.id]
                                : config.selectedIds.filter((id: string) => id !== cat.id);
                              setConfig({ selectedIds: newIds });
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-700">{cat.name}</span>
                        </label>
                      ))}
                      {allCategories.length === 0 && <span className="text-sm text-gray-500">Kayıtlı kategori bulunamadı.</span>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 2. Max Kategori Sayısı */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3">Maksimum Kategori Sayısı</h3>
                    <p className="text-xs text-gray-500 mb-2">Anasayfada alt alta en fazla kaç kategori listelensin? (0 = Sınırsız)</p>
                    <input 
                      type="number" 
                      value={config.maxCount || 0}
                      onChange={(e) => setConfig({ maxCount: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                    />
                  </div>

                  {/* 3. Karışık Kategori */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                    <label className="flex items-center justify-between cursor-pointer mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Karışık Kategori Eklensin mi?</h3>
                        <p className="text-xs text-gray-500 mt-1">En yeni ürünlerden oluşan genel bir vitrin (Örn: Öne Çıkanlar).</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${config.showMixed ? 'bg-primary-500' : 'bg-gray-300'}`}>
                        <input 
                          type="checkbox" 
                          className="sr-only"
                          checked={config.showMixed}
                          onChange={(e) => setConfig({ showMixed: e.target.checked })}
                        />
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.showMixed ? 'left-7' : 'left-1'}`}></div>
                      </div>
                    </label>
                    
                    {config.showMixed && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <label className="block text-xs font-bold text-slate-500 mb-2">Vitrin Başlığı</label>
                        <input 
                          type="text" 
                          value={config.mixedTitle || ''}
                          onChange={(e) => setConfig({ mixedTitle: e.target.value })}
                          placeholder="Örn: Haftanın Öne Çıkanları"
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
                </SettingSection>

        {/* ÜRÜN KARTLARI AYARLARI */}
        <SettingSection title="Ürün Kartı Renk Ayarları" openSection={openSection} setOpenSection={setOpenSection}>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">İndirim Etiketi Arkaplan</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input type="color" value={settings.productCardDiscountBg || '#ec4899'} onChange={e => handleChange('productCardDiscountBg', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">İndirim Etiketi Yazı</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input type="color" value={settings.productCardDiscountText || '#ffffff'} onChange={e => handleChange('productCardDiscountText', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Yeni Sezon Etiketi Arkaplan</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input type="color" value={settings.productCardNewBg || '#292524'} onChange={e => handleChange('productCardNewBg', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Yeni Sezon Etiketi Yazı</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input type="color" value={settings.productCardNewText || '#ffffff'} onChange={e => handleChange('productCardNewText', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              </div>
            </div>
          </div>
                </SettingSection>

        {/* ALT GÜVENLİK BANDI AYARLARI */}
        <SettingSection title="Alt Güvenlik Bandı (Trust Banner) Ayarları" openSection={openSection} setOpenSection={setOpenSection}>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">1. Alan</h3>
              <input type="text" value={settings.trustBannerIcon1 || 'N'} onChange={e => handleChange('trustBannerIcon1', e.target.value)} placeholder="İkon Harfi (Örn: N)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
              <input type="text" value={settings.trustBannerTitle || 'Neobasic Co Kalitesi'} onChange={e => handleChange('trustBannerTitle', e.target.value)} placeholder="Başlık" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
              <input type="text" value={settings.trustBannerDesc || 'Premium ürün garantisi'} onChange={e => handleChange('trustBannerDesc', e.target.value)} placeholder="Açıklama" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">2. Alan</h3>
              <input type="text" value={settings.trustBannerIcon2 || 'T'} onChange={e => handleChange('trustBannerIcon2', e.target.value)} placeholder="İkon Harfi (Örn: T)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
              <input type="text" value={settings.trustBannerTitle2 || 'Trendy Tasarımlar'} onChange={e => handleChange('trustBannerTitle2', e.target.value)} placeholder="Başlık" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
              <input type="text" value={settings.trustBannerDesc2 || 'Her sezon yenilenen koleksiyon'} onChange={e => handleChange('trustBannerDesc2', e.target.value)} placeholder="Açıklama" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">3. Alan (Mutlu Müşteriler)</h3>
              <input type="text" value={settings.trustBannerTitle3 || 'Mutlu Müşteriler'} onChange={e => handleChange('trustBannerTitle3', e.target.value)} placeholder="Başlık" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
              <input type="text" value={settings.trustBannerDesc3 || 'Bizimle alışveriş yapan binler'} onChange={e => handleChange('trustBannerDesc3', e.target.value)} placeholder="Açıklama" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
            </div>
          </div>
                </SettingSection>

        {/* ILETISIM AYARLARI */}
        <SettingSection title="İletişim Bilgileri" openSection={openSection} setOpenSection={setOpenSection}>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3"><FiPhone /> Telefon Numarası</label>
            <input 
              type="text" 
              value={settings.contactPhone} 
              onChange={e => handleChange('contactPhone', e.target.value)} 
              placeholder="+90 555 555 55 55"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3"><FiMail /> E-Posta Adresi</label>
            <input 
              type="email" 
              value={settings.contactEmail} 
              onChange={e => handleChange('contactEmail', e.target.value)} 
              placeholder="iletisim@multishop.com"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3"><FiMapPin /> Açık Adres</label>
            <textarea 
              value={settings.contactAddress} 
              onChange={e => handleChange('contactAddress', e.target.value)} 
              placeholder="Şirket adresi..."
              rows={3}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">İletişim Sayfası Açıklaması</label>
            <textarea 
              value={settings.contactPageDesc} 
              onChange={e => handleChange('contactPageDesc', e.target.value)} 
              placeholder="Bize ulaşmak için aşağıdaki formu doldurabilirsiniz..."
              rows={2}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Harita Embed Kodu (Iframe)</label>
            <textarea 
              value={settings.contactMapEmbed} 
              onChange={e => handleChange('contactMapEmbed', e.target.value)} 
              placeholder="<iframe src='https://www.google.com/maps/...'></iframe>"
              rows={3}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none font-mono text-sm"
            />
          </div>
                </SettingSection>

        {/* SOSYAL MEDYA LİNKLERİ */}
        <SettingSection title="Sosyal Medya Linkleri" openSection={openSection} setOpenSection={setOpenSection}>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3"><FiInstagram /> Instagram Linki</label>
            <input 
              type="url" 
              value={settings.socialInstagram} 
              onChange={e => handleChange('socialInstagram', e.target.value)} 
              placeholder="https://instagram.com/mağazanız"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3"><FiTwitter /> Twitter (X) Linki</label>
            <input 
              type="url" 
              value={settings.socialTwitter} 
              onChange={e => handleChange('socialTwitter', e.target.value)} 
              placeholder="https://twitter.com/mağazanız"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3"><FiFacebook /> Facebook Linki</label>
            <input 
              type="url" 
              value={settings.socialFacebook} 
              onChange={e => handleChange('socialFacebook', e.target.value)} 
              placeholder="https://facebook.com/mağazanız"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
                </SettingSection>

        {/* INSTAGRAM TAKİP ET BÖLÜMÜ */}
        <SettingSection title="Instagram Takip Et Bölümü" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-4">Sitenin alt kısmında yer alan "Instagram'da Biz" bölümünü buradan özelleştirebilirsiniz.</p>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Kullanıcı Adı (@)</label>
            <input 
              type="text" 
              value={settings.instagramHandle || ''} 
              onChange={e => handleChange('instagramHandle', e.target.value)} 
              placeholder="@neobasic.co"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Yönlendirilecek Link (URL)</label>
            <input 
              type="url" 
              value={settings.instagramUrl || ''} 
              onChange={e => handleChange('instagramUrl', e.target.value)} 
              placeholder="https://instagram.com/neobasic.co"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Buton Yazısı</label>
            <input 
              type="text" 
              value={settings.instagramBtnText || ''} 
              onChange={e => handleChange('instagramBtnText', e.target.value)} 
              placeholder="Bizi Takip Et"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Instagram Kutu Arkaplanı</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.instaBgColor || '#f8fafc'} onChange={e => handleChange('instaBgColor', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.instaBgColor || '#f8fafc'}</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Instagram Başlık Rengi</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.instaTitleColor || '#1e293b'} onChange={e => handleChange('instaTitleColor', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.instaTitleColor || '#1e293b'}</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Instagram Buton Arkaplanı</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.instaBtnBg || '#ea5a8b'} onChange={e => handleChange('instaBtnBg', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.instaBtnBg || '#ea5a8b'}</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Instagram Buton Yazı Rengi</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.instaBtnTextColor || '#ffffff'} onChange={e => handleChange('instaBtnTextColor', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.instaBtnTextColor || '#ffffff'}</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Müşteri Yorumları Kutu Arkaplanı</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.reviewsBgColor || '#f8fafc'} onChange={e => handleChange('reviewsBgColor', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.reviewsBgColor || '#f8fafc'}</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Müşteri Yorumları Başlık Rengi</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.reviewsTitleColor || '#1e293b'} onChange={e => handleChange('reviewsTitleColor', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.reviewsTitleColor || '#1e293b'}</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Müşteri Yorumları İkon Rengi</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.reviewsIconColor || '#ea5a8b'} onChange={e => handleChange('reviewsIconColor', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.reviewsIconColor || '#ea5a8b'}</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Bülten Kutu Arkaplanı</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.newsletterBgColor || '#f8fafc'} onChange={e => handleChange('newsletterBgColor', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.newsletterBgColor || '#f8fafc'}</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Bülten Başlık Rengi</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.newsletterTitleColor || '#1e293b'} onChange={e => handleChange('newsletterTitleColor', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.newsletterTitleColor || '#1e293b'}</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Bülten Buton Arkaplanı</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.newsletterBtnBg || '#ea5a8b'} onChange={e => handleChange('newsletterBtnBg', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.newsletterBtnBg || '#ea5a8b'}</span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">Bülten Buton Yazı Rengi</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="color" value={settings.newsletterBtnTextColor || '#ffffff'} onChange={e => handleChange('newsletterBtnTextColor', e.target.value)} className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded border border-gray-100">{settings.newsletterBtnTextColor || '#ffffff'}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Instagram Resimleri (PC'den Yükle - 4 Adet)</label>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="relative">
                  <label className="cursor-pointer bg-white text-xs border border-gray-300 hover:border-primary-500 text-center py-2 px-3 rounded-lg block truncate">
                    {settings[`instagramImage${num}` as keyof typeof settings] ? 'Değiştir' : `Resim ${num} Seç`}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={e => handleFooterBgUpload(e, `instagramImage${num}`)} 
                    />
                  </label>
                  {settings[`instagramImage${num}` as keyof typeof settings] && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Önerilen boyut: Kare veya 3:4 dikey oran.</p>
          </div>
                </SettingSection>

        {/* MÜŞTERİ YORUMLARI */}
        <SettingSection title="Müşteri Yorumları (Anasayfa Alt Kısım)" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-4">Sitenin alt kısmındaki "Mutlu Müşterilerimiz" bölümünde görünecek yorumları buradan yönetebilirsiniz. Hiç yorum eklemezseniz varsayılan yorumlar gösterilir.</p>
          
          <div className="space-y-4">
            {(() => {
              const reviews: { name: string, rating: number, comment: string, avatar: string }[] = settings.homeReviews ? JSON.parse(settings.homeReviews) : [];
              return (
                <>
                  {reviews.map((rev, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      
                      {/* Avatar Upload */}
                      <div className="w-full md:w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 relative flex items-center justify-center border border-gray-300">
                         {rev.avatar ? (
                           <img src={rev.avatar} className="w-full h-full object-cover" alt="Avatar" />
                         ) : (
                           <span className="text-[10px] font-bold text-center text-gray-500">Profil<br/>Resmi</span>
                         )}
                         <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                           <span className="text-white text-[10px] font-bold px-2 py-1 bg-primary-600 rounded">Seç</span>
                           <input 
                             type="file" 
                             accept="image/*" 
                             className="hidden" 
                             onChange={(e) => handleReviewAvatarUpload(e, idx)} 
                           />
                         </label>
                      </div>

                      <div className="flex-1 w-full space-y-3">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={rev.name} 
                            onChange={e => {
                              const newRevs = [...reviews];
                              newRevs[idx].name = e.target.value;
                              handleChange('homeReviews', JSON.stringify(newRevs));
                            }} 
                            placeholder="Müşteri Adı (Örn: Selin A.)" 
                            className="flex-1 p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm font-bold" 
                          />
                          <select
                            value={rev.rating}
                            onChange={e => {
                              const newRevs = [...reviews];
                              newRevs[idx].rating = parseInt(e.target.value);
                              handleChange('homeReviews', JSON.stringify(newRevs));
                            }}
                            className="w-24 p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm text-yellow-500 font-bold"
                          >
                            <option value={5}>5 Yıldız</option>
                            <option value={4}>4 Yıldız</option>
                            <option value={3}>3 Yıldız</option>
                            <option value={2}>2 Yıldız</option>
                            <option value={1}>1 Yıldız</option>
                          </select>
                        </div>
                        <textarea 
                          value={rev.comment} 
                          onChange={e => {
                            const newRevs = [...reviews];
                            newRevs[idx].comment = e.target.value;
                            handleChange('homeReviews', JSON.stringify(newRevs));
                          }} 
                          placeholder="Müşteri Yorumu..." 
                          rows={2}
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm resize-none" 
                        />
                      </div>
                      
                      <button 
                        onClick={() => {
                          const newRevs = reviews.filter((_, i) => i !== idx);
                          handleChange('homeReviews', JSON.stringify(newRevs));
                        }}
                        className="w-full md:w-auto p-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition whitespace-nowrap self-stretch flex items-center justify-center font-bold"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newRevs = [...reviews, { name: "", rating: 5, comment: "", avatar: "" }];
                      handleChange('homeReviews', JSON.stringify(newRevs));
                    }}
                    className="w-full py-4 bg-primary-50 text-primary-600 font-bold rounded-xl border border-dashed border-primary-200 hover:border-primary-400 hover:bg-primary-100 transition"
                  >
                    + Yeni Yorum Ekle
                  </button>
                </>
              );
            })()}
          </div>
                </SettingSection>

        {/* SOSYAL MEDYA */}
        <SettingSection title="Sosyal Medya Linkleri" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-4">Sitenizin alt kısmında (footer) görünecek sosyal medya hesaplarınızı ekleyin. İkonlar linkinize göre otomatik belirlenir (Instagram, Twitter, YouTube vb.).</p>
          <div className="space-y-4">
            {(() => {
              const links: string[] = settings.socialLinks ? JSON.parse(settings.socialLinks) : [];
              return (
                <>
                  {links.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <input 
                        type="url" 
                        value={link} 
                        onChange={e => {
                          const newLinks = [...links];
                          newLinks[idx] = e.target.value;
                          handleChange('socialLinks', JSON.stringify(newLinks));
                        }} 
                        placeholder="https://..." 
                        className="flex-1 p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" 
                      />
                      <button 
                        onClick={() => {
                          const newLinks = links.filter((_, i) => i !== idx);
                          handleChange('socialLinks', JSON.stringify(newLinks));
                        }}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newLinks = [...links, ""];
                      handleChange('socialLinks', JSON.stringify(newLinks));
                    }}
                    className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl border border-dashed border-gray-300 hover:border-slate-400 hover:bg-slate-100 transition"
                  >
                    + Yeni Link Ekle
                  </button>
                </>
              );
            })()}
          </div>
                </SettingSection>

        {/* ANASAYFA VIDEOLARI */}
        <SettingSection title="Anasayfa Videoları" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-4">Anasayfada sergilemek istediğiniz YouTube, TikTok veya Instagram videolarını ekleyin.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Başlığı</label>
              <input 
                type="text" 
                value={settings.homeVideosTitle} 
                onChange={e => handleChange('homeVideosTitle', e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Açıklaması</label>
              <input 
                type="text" 
                value={settings.homeVideosDesc} 
                onChange={e => handleChange('homeVideosDesc', e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium"
              />
            </div>
          </div>

          <div className="space-y-4">
            {(() => {
              const videos: { url: string; title: string }[] = settings.homeVideos ? JSON.parse(settings.homeVideos) : [];
              return (
                <>
                  {videos.map((vid, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      
                      {/* PC Video Upload / Preview */}
                      <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative flex items-center justify-center border border-gray-300">
                         {vid.url && !vid.url.includes('youtube.com') && !vid.url.includes('youtu.be') && !vid.url.includes('tiktok') && !vid.url.includes('instagram') ? (
                           <video src={vid.url} className="w-full h-full object-cover" muted loop playsInline />
                         ) : vid.url ? (
                           <span className="text-[10px] font-bold text-center p-2 text-gray-500">Dış Link<br/>(Youtube/TikTok vb)</span>
                         ) : (
                           <span className="text-[10px] font-bold text-gray-400">Video Yok</span>
                         )}
                         <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                           <span className="text-white text-[10px] font-bold px-2 py-1 bg-primary-600 rounded">PC'den Seç</span>
                           <input 
                             type="file" 
                             accept="video/mp4,video/webm" 
                             className="hidden" 
                             onChange={(e) => handleHomeVideoUpload(e, idx)} 
                           />
                         </label>
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <input 
                          type="text" 
                          value={vid.title} 
                          onChange={e => {
                            const newVids = [...videos];
                            newVids[idx].title = e.target.value;
                            handleChange('homeVideos', JSON.stringify(newVids));
                          }} 
                          placeholder="Video Başlığı" 
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm" 
                        />
                        <input 
                          type="url" 
                          value={vid.url} 
                          onChange={e => {
                            const newVids = [...videos];
                            newVids[idx].url = e.target.value;
                            handleChange('homeVideos', JSON.stringify(newVids));
                          }} 
                          placeholder="Veya Dış Link (Örn: https://youtube.com/...)" 
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm" 
                        />
                      </div>
                      
                      <button 
                        onClick={() => {
                          const newVids = videos.filter((_, i) => i !== idx);
                          handleChange('homeVideos', JSON.stringify(newVids));
                        }}
                        className="w-full md:w-auto p-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition whitespace-nowrap self-stretch md:self-auto flex items-center justify-center"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newVids = [...videos, { url: "", title: "" }];
                      handleChange('homeVideos', JSON.stringify(newVids));
                    }}
                    className="w-full py-3 bg-primary-50 text-primary-600 font-bold rounded-xl border border-dashed border-primary-200 hover:border-primary-400 hover:bg-primary-100 transition"
                  >
                    + Yeni Video Ekle
                  </button>
                </>
              );
            })()}
          </div>
                </SettingSection>

        {/* ANASAYFA MEDYA GALERİSİ */}
        <SettingSection title="Anasayfa Medya Galerisi (Kategoriler Altı)" openSection={openSection} setOpenSection={setOpenSection}>

          <p className="text-sm text-gray-500 mb-4">Anasayfada kategorilerin hemen altında sergilenecek ürün resimlerini veya kısa tanıtım videolarını bilgisayarınızdan buraya yükleyebilirsiniz.</p>
          
          <div className="space-y-4">
            {(() => {
              const gallery: { id: string, type: string, url: string, targetUrl: string }[] = settings.homeMediaGallery ? JSON.parse(settings.homeMediaGallery) : [];
              return (
                <>
                  {gallery.map((media, idx) => (
                    <div key={media.id || idx} className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      
                      {/* Upload/Preview Area */}
                      <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                        {media.url ? (
                          media.type === 'video' ? (
                            <video src={media.url} className="w-full h-full object-cover" muted loop playsInline />
                          ) : (
                            <img src={media.url} alt="Media" className="w-full h-full object-cover" />
                          )
                        ) : (
                          <span className="text-xs text-gray-500 font-medium">Dosya Seçilmedi</span>
                        )}
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="text-white text-xs font-bold px-3 py-1.5 bg-primary-600 rounded-lg">Bilgisayardan Seç</span>
                          <input 
                            type="file" 
                            accept="image/*,video/mp4,video/webm" 
                            className="hidden" 
                            onChange={(e) => handleMediaUpload(e, idx)} 
                          />
                        </label>
                      </div>

                      <div className="flex-1 w-full space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Yönlendirme Linki (Opsiyonel)</label>
                          <input 
                            type="text" 
                            value={media.targetUrl || ''} 
                            onChange={e => {
                              const newGallery = [...gallery];
                              newGallery[idx].targetUrl = e.target.value;
                              handleChange('homeMediaGallery', JSON.stringify(newGallery));
                            }} 
                            placeholder="Örn: /product/123" 
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              if (idx > 0) {
                                const newGallery = [...gallery];
                                const temp = newGallery[idx - 1];
                                newGallery[idx - 1] = newGallery[idx];
                                newGallery[idx] = temp;
                                handleChange('homeMediaGallery', JSON.stringify(newGallery));
                              }
                            }}
                            disabled={idx === 0}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            Yukarı
                          </button>
                          <button 
                            onClick={() => {
                              if (idx < gallery.length - 1) {
                                const newGallery = [...gallery];
                                const temp = newGallery[idx + 1];
                                newGallery[idx + 1] = newGallery[idx];
                                newGallery[idx] = temp;
                                handleChange('homeMediaGallery', JSON.stringify(newGallery));
                              }
                            }}
                            disabled={idx === gallery.length - 1}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            Aşağı
                          </button>
                          <button 
                            onClick={() => {
                              const newGallery = gallery.filter((_, i) => i !== idx);
                              handleChange('homeMediaGallery', JSON.stringify(newGallery));
                            }}
                            className="ml-auto p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition text-sm"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                      
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newGallery = [...gallery, { id: Date.now().toString(), type: 'image', url: "", targetUrl: "" }];
                      handleChange('homeMediaGallery', JSON.stringify(newGallery));
                    }}
                    className="w-full py-4 bg-primary-50 text-primary-600 font-bold rounded-xl border border-dashed border-primary-200 hover:border-primary-400 hover:bg-primary-100 transition"
                  >
                    + Yeni Resim / Video Alanı Ekle
                  </button>
                </>
              );
            })()}
          </div>
                </SettingSection>

      </div>
    </div>
  );
}
