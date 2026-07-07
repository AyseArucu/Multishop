"use client";

import { useState, useEffect } from "react";
import { FiSave, FiFileText, FiMove, FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

const SECTION_NAMES: Record<string, string> = {
  "hero": "Büyük Karşılama Alanı (Hero Slider)",
  "info": "Bilgi Bandı (Kargo, İade Garantisi vb.)",
  "categoryProducts": "Kategori Ürünleri (Giyim, Çanta, Ayakkabı vb.)",
  "mediaGallery": "Medya Galerisi (İnstagram, Videolar vb.)",
  "categories": "Kategorileri Keşfet Bölümü (Dairesel)",
  "trending": "Haftanın Vazgeçilmezleri (Alternatif)",
  "newarrivals": "Yeni Gelenler (Alternatif)",
  "videos": "Video Bölümü (Alternatif)"
};

export default function AdminPages() {
  const [activeTab, setActiveTab] = useState('layout');
  const [settings, setSettings] = useState({
    homeHeroTitle: "",
    homeHeroSubtitle: "",
    homeHeroButton: "",
    homeCategoriesTitle: "",
    homeCategoriesDesc: "",
    homeTrendingTitle: "",
    homeTrendingDesc: "",
    contactPageDesc: "",
    contactMapEmbed: "",
    infoCard1Title: "",
    infoCard1Desc: "",
    infoCard2Title: "",
    infoCard2Desc: "",
    infoCard3Title: "",
    infoCard3Desc: "",
    homepageLayout: "hero,info,categoryProducts,mediaGallery",
    footerAboutText: "Kaliteli ürünler, uygun fiyatlar ve güvenli alışverişin tek adresi. Müşteri memnuniyeti bizim önceliğimizdir."
  });
  
  const [pages, setPages] = useState<any[]>([]);
  const [editingPage, setEditingPage] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Drag and drop state
  const [layoutArray, setLayoutArray] = useState<string[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, pagesRes] = await Promise.all([
        fetch('/api/settings', { cache: 'no-store' }),
        fetch('/api/pages', { cache: 'no-store' })
      ]);
      
      const settingsData = await settingsRes.json();
      if (settingsData && typeof settingsData === 'object') {
        const mergedSettings = { ...settings, ...settingsData };
        let currentLayoutStr = mergedSettings.homepageLayout || "hero,info,categoryProducts,mediaGallery,videos";
        
        // Migrate old layout to new layout
        if (!currentLayoutStr.includes('categoryProducts')) {
          currentLayoutStr = currentLayoutStr.replace('trending', 'categoryProducts').replace(',newarrivals', '');
        }
        if (!currentLayoutStr.includes('mediaGallery')) {
          currentLayoutStr = currentLayoutStr.replace('categoryProducts', 'categoryProducts,mediaGallery');
        }
        mergedSettings.homepageLayout = currentLayoutStr;

        setSettings(mergedSettings);
        setLayoutArray(currentLayoutStr.split(',').filter(Boolean));
      }

      const pagesData = await pagesRes.json();
      if (pagesData.success) {
        setPages(pagesData.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    setSaving(false);
    alert('Sayfa içerikleri ve sıralamalar başarıyla güncellendi!');
  };

  // Drag and Drop Handlers
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newLayout = [...layoutArray];
    const item = newLayout.splice(draggedItemIndex, 1)[0];
    newLayout.splice(index, 0, item);
    setDraggedItemIndex(index);
    setLayoutArray(newLayout);
    handleChange('homepageLayout', newLayout.join(','));
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newLayout = [...layoutArray];
    if (direction === 'up' && index > 0) {
      [newLayout[index - 1], newLayout[index]] = [newLayout[index], newLayout[index - 1]];
    } else if (direction === 'down' && index < newLayout.length - 1) {
      [newLayout[index + 1], newLayout[index]] = [newLayout[index], newLayout[index + 1]];
    }
    setLayoutArray(newLayout);
    handleChange('homepageLayout', newLayout.join(','));
  };

  // Custom Pages Handlers
  const handleSavePage = async () => {
    if (!editingPage.title || !editingPage.slug || !editingPage.content) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    
    setSaving(true);
    try {
      const url = editingPage.id ? `/api/pages/${editingPage.id}` : `/api/pages`;
      const method = editingPage.id ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPage)
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Sayfa başarıyla kaydedildi!");
        setEditingPage(null);
        fetchData();
      } else {
        alert(data.error || "Bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm("Bu sayfayı silmek istediğinize emin misiniz?")) return;
    
    try {
      const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert("Sayfa silindi.");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500 font-medium">İçerikler Yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 min-h-screen pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600">
             <FiFileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Sayfa Yönetimi</h1>
            <p className="text-gray-500 font-medium">Sitenizdeki tüm içerikleri ve kurumsal sayfaları yönetin.</p>
          </div>
        </div>
        {activeTab !== 'customPages' && (
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-slate-900 hover:bg-accent-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
          >
            <FiSave size={20} /> {saving ? 'Kaydediliyor...' : 'Yayınla'}
          </button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* PAGE SELECTOR (TABS) */}
        <div className="w-full md:w-64 flex-shrink-0">
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 space-y-2">
              <button 
                onClick={() => setActiveTab('layout')} 
                className={`w-full text-left px-5 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'layout' ? 'bg-accent-50 text-accent-600' : 'text-slate-600 hover:bg-gray-50'}`}
              >
                🔄 Ana Sayfa Sıralaması
              </button>
              <button 
                onClick={() => setActiveTab('home')} 
                className={`w-full text-left px-5 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'home' ? 'bg-accent-50 text-accent-600' : 'text-slate-600 hover:bg-gray-50'}`}
              >
                🏠 Ana Sayfa Metinleri
              </button>
              <button 
                onClick={() => setActiveTab('contact')} 
                className={`w-full text-left px-5 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'contact' ? 'bg-accent-50 text-accent-600' : 'text-slate-600 hover:bg-gray-50'}`}
              >
                📞 İletişim Sayfası
              </button>
              <button 
                onClick={() => setActiveTab('footer')} 
                className={`w-full text-left px-5 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'footer' ? 'bg-accent-50 text-accent-600' : 'text-slate-600 hover:bg-gray-50'}`}
              >
                ⬇️ Footer Ayarları
              </button>
              <button 
                onClick={() => { setActiveTab('customPages'); setEditingPage(null); }} 
                className={`w-full text-left px-5 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'customPages' ? 'bg-accent-50 text-accent-600' : 'text-slate-600 hover:bg-gray-50'}`}
              >
                📄 Kurumsal Sayfalar
              </button>
           </div>
        </div>

        {/* EDITOR AREA */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
           
           {activeTab === 'layout' && (
             <div className="space-y-6 animate-fade-in-up">
               <h2 className="text-2xl font-black text-slate-900 border-b border-gray-100 pb-4 mb-8">Sürükle & Bırak ile Sayfa Düzeni (Layout Builder)</h2>
               <p className="text-gray-500 mb-6 font-medium">Aşağıdaki blokları farenizle tutup sürükleyerek ana sayfadaki yerlerini değiştirebilirsiniz. Yukarıdaki yayınla butonuna bastığınızda site anında güncellenir.</p>
               
               <div className="space-y-3">
                 {layoutArray.map((sectionId, index) => (
                   <div 
                     key={sectionId}
                     draggable
                     onDragStart={() => handleDragStart(index)}
                     onDragEnter={() => handleDragEnter(index)}
                     onDragEnd={handleDragEnd}
                     onDragOver={(e) => e.preventDefault()}
                     className={`flex items-center justify-between p-5 bg-white border-2 rounded-2xl cursor-grab active:cursor-grabbing transition-all ${draggedItemIndex === index ? 'opacity-50 border-accent-500 shadow-xl scale-105' : 'border-gray-200 hover:border-slate-400 hover:shadow-md'}`}
                   >
                     <div className="flex items-center gap-4">
                       <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                         <FiMove size={24} />
                       </div>
                       <div>
                         <h3 className="font-bold text-slate-900 text-lg">{SECTION_NAMES[sectionId] || sectionId}</h3>
                       </div>
                     </div>
                     <div className="flex flex-col gap-1">
                       <button 
                         onClick={() => moveItem(index, 'up')}
                         disabled={index === 0}
                         className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                         title="Yukarı Taşı"
                       >
                         ▲
                       </button>
                       <button 
                         onClick={() => moveItem(index, 'down')}
                         disabled={index === layoutArray.length - 1}
                         className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                         title="Aşağı Taşı"
                       >
                         ▼
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {activeTab === 'home' && (
             <div className="space-y-6 animate-fade-in-up">
               <h2 className="text-2xl font-black text-slate-900 border-b border-gray-100 pb-4 mb-8">Ana Sayfa (Hero Banner)</h2>
               
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Büyük Karşılama Başlığı</label>
                  <input 
                    type="text" 
                    value={settings.homeHeroTitle} 
                    onChange={e => handleChange('homeHeroTitle', e.target.value)} 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-black text-lg"
                  />
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Alt Açıklama Metni</label>
                  <textarea 
                    value={settings.homeHeroSubtitle} 
                    onChange={e => handleChange('homeHeroSubtitle', e.target.value)} 
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium resize-none"
                  />
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Birincil Buton Yazısı</label>
                  <input 
                    type="text" 
                    value={settings.homeHeroButton} 
                    onChange={e => handleChange('homeHeroButton', e.target.value)} 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold"
                  />
               </div>

               <h2 className="text-2xl font-black text-slate-900 border-b border-gray-100 pb-4 mt-12 mb-8">Kategoriler Bölümü</h2>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Kategori Başlığı</label>
                  <input 
                    type="text" 
                    value={settings.homeCategoriesTitle} 
                    onChange={e => handleChange('homeCategoriesTitle', e.target.value)} 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Kategori Açıklaması</label>
                  <textarea 
                    value={settings.homeCategoriesDesc} 
                    onChange={e => handleChange('homeCategoriesDesc', e.target.value)} 
                    rows={2}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium resize-none"
                  />
               </div>

               <h2 className="text-2xl font-black text-slate-900 border-b border-gray-100 pb-4 mt-12 mb-8">Öne Çıkan Ürünler Bölümü</h2>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Ürünler Başlığı</label>
                  <input 
                    type="text" 
                    value={settings.homeTrendingTitle} 
                    onChange={e => handleChange('homeTrendingTitle', e.target.value)} 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Ürünler Açıklaması</label>
                  <textarea 
                    value={settings.homeTrendingDesc} 
                    onChange={e => handleChange('homeTrendingDesc', e.target.value)} 
                    rows={2}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium resize-none"
                  />
               </div>

               <h2 className="text-2xl font-black text-slate-900 border-b border-gray-100 pb-4 mt-12 mb-8">Bilgi Bandı (Kartlar)</h2>
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* KART 1 */}
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">🚀 1. Kart (Sol)</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 mb-2">Başlık</label>
                       <input 
                         type="text" 
                         value={settings.infoCard1Title} 
                         onChange={e => handleChange('infoCard1Title', e.target.value)} 
                         className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none font-bold text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 mb-2">Açıklama</label>
                       <textarea 
                         value={settings.infoCard1Desc} 
                         onChange={e => handleChange('infoCard1Desc', e.target.value)} 
                         rows={3}
                         className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none font-medium text-sm resize-none"
                       />
                     </div>
                   </div>
                 </div>

                 {/* KART 2 */}
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">🛡️ 2. Kart (Orta)</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 mb-2">Başlık</label>
                       <input 
                         type="text" 
                         value={settings.infoCard2Title} 
                         onChange={e => handleChange('infoCard2Title', e.target.value)} 
                         className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none font-bold text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 mb-2">Açıklama</label>
                       <textarea 
                         value={settings.infoCard2Desc} 
                         onChange={e => handleChange('infoCard2Desc', e.target.value)} 
                         rows={3}
                         className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none font-medium text-sm resize-none"
                       />
                     </div>
                   </div>
                 </div>

                 {/* KART 3 */}
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">🔄 3. Kart (Sağ)</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 mb-2">Başlık</label>
                       <input 
                         type="text" 
                         value={settings.infoCard3Title} 
                         onChange={e => handleChange('infoCard3Title', e.target.value)} 
                         className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none font-bold text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 mb-2">Açıklama</label>
                       <textarea 
                         value={settings.infoCard3Desc} 
                         onChange={e => handleChange('infoCard3Desc', e.target.value)} 
                         rows={3}
                         className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none font-medium text-sm resize-none"
                       />
                     </div>
                   </div>
                 </div>
               </div>

             </div>
           )}

           {activeTab === 'contact' && (
             <div className="space-y-6 animate-fade-in-up">
               <h2 className="text-2xl font-black text-slate-900 border-b border-gray-100 pb-4 mb-8">İletişim Sayfası İçeriği</h2>
               
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Sayfa Üstü Açıklama Metni</label>
                  <textarea 
                    value={settings.contactPageDesc} 
                    onChange={e => handleChange('contactPageDesc', e.target.value)} 
                    rows={3}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium resize-none"
                  />
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Google Maps Embed (Iframe) Kodu</label>
                  <textarea 
                    value={settings.contactMapEmbed} 
                    onChange={e => handleChange('contactMapEmbed', e.target.value)} 
                    rows={4}
                    placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ></iframe>'
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-mono text-sm resize-none"
                  />
               </div>
             </div>
           )}

           {activeTab === 'footer' && (
             <div className="space-y-6 animate-fade-in-up">
               <h2 className="text-2xl font-black text-slate-900 border-b border-gray-100 pb-4 mb-8">Footer Ayarları</h2>
               
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Hakkımızda / Tanıtım Yazısı (Logo Altı)</label>
                  <textarea 
                    value={settings.footerAboutText} 
                    onChange={e => handleChange('footerAboutText', e.target.value)} 
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium resize-none"
                  />
               </div>
             </div>
           )}

           {activeTab === 'customPages' && (
             <div className="space-y-6 animate-fade-in-up">
               
               {!editingPage ? (
                 <>
                   <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8">
                     <h2 className="text-2xl font-black text-slate-900">Kurumsal Sayfalar</h2>
                     <button 
                       onClick={() => setEditingPage({ title: '', slug: '', content: '', isActive: true })}
                       className="bg-accent-100 text-accent-700 hover:bg-accent-200 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
                     >
                       <FiPlus /> Yeni Ekle
                     </button>
                   </div>
                   
                   {pages.length === 0 ? (
                     <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                       <p className="text-gray-500 font-medium">Henüz bir kurumsal sayfa oluşturmadınız.</p>
                     </div>
                   ) : (
                     <div className="space-y-3">
                       {pages.map(page => (
                         <div key={page.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-accent-300 transition shadow-sm">
                           <div>
                             <h3 className="font-bold text-slate-900">{page.title}</h3>
                             <p className="text-xs text-gray-500 mt-1">/sayfa/{page.slug}</p>
                           </div>
                           <div className="flex items-center gap-2">
                             <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${page.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                               {page.isActive ? 'Aktif' : 'Pasif'}
                             </span>
                             <button onClick={() => setEditingPage(page)} className="p-2 text-slate-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition">
                               <FiEdit2 />
                             </button>
                             <button onClick={() => handleDeletePage(page.id)} className="p-2 text-slate-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition">
                               <FiTrash2 />
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </>
               ) : (
                 <>
                   <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8">
                     <h2 className="text-2xl font-black text-slate-900">{editingPage.id ? 'Sayfayı Düzenle' : 'Yeni Sayfa Oluştur'}</h2>
                     <button onClick={() => setEditingPage(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                       <FiX />
                     </button>
                   </div>
                   
                   <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Sayfa Başlığı</label>
                         <input 
                           type="text" 
                           value={editingPage.title}
                           onChange={e => setEditingPage({...editingPage, title: e.target.value})}
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">URL (Slug)</label>
                         <input 
                           type="text" 
                           value={editingPage.slug}
                           onChange={e => setEditingPage({...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                           placeholder="ornek-sayfa"
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                         />
                       </div>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Sayfa İçeriği (Markdown veya HTML destekli değil, düz metin)</label>
                       <textarea 
                         value={editingPage.content}
                         onChange={e => setEditingPage({...editingPage, content: e.target.value})}
                         rows={12}
                         className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none font-medium"
                         placeholder="Sayfa içeriğinizi buraya yazın..."
                       />
                     </div>
                     
                     <div className="flex items-center gap-3">
                       <input 
                         type="checkbox" 
                         id="isActive" 
                         checked={editingPage.isActive}
                         onChange={e => setEditingPage({...editingPage, isActive: e.target.checked})}
                         className="w-5 h-5 accent-accent-600"
                       />
                       <label htmlFor="isActive" className="font-bold text-slate-700 cursor-pointer">Sayfa Yayınlansın Mı? (Aktif)</label>
                     </div>
                     
                     <div className="pt-4 flex justify-end">
                       <button 
                         onClick={handleSavePage} 
                         disabled={saving}
                         className="bg-accent-600 hover:bg-accent-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
                       >
                         {saving ? 'Kaydediliyor...' : 'Sayfayı Kaydet'}
                       </button>
                     </div>
                   </div>
                 </>
               )}
               
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
