"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FiPercent, FiEye, FiFilter, FiX } from "react-icons/fi";

export default function CampaignsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || "");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || "");
  const [selectedColor, setSelectedColor] = useState<string>(searchParams.get('color') || "");
  const [selectedSize, setSelectedSize] = useState<string>(searchParams.get('size') || "");
  const [inStockOnly, setInStockOnly] = useState<boolean>(searchParams.get('inStock') === 'true');

  useEffect(() => {
    // Fetch categories for sidebar
    fetch('/api/categories', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setCategories(data || []));
  }, []);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        query.append('discount', 'true');
        if (selectedCategory) query.append('category', selectedCategory);
        if (minPrice) query.append('minPrice', minPrice);
        if (maxPrice) query.append('maxPrice', maxPrice);
        if (selectedColor) query.append('color', selectedColor);
        if (selectedSize) query.append('size', selectedSize);
        if (inStockOnly) query.append('inStock', 'true');

        const res = await fetch(`/api/products?${query.toString()}`, { cache: 'no-store' });
        const data = await res.json();
        
        // Include products that are explicitly marked as discounted, or have an originalPrice > price
        const discountedProducts = (data.products || []).filter((p: any) => 
          p.isDiscounted || (p.originalPrice && p.originalPrice > p.price)
        );
        
        setProducts(discountedProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscountedProducts();
  }, [selectedCategory, minPrice, maxPrice, selectedColor, selectedSize, inStockOnly]);

  const applyFilters = () => {
    const query = new URLSearchParams();
    if (selectedCategory) query.append('category', selectedCategory);
    if (minPrice) query.append('minPrice', minPrice);
    if (maxPrice) query.append('maxPrice', maxPrice);
    if (selectedColor) query.append('color', selectedColor);
    if (selectedSize) query.append('size', selectedSize);
    if (inStockOnly) query.append('inStock', 'true');
    
    router.push(`/campaigns?${query.toString()}`);
    setIsSidebarOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedColor("");
    setSelectedSize("");
    setInStockOnly(false);
    router.push(`/campaigns`);
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 mt-8">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-100 text-accent-600 rounded-full mb-4">
              <FiPercent size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Fırsatlar</h1>
            <p className="text-gray-500 mt-2 text-lg">Sınırlı süreli indirimleri ve size özel fırsatları kaçırmayın.</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-xl font-bold text-slate-700 shadow-sm"
          >
            <FiFilter size={20} /> Filtrele
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR FILTER */}
          <aside className={`fixed inset-y-0 left-0 z-50 md:z-0 w-80 bg-white shadow-2xl p-6 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-1/4 md:bg-transparent md:shadow-none md:p-0 md:block ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
             <div className="flex justify-between items-center md:hidden mb-6">
                <h2 className="text-2xl font-black text-slate-900">Filtreler</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                  <FiX size={20} />
                </button>
             </div>

             <div className="bg-white md:p-6 md:rounded-3xl md:shadow-sm md:border md:border-gray-100 space-y-8">
                
                {/* Kategori Filtresi */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2">Kategoriler</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category"
                        checked={selectedCategory === ""}
                        onChange={() => setSelectedCategory("")}
                        className="w-5 h-5 accent-slate-900 cursor-pointer"
                      />
                      <span className={`font-medium transition-colors ${selectedCategory === "" ? 'text-slate-900 font-bold' : 'text-gray-600 group-hover:text-slate-900'}`}>Tümü</span>
                    </label>
                    {categories.map(cat => (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="category"
                          checked={selectedCategory === cat.id}
                          onChange={() => setSelectedCategory(cat.id)}
                          className="w-5 h-5 accent-slate-900 cursor-pointer"
                        />
                        <span className={`font-medium transition-colors ${selectedCategory === cat.id ? 'text-slate-900 font-bold' : 'text-gray-600 group-hover:text-slate-900'}`}>
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fiyat Filtresi */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2">Fiyat Aralığı</h3>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="Min ₺"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-400 font-medium"
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                      type="number" 
                      placeholder="Max ₺"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Renk Filtresi */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2">Renk</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Siyah', 'Beyaz', 'Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Gri', 'Pembe', 'Mor', 'Kahverengi'].map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(selectedColor === c ? "" : c)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedColor === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-600 border-gray-200 hover:border-slate-400'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Beden Filtresi */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2">Beden</h3>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Standart'].map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors ${selectedSize === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-600 border-gray-200 hover:border-slate-400'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stok Filtresi */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-gray-100 pb-2">Stok Durumu</h3>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-5 h-5 rounded accent-slate-900 cursor-pointer"
                    />
                    <span className="font-medium text-gray-600 group-hover:text-slate-900 transition-colors">Sadece Stokta Olanlar</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <button onClick={applyFilters} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg transition-colors">
                    Filtreleri Uygula
                  </button>
                  {(selectedCategory || minPrice || maxPrice || selectedColor || selectedSize || inStockOnly) && (
                    <button onClick={clearFilters} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-bold py-3 rounded-xl transition-colors">
                      Temizle
                    </button>
                  )}
                </div>

             </div>
          </aside>

          {/* OVERLAY FOR MOBILE SIDEBAR */}
          {isSidebarOpen && (
            <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"></div>
          )}

          {/* PRODUCT GRID */}
          <main className="md:w-3/4">
             {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {[1,2,3,4,5,6,7,8].map(i => (
                     <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-pulse h-[400px]">
                        <div className="w-full h-64 bg-gray-100 rounded-2xl mb-4"></div>
                        <div className="w-3/4 h-6 bg-gray-100 rounded-md mb-2"></div>
                        <div className="w-1/2 h-8 bg-gray-100 rounded-md"></div>
                     </div>
                   ))}
                </div>
             ) : products.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                   <div className="w-24 h-24 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiPercent size={40} className="text-accent-500" />
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 mb-2">Fırsat Ürünü Bulunamadı</h2>
                   <p className="text-gray-500 font-medium max-w-sm mx-auto mb-6">Mevcut kampanyalarımız sona ermiş veya seçtiğiniz filtrelere uygun indirimli ürün kalmamış olabilir.</p>
                   <button onClick={clearFilters} className="bg-slate-900 hover:bg-primary-600 transition-colors text-white px-8 py-3 rounded-xl font-bold">Filtreleri Temizle</button>
                </div>
             ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {currentProducts.map(product => {
                   let discountPercent = 0;
                   if (product.originalPrice && product.originalPrice > product.price) {
                     discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                   }
                   
                   return (
                     <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col bg-white rounded-[2rem] border border-gray-100/80 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary-200 transition-all duration-500 overflow-hidden relative">
                       <div className="relative aspect-[4/5] bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                          {/* Kırmızı İndirim Rozeti */}
                          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                            <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                              {discountPercent > 0 ? `%${discountPercent} İNDİRİM` : 'İNDİRİM'}
                            </span>
                          </div>

                          {/* Favorite Fake Button */}
                          <button onClick={(e) => e.preventDefault()} className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-gray-400 hover:text-pink-500 hover:scale-110 transition-all duration-300 border border-white/50 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                          </button>

                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold">Görsel Yok</div>
                          )}
                          
                          {/* View Overlay (Eye Icon) */}
                          <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
                            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300 delay-100">
                              <FiEye size={22} />
                            </div>
                          </div>
                       </div>
                       <div className="p-5 flex flex-col flex-grow bg-white z-10">
                         <p className="text-[11px] text-gray-400 font-bold mb-2 uppercase tracking-widest">{product.category?.name}</p>
                         <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-1 group-hover:text-pink-600 transition-colors">{product.title}</h3>
                         
                         <div className="mt-auto flex items-end justify-between">
                           <div className="flex flex-col">
                              {product.originalPrice && product.originalPrice > product.price && (
                                 <span className="text-xs font-bold text-gray-400 line-through mb-0.5">{product.originalPrice.toLocaleString('tr-TR')} ₺</span>
                              )}
                              <span className="text-xl font-black text-red-600 tracking-tight">{product.price.toLocaleString('tr-TR')} ₺</span>
                           </div>
                           <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                           </div>
                         </div>
                       </div>
                     </Link>
                   );
                 })}
               </div>
             )}
             
             {/* Pagination Controls */}
             {!loading && totalPages > 1 && (
               <div className="flex items-center justify-center gap-2 mt-12">
                 <button 
                   onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                   disabled={currentPage === 1}
                   className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-slate-700 disabled:opacity-50 hover:bg-gray-50 transition"
                 >
                   &lt;
                 </button>
                 
                 {[...Array(totalPages)].map((_, i) => (
                   <button
                     key={i}
                     onClick={() => { setCurrentPage(i + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                     className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'}`}
                   >
                     {i + 1}
                   </button>
                 ))}

                 <button 
                   onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                   disabled={currentPage === totalPages}
                   className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-slate-700 disabled:opacity-50 hover:bg-gray-50 transition"
                 >
                   &gt;
                 </button>
               </div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
}
