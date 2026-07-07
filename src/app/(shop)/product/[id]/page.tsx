"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { FiHeart, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Gri');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [deliveryDrawerOpen, setDeliveryDrawerOpen] = useState(false);
  const [installmentsModalOpen, setInstallmentsModalOpen] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'teslimat' | 'iade'>('teslimat');
  const [added, setAdded] = useState(false);
  const [sizesOpen, setSizesOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Image Gallery States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  
  // Review States
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const router = useRouter();
  
  const addItem = useCartStore(state => state.addItem);
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  useEffect(() => {
    if (swiperInstance && typeof swiperInstance.slideTo === 'function') {
      setActiveImageIndex(0);
      swiperInstance.slideTo(0);
    }
  }, [selectedColor, swiperInstance]);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          setProduct(data.product);
          setSimilarProducts(data.similarProducts || []);
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]);
          }
        } else {
          router.push('/products');
        }
      })
      .catch(err => {
        console.error(err);
        router.push('/products');
      })
      .finally(() => setLoading(false));

    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data && data.bankInstallments) {
        try {
          setBanks(JSON.parse(data.bankInstallments));
        } catch(e) {}
      }
    });
  }, [params.id, router]);

  if (loading) {
    return <div className="min-h-screen pt-32 text-center text-gray-500">Ürün yükleniyor...</div>;
  }

  if (!product) return null;

  const currentPrice = product.colorPrices?.[selectedColor]?.price || product.price;
  const currentOriginalPrice = product.colorPrices?.[selectedColor]?.originalPrice || product.originalPrice;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    addItem({
      id: product.id,
      name: product.title,
      price: currentPrice,
      image: product.images?.[0] || '',
      quantity: quantity,
      variant: selectedVariant,
      color: selectedColor
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setReviewMessage("Yorum yapabilmek için giriş yapmalısınız.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewMessage("");

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          email: userEmail,
          comment: reviewComment,
          rating: 5
        })
      });

      const data = await res.json();
      if (data.success) {
        setReviewMessage("Yorumunuz başarıyla gönderildi, onaylandıktan sonra burada görünecektir.");
        setReviewComment("");
      } else {
        setReviewMessage(data.error || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      setReviewMessage("Bağlantı hatası.");
    } finally {
      setIsSubmittingReview(false);
    }
  };


  const displayImages = product?.images ? [...product.images] : [];
  if (product?.colorImages && product.colorImages[selectedColor]) {
    const colorImg = product.colorImages[selectedColor];
    if (displayImages.includes(colorImg)) {
      displayImages.splice(displayImages.indexOf(colorImg), 1);
    }
    displayImages.unshift(colorImg);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-6 lg:p-12 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Product Image Gallery */}
        <div className="flex flex-col gap-12 order-1 md:order-1">
          <div className="w-full flex items-center justify-center overflow-hidden relative group">
            {displayImages.length > 0 ? (
              <div className="w-full flex flex-col">
                <div className="relative w-full aspect-[3/4] bg-white group">
                  {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                    <span className="absolute top-4 left-4 z-10 bg-red-700 text-white text-xs font-bold tracking-widest px-3 py-1.5 shadow-sm">
                      %{Math.round((currentOriginalPrice - currentPrice) / currentOriginalPrice * 100)}
                    </span>
                  )}
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <FiHeart size={24} className={isFavorite(product.id) ? "fill-red-500 text-red-500" : ""} />
                  </button>
                  
                  <Swiper
                     key={selectedColor}
                     onSwiper={setSwiperInstance}
                     onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                     modules={[Navigation]}
                     navigation
                     className="w-full h-full"
                  >
                    {displayImages.map((img: string, index: number) => (
                      <SwiperSlide key={`${img}-${index}`} className="flex items-center justify-center bg-white">
                         <img src={img} alt={`${product.title} - ${index + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                      </SwiperSlide>
                    ))}
                    {product.videoUrl && product.showVideoInSlider !== false && (
                      <SwiperSlide key="video-slide" className="flex items-center justify-center bg-black">
                         <video src={product.videoUrl} controls className="w-full h-full object-contain" />
                      </SwiperSlide>
                    )}
                  </Swiper>
                </div>
                
                {/* Thumbnails */}
                {(displayImages.length > 1 || (displayImages.length > 0 && product.videoUrl && product.showVideoInSlider !== false)) && (
                  <div className="flex gap-4 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                    {displayImages.map((img: string, idx: number) => (
                      <button 
                        key={`${img}-${idx}`}
                        onClick={() => {
                          setActiveImageIndex(idx);
                          if (swiperInstance && typeof swiperInstance.slideTo === 'function') {
                            swiperInstance.slideTo(idx);
                          }
                        }}
                        className={`w-20 h-24 flex-shrink-0 border-2 overflow-hidden transition-all rounded-md bg-white ${activeImageIndex === idx ? 'border-slate-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} className="w-full h-full object-cover mix-blend-multiply" alt={`Thumbnail ${idx+1}`} />
                      </button>
                    ))}
                    {product.videoUrl && product.showVideoInSlider !== false && (
                      <button 
                        key="video-thumb"
                        onClick={() => {
                          setActiveImageIndex(displayImages.length);
                          if (swiperInstance && typeof swiperInstance.slideTo === 'function') {
                            swiperInstance.slideTo(displayImages.length);
                          }
                        }}
                        className={`w-20 h-24 flex-shrink-0 border-2 overflow-hidden transition-all rounded-md bg-slate-100 flex items-center justify-center ${activeImageIndex === displayImages.length ? 'border-slate-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <span className="text-[10px] font-bold text-slate-500">VİDEO</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-300 w-full aspect-[3/4] flex flex-col items-center justify-center bg-slate-50 relative group">
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="absolute top-4 left-4 z-10 bg-red-700 text-white text-xs font-bold tracking-widest px-3 py-1.5 shadow-sm">
                    %{Math.round((currentOriginalPrice - currentPrice) / currentOriginalPrice * 100)}
                  </span>
                )}
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <FiHeart size={24} className={isFavorite(product.id) ? "fill-red-500 text-red-500" : ""} />
                </button>
                Görsel Yok
              </div>
            )}
          </div>

          {/* Product Video (Separate Section) */}
          {product.videoUrl && product.showVideoInSlider === false && (
            <div className="w-full mt-6 bg-slate-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative group">
              <video 
                src={product.videoUrl} 
                controls 
                controlsList="nodownload"
                className="w-full h-auto max-h-[500px] object-contain"
                poster={product.images?.[0] || ""}
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-slate-900/80 text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded shadow-sm backdrop-blur-md">
                  ÜRÜN VİDEOSU
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Product Details */}
        <div className="space-y-6 flex flex-col order-2 md:order-2">
          <div className="space-y-2 border-b border-gray-100 pb-6">
            <Link href={`/products?category=${product.categoryId}`} className="text-[11px] text-gray-500 uppercase tracking-widest">
              {product.category?.name || 'Kategori'} | {product.id.substring(0,8).toUpperCase()}
            </Link>
            <h1 className="text-2xl font-light text-slate-900 leading-tight">{product.title}</h1>
            <div className="flex items-center gap-3 pt-2">
               <div className="text-xl font-bold text-pink-500">{currentPrice.toLocaleString('tr-TR')} TL</div>
               {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-sm text-slate-500 line-through font-medium">{currentOriginalPrice.toLocaleString('tr-TR')} TL</span>
               )}
            </div>
          </div>
          
          <div className="pt-2 relative">
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"></path></svg>
                 Beden Rehberi
               </span>
             </div>
             <button 
                onClick={() => setSizesOpen(!sizesOpen)}
                className="w-full flex justify-between items-center bg-white border border-slate-900 p-3 font-bold text-slate-900 hover:bg-slate-50 transition-colors text-sm rounded-md"
             >
                <span>Beden Seçimi: {selectedVariant} (UK {selectedVariant})</span>
                <FiChevronDown size={20} className={`transition-transform duration-300 ${sizesOpen ? 'rotate-180' : ''}`} />
             </button>
             {sizesOpen && (
               <div className="flex flex-wrap gap-2 mt-2 p-3 border border-t-0 border-gray-200 rounded-b-md bg-slate-50 shadow-inner">
                  {['S', 'M', 'L', 'XL'].map((v) => (
                    <button 
                      key={v}
                      onClick={() => { setSelectedVariant(v); setSizesOpen(false); }}
                      className={`flex-1 min-w-[60px] py-2 text-sm font-bold border transition-all rounded-md ${selectedVariant === v ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-gray-300 text-gray-600 bg-white hover:border-slate-400 hover:bg-gray-50'}`}
                    >
                      {v}
                    </button>
                  ))}
               </div>
             )}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="pt-2 mt-2">
              <div className="text-xs text-slate-500 mb-2">Renk: <span className="text-slate-900 font-bold">{selectedColor}</span></div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c: string) => {
                  const colorMap: Record<string, string> = {
                    'Siyah': 'bg-black border-black',
                    'Beyaz': 'bg-white border-gray-200',
                    'Kırmızı': 'bg-red-500 border-red-600',
                    'Mavi': 'bg-blue-500 border-blue-600',
                    'Yeşil': 'bg-green-500 border-green-600',
                    'Sarı': 'bg-yellow-400 border-yellow-500',
                    'Gri': 'bg-gray-500 border-gray-600',
                    'Bej': 'bg-[#F5F5DC] border-[#E8E8D0]',
                    'Kahverengi': 'bg-[#8B4513] border-[#703810]',
                    'Pembe': 'bg-pink-400 border-pink-500',
                    'Mor': 'bg-purple-500 border-purple-600',
                    'Turuncu': 'bg-orange-500 border-orange-600',
                    'Lacivert': 'bg-slate-800 border-slate-900',
                    'Bordo': 'bg-[#800000] border-[#600000]',
                    'Bebe Mavisi': 'bg-[#89CFF0] border-[#5C90C2]',
                    'Hardal': 'bg-[#FFDB58] border-[#E5C100]',
                    'Haki': 'bg-[#BDB76B] border-[#A8A252]',
                    'Turkuaz': 'bg-[#40E0D0] border-[#00CED1]',
                    'Lila': 'bg-[#C8A2C8] border-[#B38CB3]',
                    'Fuşya': 'bg-[#FF00FF] border-[#CC00CC]',
                    'Somon': 'bg-[#FA8072] border-[#E9967A]',
                    'Zümrüt': 'bg-[#50C878] border-[#3CB371]',
                    'Pudra': 'bg-[#FFD1DC] border-[#FFB6C1]',
                    'Vizon': 'bg-[#808069] border-[#6b6b55]',
                    'Ekru': 'bg-[#F3E5AB] border-[#E2D292]',
                    'Taba': 'bg-[#B05C52] border-[#92473D]',
                    'Antrasit': 'bg-[#383E42] border-[#2A2E31]',
                    'Krem': 'bg-[#FFFDD0] border-[#E6E4B2]',
                    'Gül Kurusu': 'bg-[#C08081] border-[#A9696A]',
                  };
                  
                  let customStyle: React.CSSProperties = {};
                  let bgClass = colorMap[c];
                  
                  if (!bgClass) {
                    if (c === 'Çok Renkli') {
                       customStyle = { background: 'linear-gradient(45deg, #ef4444, #3b82f6, #22c55e, #eab308)' };
                    } else {
                       let hash = 0;
                       for (let i = 0; i < c.length; i++) hash = c.charCodeAt(i) + ((hash << 5) - hash);
                       customStyle = { backgroundColor: `hsl(${Math.abs(hash) % 360}, 65%, 45%)` };
                    }
                  }
                  return (
                    <button 
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === c 
                          ? 'border-slate-400 p-[2px]' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                      title={c}
                    >
                      <div 
                        className={`w-full h-full rounded-full border ${bgClass || 'border-transparent'}`}
                        style={customStyle}
                      ></div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="pt-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white h-[56px]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full text-slate-600 hover:bg-slate-50 transition-colors font-bold text-xl leading-none flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-bold text-slate-900 border-x border-gray-200 w-12 text-center flex items-center justify-center h-full">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity((product?.stock > 0) ? Math.min(product.stock, quantity + 1) : quantity + 1)}
                  className="px-4 h-full text-slate-600 hover:bg-slate-50 transition-colors font-bold text-xl leading-none flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 font-bold py-4 h-[56px] transition-all flex items-center justify-center gap-2 rounded-md ${
                  isOutOfStock ? 'bg-gray-200 text-gray-500 cursor-not-allowed' :
                  added ? 'bg-green-600 text-white' : 'bg-pink-500 hover:bg-pink-600 text-white'
                }`}
              >
                {isOutOfStock ? 'STOKTA ÜRÜN KALMAMIŞTIR' : added ? <><FiCheck size={20} /> EKLENDİ</> : 'SEPETE EKLE'}
              </button>
            </div>
            <div className="space-y-3 mt-2">
               <p className="text-xs text-slate-700 flex items-center gap-2">
                 Tahmini Teslimat Tarihi <span className="font-bold text-slate-900">5 Temmuz - 9 Temmuz</span>
               </p>
               <p className="text-xs font-bold text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-6">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                 3.500 TL üzeri siparişlerde ücretsiz kargo
               </p>
            </div>
          </div>
          
          {/* Accordion Sections */}
          <div className="flex flex-col">
             {[
               { id: 'delivery', title: 'Teslimat & İade', content: '' },
               { id: 'installments', title: 'Taksit Seçenekleri', content: '' },
               { id: 'description', title: 'Ürün Açıklaması', content: product.description },
               { id: 'details', title: 'Ürün Detayı', content: product.productDetails || `Kategori: ${product.category?.name}\nÜretim Yeri: Türkiye\nÜrün Kodu: ${product.id}` }
             ].map((section) => (
               <div key={section.id} className="border-b border-gray-100">
                 <button 
                   onClick={() => {
                     if (section.id === 'delivery') {
                       setDeliveryDrawerOpen(true);
                     } else if (section.id === 'installments') {
                       setInstallmentsModalOpen(true);
                     } else {
                       setOpenAccordion(openAccordion === section.id ? null : section.id);
                     }
                   }}
                   className="w-full flex justify-between items-center py-4 text-left hover:bg-slate-50 transition-colors rounded-lg group"
                 >
                   <span className="font-bold text-slate-900 text-[13px]">{section.title}</span>
                   {section.id === 'delivery' || section.id === 'installments' ? (
                      <FiChevronDown className="text-slate-500 -rotate-90 group-hover:text-slate-900" />
                   ) : openAccordion === section.id ? (
                      <FiChevronUp className="text-slate-500" />
                   ) : (
                      <FiChevronDown className="text-slate-500 group-hover:text-slate-900" />
                   )}
                 </button>
                 {section.id !== 'delivery' && section.id !== 'installments' && openAccordion === section.id && (
                   <div className="pb-4 pt-1 text-sm text-slate-600 leading-relaxed">
                     {section.id === 'details' && section.content?.includes('\n') ? (
                       <ul className="list-decimal pl-5 space-y-2">
                         {section.content.split('\n').filter(Boolean).map((item: string, i: number) => (
                           <li key={i} className="pl-1 font-medium">{item}</li>
                         ))}
                       </ul>
                     ) : (
                       <div className="whitespace-pre-line">{section.content}</div>
                     )}
                   </div>
                 )}
               </div>
             ))}
          </div>

        </div>
      </div>

      {/* Similar Products */}
      {similarProducts && similarProducts.length > 0 && (
        <div className="mt-16 border-t border-gray-100 pt-16 max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Benzer Ürünler</h2>
          
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            breakpoints={{
              320: { slidesPerView: 2.2, spaceBetween: 12 },
              640: { slidesPerView: 2.5, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 }
            }}
            className="w-full pb-8"
          >
            {similarProducts.map((sp: any) => (
              <SwiperSlide key={sp.id} className="pb-4">
                <Link href={`/product/${sp.id}`} className="group bg-white rounded-[1.5rem] border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary-200 transition-all duration-300 overflow-hidden flex flex-col relative block h-full">
                  <div className="relative aspect-[4/5] bg-slate-50 flex items-center justify-center overflow-hidden">
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
                      {sp.originalPrice && sp.originalPrice > sp.price && (
                        <span className="bg-red-700 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                          %{Math.round((sp.originalPrice - sp.price) / sp.originalPrice * 100)}
                        </span>
                      )}
                      {sp.isNew && <span className="bg-pink-500 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm">YENİ SEZON</span>}
                      {sp.isDiscounted && <span className="bg-orange-500 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm">İNDİRİMLİ</span>}
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleFavorite(sp.id); }}
                      className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:scale-110 transition-all border border-white/50"
                    >
                      <FiHeart size={16} className={isFavorite(sp.id) ? "fill-red-500 text-red-500" : ""} />
                    </button>
                    {sp.images && sp.images.length > 0 ? (
                      <>
                        <img src={sp.images[0]} alt={sp.title} className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 ease-out absolute inset-0 group-hover:opacity-0" />
                        {sp.images[1] ? (
                          <img src={sp.images[1]} alt={sp.title} className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 ease-out absolute inset-0 opacity-0 group-hover:opacity-100" />
                        ) : (
                          <img src={sp.images[0]} alt={sp.title} className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 ease-out absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-110" />
                        )}
                      </>
                    ) : (
                       <div className="text-gray-300">Görsel Yok</div>
                    )}
                  </div>
                  <div className="p-5 bg-white flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-900 text-sm mb-2 truncate group-hover:text-pink-600 transition-colors">{sp.title}</h3>
                    <div className="flex flex-col mt-auto">
                       {sp.originalPrice && sp.originalPrice > sp.price && <span className="text-[11px] text-gray-400 line-through font-medium leading-none mb-1">{sp.originalPrice} ₺</span>}
                       <span className="text-lg font-black text-slate-900 tracking-tight leading-none">{sp.price} ₺</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Delivery & Returns Drawer */}
      {deliveryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col translate-x-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex space-x-6">
                <button 
                  onClick={() => setActiveTab('teslimat')}
                  className={`pb-2 pt-2 font-bold text-lg border-b-2 transition-colors ${activeTab === 'teslimat' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  Teslimat
                </button>
                <button 
                  onClick={() => setActiveTab('iade')}
                  className={`pb-2 pt-2 font-bold text-lg border-b-2 transition-colors ${activeTab === 'iade' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  İade
                </button>
              </div>
              <button onClick={() => setDeliveryDrawerOpen(false)} className="p-2 -mt-2 text-slate-500 hover:text-slate-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'teslimat' ? (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-900 text-[15px]">Mağazadan Teslimat</h4>
                      <span className="font-bold text-slate-900 text-[15px]">Ücretsiz</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      Siparişiniz seçtiğiniz mağazaya 1-5 iş gününde teslim olur. Siparişi satın alan kişi teslim almaya geldiğinde, telefonuna SMS ile gelen teslimat kodunu ve sipariş numarasını iletmesi yeterlidir. Onun yerine başka biri teslim almaya gelirse, kodun yanı sıra kimlik belgesi de göstermesi gerekecektir.
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-900 text-[15px]">Aynı Gün Teslimat</h4>
                      <span className="font-bold text-slate-900 text-[15px]">199,99 TL</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      Pazartesi ile Cumartesi günleri arası saat 11:00'e kadar verilen siparişler aynı gün teslim edilir. Aynı gün teslimatın mümkün olmadığı durumlarda, bu teslimat seçeneği görüntülenmez.
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-900 text-[15px]">Ertesi Gün Teslimat</h4>
                      <span className="font-bold text-slate-900 text-[15px]">149,99 TL</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      Pazartesi ile Cuma günleri arası saat 15:00'e kadar verilen siparişler ertesi gün teslim edilir. *5.000 TL Üzeri Siparişlerde Ücretsiz.
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-900 text-[15px]">Standart Teslimat</h4>
                      <span className="font-bold text-slate-900 text-[15px]">99,99 TL</span>
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      Tahmini teslimat, teslimat adresine bağlı olarak 1-5 iş günü içinde olacaktır. 3.500 TL üzeri siparişlerde ücretsiz kargo.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                   <p className="text-[13px] text-slate-500 leading-relaxed">
                     {product.deliveryInfo || "Siparişleriniz 1-3 iş günü içerisinde kargoya verilir. İade işlemlerini 14 gün içerisinde gerçekleştirebilirsiniz."}
                   </p>
                </div>
              )}
            </div>
          </div>
          <div className="order-3 md:order-3 md:col-start-1">
          {/* Reviews Section */}
          <div className="border-t border-gray-100 pt-8 mt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Değerlendirmeler ({product.reviews?.length || 0})</h3>
            <div className="flex flex-col gap-6">
              {/* Reviews List */}
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((rev: any) => (
                    <div key={rev.id} className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-900">{rev.user?.name || "İsimsiz Kullanıcı"}</span>
                        <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <p className="text-slate-700">{rev.comment}</p>
                      {rev.adminReply && (
                        <div className="mt-3 bg-white p-3 rounded-lg border border-primary-100/50">
                          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block mb-1">Mağaza Yanıtı</span>
                          <p className="text-slate-700 text-[13px]">{rev.adminReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-gray-100 text-gray-500">
                  Bu ürüne henüz yorum yapılmamış. İlk yorumu siz yapın!
                </div>
              )}
              
              {/* Write Review Form */}
              <form onSubmit={handleReviewSubmit} className="mt-2 border-t border-gray-100 pt-6">
                <h4 className="font-bold text-slate-900 mb-3">Yorum Yap</h4>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                  rows={4}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none mb-3"
                  required
                />
                {reviewMessage && (
                  <p className={`text-xs font-bold mb-3 ${reviewMessage.includes('başarıyla') ? 'text-green-600' : 'text-red-500'}`}>
                    {reviewMessage}
                  </p>
                )}
                <button 
                  type="submit" 
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="bg-pink-500 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Installments Modal */}
      {installmentsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-900">Taksit Seçenekleri</h2>
              <button onClick={() => setInstallmentsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {banks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banks.map((bank: any) => (
                    <div key={bank.id} className="border border-gray-200 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <div className="text-[13px] text-slate-600 mb-1 font-medium">{bank.bankName}</div>
                        <div className="text-xl font-black font-serif italic tracking-tighter" style={{ color: bank.logoColor }}>
                          {bank.logoText}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] text-slate-600 mb-1">{bank.condition}</div>
                        <div className="text-[15px] font-bold text-slate-900">{bank.installments}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 font-medium">
                  Şu anda aktif taksit seçeneği bulunmamaktadır.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
