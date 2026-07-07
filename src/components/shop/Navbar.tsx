"use client";

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiTruck, FiGift, FiStar } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [siteLogoUrl, setSiteLogoUrl] = useState("");
  const [siteLogoText, setSiteLogoText] = useState("");
  const [siteLogoFont, setSiteLogoFont] = useState("Inter");
  const [siteLogoColor, setSiteLogoColor] = useState("#000000");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const [topBannerAnimated, setTopBannerAnimated] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const cartTotal = useCartStore((state) => state.getTotalPrice());
  const favoriteItemsCount = useFavoriteStore((state) => state.items.length);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data.products || []);
            setShowDropdown(true);
            setIsSearching(false);
          })
          .catch(err => {
            console.error(err);
            setIsSearching(false);
          });
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    setMounted(true);
    fetch('/api/settings').then(res => res.json()).then(data => {
      if(data.siteLogoUrl) {
        setSiteLogoUrl(data.siteLogoUrl);
      }
      if(data.siteLogoText) setSiteLogoText(data.siteLogoText);
      if(data.siteLogoFont) setSiteLogoFont(data.siteLogoFont);
      if(data.siteLogoColor) setSiteLogoColor(data.siteLogoColor);
      if(data.topBannerAnimated !== undefined) setTopBannerAnimated(data.topBannerAnimated === 'true' || data.topBannerAnimated === true);
    }).catch(err => console.log("Failed to fetch settings"));

    fetch('/api/categories', { cache: 'no-store' }).then(res => res.json()).then(data => {
      setCategories(data || []);
    }).catch(err => console.log("Failed to fetch categories"));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial sync of cart and favorites if user is logged in
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      useCartStore.getState().syncWithServer(savedEmail);
      useFavoriteStore.getState().syncWithServer(savedEmail);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 bg-white shadow-sm`}>
      
      {/* Top Banner - Hidden on scroll */}
      <div className={`overflow-hidden transition-all duration-300 ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100 bg-primary-50 border-b border-primary-100 flex items-center justify-center'}`}>
        <div className={`max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 hidden md:flex items-center text-xs font-semibold text-slate-700 ${topBannerAnimated ? 'animate-marquee whitespace-nowrap gap-16 w-max' : 'justify-between'}`}>
          <div className="flex items-center gap-2 flex-shrink-0">
            <FiStar className="text-pink-500" />
            <span>Yeni Sezon Ürünlerinde Sepette %20 İndirim!</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <FiTruck className="text-pink-500" />
            <span>Ücretsiz Kargo 750₺ ve Üzeri Alışverişlerde</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <FiGift className="text-pink-500" />
            <span>İlk Alışverişinize Özel %10 Hoş Geldin İndirimi!</span>
          </div>
          {/* Duplicate for smoother marquee if animated */}
          {topBannerAnimated && (
            <>
              <div className="flex items-center gap-2 flex-shrink-0">
                <FiStar className="text-pink-500" />
                <span>Yeni Sezon Ürünlerinde Sepette %20 İndirim!</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <FiTruck className="text-pink-500" />
                <span>Ücretsiz Kargo 750₺ ve Üzeri Alışverişlerde</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <FiGift className="text-pink-500" />
                <span>İlk Alışverişinize Özel %10 Hoş Geldin İndirimi!</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-4">
        <div className="flex items-center justify-between gap-8">
          
          {/* Logo */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="md:hidden text-slate-800 hover:text-pink-600 transition">
              <FiMenu size={28} />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              {siteLogoUrl ? (
                <img src={siteLogoUrl} alt="Logo" className="h-10 object-contain group-hover:scale-105 transition-transform" />
              ) : (
                <div className="flex flex-col group-hover:opacity-80 transition-opacity">
                  <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
                  <div className="flex items-baseline" style={{ fontFamily: "'Pacifico', cursive" }}>
                    <span className="text-3xl" style={{ color: siteLogoColor || '#1e293b' }}>
                      {siteLogoText ? siteLogoText.split('.')[0] : 'neobasic'}
                    </span>
                    <span className="text-3xl text-primary-500">
                      {siteLogoText?.includes('.') ? `.${siteLogoText.split('.')[1]}` : '.co'}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold -mt-1 ml-1">Women's Fashion</span>
                </div>
              )}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative w-full group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(searchResults.length > 0) setShowDropdown(true); }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Aradığınız ürünü yazın..." 
                className="w-full pl-6 pr-16 py-3 bg-pink-50 border-2 border-pink-100 rounded-full focus:outline-none focus:border-pink-500 transition-colors shadow-sm text-sm font-medium text-slate-700 placeholder-gray-400"
              />
              <button type="submit" className="absolute right-0 top-0 h-full aspect-square bg-pink-500 text-white rounded-r-full flex items-center justify-center hover:bg-pink-600 transition-colors border-2 border-pink-500 border-l-0">
                <FiSearch size={20} />
              </button>

              {/* Search Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-gray-500">Aranıyor...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map(product => (
                        <Link 
                          key={product.id} 
                          href={`/product/${product.id}`}
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
                          onClick={() => setShowDropdown(false)}
                        >
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <FiSearch className="text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{product.title}</h4>
                            <div className="text-sm font-black text-primary-600 mt-1">
                              {product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">Ürün bulunamadı.</div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <div className="relative group/user z-50 cursor-pointer">
              <div className="flex flex-col items-center gap-1 text-slate-600 hover:text-pink-600 transition-colors">
                <FiUser size={22} strokeWidth={1.5} />
                <span className="hidden xl:block text-[11px] font-bold">Hesabım</span>
              </div>
              
              {/* User Dropdown */}
              <div className="absolute top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 right-0 overflow-hidden">
                <div className="p-2">
                  <Link href="/profile" className="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-gray-50 rounded-xl transition">Giriş Yap</Link>
                  <Link href="/profile" className="block px-4 py-3 text-sm font-bold text-primary-600 hover:bg-primary-50 rounded-xl transition mt-1">Kayıt Ol</Link>
                </div>
              </div>
            </div>
            
            <Link href="/favorites" className="relative flex flex-col items-center gap-1 text-slate-600 hover:text-primary-600 transition-colors group">
              <div className="relative">
                <FiHeart size={22} strokeWidth={1.5} />
                {mounted && favoriteItemsCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-[10px] font-black w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                    {favoriteItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:block text-[11px] font-bold">Favoriler</span>
            </Link>

            <Link href="/cart" className="relative flex flex-col items-center gap-1 text-slate-600 hover:text-primary-600 transition-colors group">
              <div className="relative">
                <FiShoppingCart size={22} strokeWidth={1.5} />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-[10px] font-black w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:block text-[11px] font-bold">Sepetim</span>
            </Link>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className={`hidden md:flex justify-center mt-6 transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden mt-0' : 'h-auto opacity-100'}`}>
          <ul className="flex items-center space-x-8 text-[13px] font-bold text-slate-600 tracking-wide">
            <li><Link href="/products" className={`transition uppercase border-b-2 pb-1 ${pathname === '/products' && !currentCategory ? 'text-pink-600 border-pink-600' : 'border-transparent hover:text-pink-600 hover:border-pink-600'}`}>TÜM ÜRÜNLER</Link></li>
            {Array.isArray(categories) && categories.slice(0, 6).map(cat => (
              <li key={cat.id}>
                <Link href={`/products?category=${cat.id}`} className={`transition uppercase border-b-2 pb-1 ${currentCategory === cat.id ? 'text-pink-600 border-pink-600' : 'border-transparent hover:text-pink-600 hover:border-pink-600'}`}>
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/campaigns" className={`transition uppercase border-b-2 pb-1 ${pathname === '/campaigns' ? 'text-pink-600 border-pink-600' : 'border-transparent hover:text-pink-600 hover:border-pink-600'}`}>
                İNDİRİM
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
