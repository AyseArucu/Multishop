"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiImage, FiUploadCloud } from "react-icons/fi";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatParent, setNewCatParent] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [customColor, setCustomColor] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    categoryId: "",
    videoUrl: "",
    showVideoInSlider: true,
    imageUrls: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    colorImages: {} as Record<string, string>,
    colorPrices: {} as Record<string, { price?: number, originalPrice?: number }>,
    storeInfo: "",
    deliveryInfo: "",
    installmentInfo: "",
    productDetails: "",
    isNew: false,
    isDiscounted: false
  });

  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch('/api/categories', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setCategories(data || []);
        if (data && data.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      })
      .catch(err => {
         console.error(err);
         showToast('error', "Kategoriler yüklenemedi. Lütfen sayfayı yenileyin.");
      });
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      showToast('error', 'Kategori adı giriniz.');
      return;
    }
    setAddingCat(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, parentId: newCatParent || null })
      });
      if (res.ok) {
        const newCat = await res.json();
        showToast('success', 'Kategori eklendi!');
        setNewCatName('');
        setNewCatParent('');
        setIsAddingCategory(false);
        setFormData(prev => ({ ...prev, categoryId: newCat.id }));
        fetchCategories();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Hata oluştu');
      }
    } catch (e) {
      showToast('error', 'Bağlantı hatası');
    } finally {
      setAddingCat(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, data.url] }));
        showToast('success', 'Görsel yüklendi!');
      } else {
        showToast('error', data.error || "Görsel yüklenemedi.");
      }
    } catch (err) {
      console.error(err);
      showToast('error', "Yükleme sırasında hata oluştu!");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploadingVideo(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, videoUrl: data.url }));
        showToast('success', 'Video yüklendi!');
      } else {
        showToast('error', data.error || "Video yüklenemedi.");
      }
    } catch (err) {
      console.error(err);
      showToast('error', "Yükleme sırasında hata oluştu!");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
       showToast('error', "Lütfen önce bir kategori seçin veya oluşturun!");
       return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        images: formData.imageUrls,
        colors: formData.colors,
        colorImages: formData.colorImages,
        colorPrices: formData.colorPrices,
        storeInfo: formData.storeInfo,
        deliveryInfo: formData.deliveryInfo,
        installmentInfo: formData.installmentInfo,
        productDetails: formData.productDetails,
        videoUrl: formData.videoUrl,
        showVideoInSlider: formData.showVideoInSlider,
        isNew: formData.isNew,
        isDiscounted: formData.isDiscounted
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        showToast('success', "Ürün başarıyla eklendi!");
        setTimeout(() => {
          router.push('/admin/products');
          router.refresh();
        }, 1000);
      } else {
        const errorData = await res.json();
        showToast('error', errorData.error || "Ürün eklenirken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      showToast('error', "Bağlantı hatası!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 min-h-screen pb-24 relative">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up font-bold text-white ${toastMsg.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
           {toastMsg.text}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-slate-900 hover:border-slate-400 transition-colors shadow-sm">
             <FiArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Yeni Ürün Ekle</h1>
            <p className="text-gray-500 font-medium">Mağazanıza yeni bir ürün ekleyin ve detaylarını yapılandırın.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL KOLON - ANA BİLGİLER */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Temel Bilgiler</h2>
             
             <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ürün Adı</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Örn: Siyah Basic Tişört"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ürün Açıklaması</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Ürün hakkında detaylı, müşteriyi ikna edecek bir açıklama yazın..."
                    rows={8}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>
             </div>
           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Fiyatlandırma ve Stok</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Fiyat (₺)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => {
                      const newPrice = e.target.value;
                      setFormData({...formData, price: newPrice});
                    }}
                    placeholder="0.00"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-black text-slate-900 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">İndirim Oranı (%)</label>
                  <input 
                    type="number" 
                    placeholder="Örn: 20"
                    onChange={(e) => {
                      const discount = parseFloat(e.target.value);
                      const currentPrice = parseFloat(formData.price);
                      if (!isNaN(discount) && !isNaN(currentPrice) && discount > 0 && discount < 100) {
                        const calculatedOrig = currentPrice / (1 - (discount / 100));
                        setFormData({...formData, originalPrice: calculatedOrig.toFixed(2), isDiscounted: true});
                      }
                    }}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-bold text-slate-900 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Eski Fiyat (₺)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    placeholder="Hesaplanan / Manuel"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-medium text-slate-500 text-lg line-through"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Stok Adedi</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="0"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-bold text-slate-900 text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <input 
                      type="checkbox" 
                      checked={formData.isNew}
                      onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                      className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-slate-900 checked:border-slate-900 transition-all cursor-pointer"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Yeni Sezon Etiketi Ekle</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <input 
                      type="checkbox" 
                      checked={formData.isDiscounted}
                      onChange={(e) => setFormData({...formData, isDiscounted: e.target.checked})}
                      className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-slate-900 checked:border-slate-900 transition-all cursor-pointer"
                    />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">İndirimli Ürün Etiketi Ekle</span>
                </label>
              </div>
           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Ek Özellikler (Akordeon)</h2>
             
             <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Teslimat & İade</label>
                  <textarea 
                    value={formData.deliveryInfo}
                    onChange={(e) => setFormData({...formData, deliveryInfo: e.target.value})}
                    placeholder="Teslimat ve iade şartları..."
                    rows={3}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Taksit Seçenekleri</label>
                  <textarea 
                    value={formData.installmentInfo}
                    onChange={(e) => setFormData({...formData, installmentInfo: e.target.value})}
                    placeholder="Taksit bilgileri..."
                    rows={3}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ürün Özellikleri (Maddeler Halinde)</label>
                  <div className="space-y-3">
                    {(formData.productDetails ? formData.productDetails.split('\n') : []).map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="font-bold text-gray-400 w-5">{idx + 1}.</span>
                        <input 
                          type="text" 
                          value={item} 
                          onChange={(e) => {
                            const items = formData.productDetails ? formData.productDetails.split('\n') : [];
                            items[idx] = e.target.value;
                            setFormData({...formData, productDetails: items.join('\n')});
                          }} 
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900" 
                          placeholder="Örn: %100 Pamuklu Kumaş" 
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const items = formData.productDetails.split('\n').filter((_, i) => i !== idx);
                            setFormData({...formData, productDetails: items.join('\n')});
                          }} 
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                          title="Sil"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => {
                        const items = formData.productDetails ? formData.productDetails.split('\n') : [];
                        items.push('');
                        setFormData({...formData, productDetails: items.join('\n')});
                      }} 
                      className="text-sm font-bold text-slate-700 hover:text-slate-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mt-2"
                    >
                      <span>+</span> Yeni Madde Ekle
                    </button>
                  </div>
                </div>
             </div>
           </div>
        </div>

        {/* SAĞ KOLON - MEDYA VE KATEGORİ */}
        <div className="space-y-8">
           
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
               <h2 className="text-xl font-bold text-slate-900">Kategori</h2>
               <button 
                 type="button" 
                 onClick={() => setIsAddingCategory(!isAddingCategory)}
                 className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1 rounded-lg transition-colors"
               >
                 {isAddingCategory ? 'İptal' : '+ Yeni Kategori'}
               </button>
             </div>
             
             {isAddingCategory ? (
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Adı</label>
                   <input 
                     type="text" 
                     value={newCatName}
                     onChange={(e) => setNewCatName(e.target.value)}
                     className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-primary-500"
                     placeholder="Örn: Giyim"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1">Üst Kategori (Opsiyonel)</label>
                   <select 
                     value={newCatParent}
                     onChange={(e) => setNewCatParent(e.target.value)}
                     className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-primary-500"
                   >
                     <option value="">-- Yok (Ana Kategori) --</option>
                     {categories.map(cat => (
                       <option key={`parent-${cat.id}`} value={cat.id}>{cat.name}</option>
                     ))}
                   </select>
                 </div>
                 <button 
                   type="button" 
                   onClick={handleAddCategory}
                   disabled={addingCat}
                   className="w-full bg-slate-800 text-white font-bold py-2 rounded-lg text-sm hover:bg-slate-900 transition-colors"
                 >
                   {addingCat ? 'Ekleniyor...' : 'Kategoriyi Ekle'}
                 </button>
               </div>
             ) : (
               <>
                 {categories.length === 0 ? (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm font-medium mb-4">
                       Sistemde hiç kategori bulunmuyor. Önce kategori eklemelisiniz.
                    </div>
                 ) : (
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Ürün Kategorisini Seçin</label>
                      <select 
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-bold text-slate-900 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>-- Seçiniz --</option>
                        {categories.map(cat => {
                          const parent = cat.parentId ? categories.find(c => c.id === cat.parentId) : null;
                          const displayName = parent ? `${parent.name} > ${cat.name}` : cat.name;
                          return <option key={`cat-${cat.id}`} value={cat.id}>{displayName}</option>;
                        })}
                      </select>
                    </div>
                 )}
               </>
             )}
           </div>

           {/* RENKLER */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Renk Seçenekleri</h2>
             <div className="flex flex-wrap gap-2 mb-4">
               {Array.from(new Set(["Siyah", "Beyaz", "Kırmızı", "Mavi", "Yeşil", "Sarı", "Gri", "Bej", "Kahverengi", "Pembe", "Mor", "Turuncu", "Lacivert", "Bordo", "Bebe Mavisi", "Çok Renkli", ...formData.colors])).map(color => {
                 const isSelected = formData.colors.includes(color);
                 return (
                   <button
                     type="button"
                     key={color}
                     onClick={() => {
                       setFormData(prev => ({
                         ...prev,
                         colors: isSelected ? prev.colors.filter(c => c !== color) : [...prev.colors, color]
                       }))
                     }}
                     className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${isSelected ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-gray-200 hover:border-slate-400'}`}
                   >
                     {color}
                   </button>
                 )
               })}
             </div>
             
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customColor} 
                  onChange={(e) => setCustomColor(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const c = customColor.trim();
                      if (c && !formData.colors.includes(c)) {
                         setFormData(prev => ({ ...prev, colors: [...prev.colors, c] }));
                         setCustomColor("");
                      }
                    }
                  }}
                  placeholder="Farklı bir renk yazın (Örn: Bordo)..." 
                  className="flex-1 max-w-[250px] p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-primary-500"
                />
                <button 
                  type="button" 
                  onClick={() => {
                    const c = customColor.trim();
                    if (c && !formData.colors.includes(c)) {
                       setFormData(prev => ({ ...prev, colors: [...prev.colors, c] }));
                       setCustomColor("");
                    }
                  }}
                  className="bg-slate-900 text-white px-4 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Listeye Ekle
                </button>
             </div>

              {formData.colors.length > 0 && (
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h3 className="font-bold text-sm text-slate-900 mb-4">Seçilen Renklere Özel Görsel ve Fiyat</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {formData.colors.map(color => (
                      <div key={`img-${color}`} className="bg-slate-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center">
                        <span className="font-bold text-sm text-slate-700 mb-3">{color}</span>
                        
                        <div className="w-full space-y-2 mb-4">
                           <input type="number" placeholder="Özel Fiyat (₺)" className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-slate-900 outline-none"
                             value={formData.colorPrices[color]?.price || ''}
                             onChange={(e) => setFormData(prev => ({
                               ...prev, 
                               colorPrices: {
                                 ...prev.colorPrices,
                                 [color]: { ...prev.colorPrices[color], price: e.target.value ? parseFloat(e.target.value) : undefined }
                               }
                             }))}
                           />
                           <input type="number" placeholder="Özel Eski Fiyat (₺)" className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-slate-900 outline-none"
                             value={formData.colorPrices[color]?.originalPrice || ''}
                             onChange={(e) => setFormData(prev => ({
                               ...prev, 
                               colorPrices: {
                                 ...prev.colorPrices,
                                 [color]: { ...prev.colorPrices[color], originalPrice: e.target.value ? parseFloat(e.target.value) : undefined }
                               }
                             }))}
                           />
                        </div>
                       {formData.colorImages[color] ? (
                         <div className="relative group w-full aspect-square rounded-lg overflow-hidden bg-white border border-gray-200">
                           <img src={formData.colorImages[color]} alt={color} className="w-full h-full object-contain" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                             <button type="button" onClick={() => {
                               const newColorImages = {...formData.colorImages};
                               delete newColorImages[color];
                               setFormData({...formData, colorImages: newColorImages});
                             }} className="text-white text-[10px] font-bold bg-red-500 px-2 py-1 rounded">Kaldır</button>
                           </div>
                         </div>
                       ) : (
                         <label className="cursor-pointer w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-white transition-colors bg-transparent">
                           <span className="text-[10px] font-bold text-gray-500">Görsel Seç</span>
                           <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                             if (!e.target.files || e.target.files.length === 0) return;
                             const file = e.target.files[0];
                             const uploadData = new FormData();
                             uploadData.append('file', file);
                             try {
                               const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
                               const data = await res.json();
                               if (data.success) {
                                 setFormData(prev => ({ ...prev, colorImages: { ...prev.colorImages, [color]: data.url } }));
                               }
                             } catch (err) {
                               console.error(err);
                             }
                           }} />
                         </label>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>

           {/* BEDENLER */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
             <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Beden Seçenekleri</h2>
             <div className="flex flex-wrap gap-2 mb-4">
               {Array.from(new Set(["XS", "S", "M", "L", "XL", "XXL", "3XL", "Standart", ...formData.sizes])).map(size => {
                 const isSelected = formData.sizes.includes(size);
                 return (
                   <button
                     type="button"
                     key={size}
                     onClick={() => {
                       setFormData(prev => ({
                         ...prev,
                         sizes: isSelected ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
                       }))
                     }}
                     className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${isSelected ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-gray-200 hover:border-slate-400'}`}
                   >
                     {size}
                   </button>
                 )
               })}
             </div>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  id="newSizeInput"
                  placeholder="Farklı bir beden ekle (Örn: 42, 44)" 
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-400 font-medium"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val && !formData.sizes.includes(val)) {
                        setFormData(prev => ({ ...prev, sizes: [...prev.sizes, val] }));
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('newSizeInput') as HTMLInputElement;
                    const val = input.value.trim();
                    if (val && !formData.sizes.includes(val)) {
                      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, val] }));
                      input.value = '';
                    }
                  }}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold"
                >Ekle</button>
             </div>
           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Ürün Görseli</h2>
             
             <div className="grid grid-cols-2 gap-4 mb-4">
               {formData.imageUrls.map((url, idx) => (
                 <div key={idx} className="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-square bg-gray-50 flex items-center justify-center">
                   <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-contain" />
                   <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== idx)})} 
                        className="bg-red-500 text-white text-sm font-bold py-1.5 px-3 rounded-lg"
                      >
                        Kaldır
                      </button>
                   </div>
                 </div>
               ))}
               
               {/* Yeni Resim Ekleme Kutusu */}
               <label className="cursor-pointer flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-primary-500 transition-colors relative overflow-hidden">
                 <div className="flex flex-col items-center justify-center text-gray-500">
                   {uploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
                   ) : (
                      <FiUploadCloud size={32} className="mb-2 text-gray-400" />
                   )}
                   <p className="text-xs font-bold text-slate-700 text-center px-2">
                     {uploading ? 'Yükleniyor...' : 'Tıkla/Sürükle'}
                   </p>
                 </div>
                 <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
               </label>
             </div>

           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Ürün Videosu</h2>
             
             {formData.videoUrl ? (
               <div className="space-y-4">
                 <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                   <video src={formData.videoUrl} controls className="w-full h-auto max-h-[300px] object-contain" />
                   <div className="absolute top-2 right-2">
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, videoUrl: ""})} 
                        className="bg-red-500 text-white text-sm font-bold py-1.5 px-3 rounded-lg shadow-md"
                      >
                        Kaldır
                      </button>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3 p-4 bg-slate-50 border border-gray-200 rounded-xl">
                   <div className="relative flex items-center justify-center w-6 h-6">
                     <input 
                       type="checkbox" 
                       checked={formData.showVideoInSlider}
                       onChange={(e) => setFormData({...formData, showVideoInSlider: e.target.checked})}
                       className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-slate-900 checked:border-slate-900 transition-all cursor-pointer"
                     />
                     <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                       <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </div>
                   </div>
                   <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">Videoyu Resim Galerisi (Slider) İçinde Göster</span>
                      <span className="text-xs text-slate-500 font-medium">Kapatırsanız video galeri dışında (alt tarafta) büyük şekilde gösterilir.</span>
                   </div>
                 </div>
               </div>
             ) : (
               <label className="cursor-pointer flex flex-col items-center justify-center w-full h-[150px] border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-primary-500 transition-colors relative overflow-hidden">
                 <div className="flex flex-col items-center justify-center text-gray-500">
                   {uploadingVideo ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
                   ) : (
                      <FiUploadCloud size={32} className="mb-2 text-gray-400" />
                   )}
                   <p className="text-sm font-bold text-slate-700 text-center px-2">
                     {uploadingVideo ? 'Video Yükleniyor...' : 'Video Seç (MP4, MOV vb.)'}
                   </p>
                 </div>
                 <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} disabled={uploadingVideo} />
               </label>
             )}
           </div>

           <button 
             type="submit" 
             disabled={loading || uploading || uploadingVideo}
             className="w-full bg-slate-900 hover:bg-primary-600 disabled:opacity-50 text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg"
           >
             <FiSave size={24} /> {loading ? 'Kaydediliyor...' : 'Ürünü Yayınla'}
           </button>
        </div>
      </form>
    </div>
  );
}
