"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FiFilter, FiX, FiEye, FiShoppingCart } from "react-icons/fi";
import { useCartStore } from "@/store/useCartStore";

export default function ShopProductsPage() {
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || "");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || "");
  const [selectedColor, setSelectedColor] = useState<string>(searchParams.get('color') || "");
  const [selectedSize, setSelectedSize] = useState<string>(searchParams.get('size') || "");
  const [inStockOnly, setInStockOnly] = useState<boolean>(searchParams.get('inStock') === 'true');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;


  useEffect(() => {
    // Fetch categories for sidebar
    fetch('/api/categories', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
          console.error('Invalid categories data:', data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    // Fetch products based on filters
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedCategory) query.append('category', selectedCategory);
        if (minPrice) query.append('minPrice', minPrice);
        if (maxPrice) query.append('maxPrice', maxPrice);
        if (selectedColor) query.append('color', selectedColor);
        if (selectedSize) query.append('size', selectedSize);
        if (inStockOnly) query.append('inStock', 'true');

        const res = await fetch(`/api/products?${query.toString()}`, { cache: 'no-store' });
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, selectedColor, selectedSize, inStockOnly]);

  const applyFilters = () => {
    setCurrentPage(1);
    const query = new URLSearchParams();
    if (selectedCategory) query.append('category', selectedCategory);
    if (minPrice) query.append('minPrice', minPrice);
    if (maxPrice) query.append('maxPrice', maxPrice);
    if (selectedColor) query.append('color', selectedColor);
    if (selectedSize) query.append('size', selectedSize);
    if (inStockOnly) query.append('inStock', 'true');
    
    router.push(`/products?${query.toString()}`);
    setIsSidebarOpen(false);
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedColor("");
    setSelectedSize("");
    setInStockOnly(false);
    router.push(`/products`);
  };

  const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Tüm Ürünler</h1>
            <p className="text-gray-500 mt-2 text-lg">Size en uygun ürünleri keşfedin.</p>
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
                    {[
                      { name: 'Siyah', hex: '#000000' },
                      { name: 'Beyaz', hex: '#ffffff' },
                      { name: 'Kırmızı', hex: '#ef4444' },
                      { name: 'Mavi', hex: '#3b82f6' },
                      { name: 'Yeşil', hex: '#22c55e' },
                      { name: 'Sarı', hex: '#eab308' },
                      { name: 'Gri', hex: '#6b7280' },
                      { name: 'Pembe', hex: '#ec4899' },
                      { name: 'Mor', hex: '#a855f7' },
                      { name: 'Kahverengi', hex: '#92400e' }
                    ].map(c => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(selectedColor === c.name ? "" : c.name)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border border-gray-200 transition-all flex items-center justify-center ${selectedColor === c.name ? 'scale-110 ring-2 ring-pink-500 shadow-md' : 'hover:scale-110 shadow-sm'}`}
                        style={{ backgroundColor: c.hex }}
                        aria-label={c.name}
                      >
                        {selectedColor === c.name && (
                          <svg className={`w-4 h-4 ${['Beyaz', 'Sarı'].includes(c.name) ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        )}
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
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
                   <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiFilter size={40} className="text-gray-300" />
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 mb-2">Ürün Bulunamadı</h2>
                   <p className="text-gray-500 font-medium max-w-sm mx-auto mb-6">Seçtiğiniz filtrelere uygun bir ürün stoklarımızda kalmamış olabilir.</p>
                   <button onClick={clearFilters} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Filtreleri Temizle</button>
                </div>
             ) : (
                 <>
                   <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                 {paginatedProducts.map(product => (
                   <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col bg-white rounded-[2rem] border border-gray-100/80 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary-200 transition-all duration-500 overflow-hidden relative">
                     <div className="relative aspect-[4/5] bg-slate-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                          {product.stock === 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                              Tükendi
                            </span>
                          )}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="bg-red-700 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                              %{Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}
                            </span>
                          )}
                          {product.isNew && <span className="bg-pink-500 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm">YENİ SEZON</span>}
                          {product.isDiscounted && <span className="bg-orange-500 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm">İNDİRİMLİ</span>}
                        </div>

                        {/* Favorite Fake Button */}
                        <button onClick={(e) => e.preventDefault()} className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-gray-400 hover:text-pink-500 hover:scale-110 transition-all duration-300 border border-white/50 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </button>

                        {/* Add to Cart Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem({
                              id: product.id,
                              name: product.title,
                              price: product.price,
                              image: product.images?.[0] || '',
                              quantity: 1,
                              variant: 'M'
                            });
                          }}
                          className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center shadow-xl text-white hover:bg-pink-500 hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                          <FiShoppingCart size={16} />
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
                     <div className="p-3 sm:p-5 flex flex-col flex-grow bg-white z-10">
                       <p className="text-[11px] text-gray-400 font-bold mb-2 uppercase tracking-widest">{product.category?.name}</p>
                       <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-1 group-hover:text-pink-600 transition-colors">{product.title}</h3>
                       
                       <div className="mt-auto flex items-end justify-between">
                         <div className="flex flex-col">
                            {product.originalPrice && product.originalPrice > product.price && (
                               <span className="text-xs font-bold text-gray-400 line-through mb-0.5">{product.originalPrice.toLocaleString('tr-TR')} ₺</span>
                            )}
                            <span className="text-xl font-black text-slate-900 tracking-tight">{product.price.toLocaleString('tr-TR')} ₺</span>
                         </div>
                         <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                         </div>
                       </div>
                     </div>
                   </Link>
                 ))}
               </div>
               
               {/* Pagination Controls */}
               {totalPages > 1 && (
                 <div className="flex justify-center items-center gap-2 mt-12">
                   <button 
                     onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0,0); }}
                     disabled={currentPage === 1}
                     className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 hover:border-pink-500 hover:text-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     &laquo;
                   </button>
                   
                   {[...Array(totalPages)].map((_, i) => (
                     <button
                       key={i}
                       onClick={() => { setCurrentPage(i + 1); window.scrollTo(0,0); }}
                       className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${currentPage === i + 1 ? 'bg-pink-500 text-white shadow-md' : 'bg-white border border-gray-200 hover:border-pink-500 hover:text-pink-500 text-slate-600'}`}
                     >
                       {i + 1}
                     </button>
                   ))}

                   <button 
                     onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0,0); }}
                     disabled={currentPage === totalPages}
                     className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 hover:border-pink-500 hover:text-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     &raquo;
                   </button>
                 </div>
               )}
                 </>
             )}
          </main>

        </div>
      </div>
    </div>
  );
}
