import Link from 'next/link';
import prisma from '@/lib/prisma';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiLinkedin, FiGithub, FiMail, FiGlobe, FiShoppingBag } from 'react-icons/fi';

const getSocialIcon = (url: string) => {
  if (!url) return <FiGlobe size={20} />;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('instagram.com')) return <FiInstagram size={20} />;
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return <FiTwitter size={20} />;
  if (lowerUrl.includes('facebook.com')) return <FiFacebook size={20} />;
  if (lowerUrl.includes('youtube.com')) return <FiYoutube size={20} />;
  if (lowerUrl.includes('linkedin.com')) return <FiLinkedin size={20} />;
  if (lowerUrl.includes('github.com')) return <FiGithub size={20} />;
  if (lowerUrl.includes('shopier.com')) return <FiShoppingBag size={20} />;
  if (lowerUrl.includes('mailto:')) return <FiMail size={20} />;
  return <FiGlobe size={20} />;
};

export default async function Footer() {
  // Fetch dynamic data for the footer
  let footerAboutText = "Kaliteli ürünler, uygun fiyatlar ve güvenli alışverişin tek adresi. Müşteri memnuniyeti bizim önceliğimizdir.";
  let siteLogoUrl = "";
  let siteLogoText = "";
  let siteLogoFont = "Inter";
  let siteLogoColor = "#ffffff";
  let socialLinks: string[] = [];
  let categories: any[] = [];
  let customPages: any[] = [];
  let settingsMap: any = {};

  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['footerAboutText', 'siteLogoUrl', 'siteLogoText', 'siteLogoFont', 'siteLogoColor', 'socialLinks', 'socialInstagram', 'socialTwitter', 'socialFacebook', 'socialShopier', 'footerBgType', 'footerBgColor', 'footerBgMediaUrl', 'footerBgOverlay', 'footerTitleColor', 'footerTextColor', 'footerBtnBg', 'footerBtnText']
        }
      }
    });

    settingsMap = settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    if (settingsMap.footerAboutText) footerAboutText = settingsMap.footerAboutText;
    if (settingsMap.siteLogoUrl) siteLogoUrl = settingsMap.siteLogoUrl;
    if (settingsMap.siteLogoText) siteLogoText = settingsMap.siteLogoText;
    if (settingsMap.siteLogoFont) siteLogoFont = settingsMap.siteLogoFont;
    if (settingsMap.siteLogoColor) siteLogoColor = settingsMap.siteLogoColor;
    
    // Support JSON array socialLinks if present
    if (settingsMap.socialLinks) {
      try {
        const parsed = JSON.parse(settingsMap.socialLinks);
        if (Array.isArray(parsed)) {
          socialLinks = parsed.filter(link => typeof link === 'string' && link.trim() !== '');
        }
      } catch(e) {}
    }

    // Also support individual social links from settings
    if (settingsMap.socialInstagram && !socialLinks.includes(settingsMap.socialInstagram)) socialLinks.push(settingsMap.socialInstagram);
    if (settingsMap.socialTwitter && !socialLinks.includes(settingsMap.socialTwitter)) socialLinks.push(settingsMap.socialTwitter);
    if (settingsMap.socialFacebook && !socialLinks.includes(settingsMap.socialFacebook)) socialLinks.push(settingsMap.socialFacebook);
    if (settingsMap.socialShopier && !socialLinks.includes(settingsMap.socialShopier)) socialLinks.push(settingsMap.socialShopier);

    // Provide default placeholders if no links are set
    if (socialLinks.length === 0) {
      socialLinks.push('https://instagram.com/');
      socialLinks.push('https://shopier.com/');
    }

    categories = await prisma.category.findMany({
      where: { isActive: true },
      take: 5
    });

    customPages = await prisma.page.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Footer verileri çekilirken hata:", error);
  }

  const bgType = settingsMap.footerBgType || 'color';
  const bgColor = settingsMap.footerBgColor || '#292524';
  const bgMediaUrl = settingsMap.footerBgMediaUrl || '';
  const overlay = settingsMap.footerBgOverlay || 'none';
  const titleColor = settingsMap.footerTitleColor || '#ffffff';
  const textColor = settingsMap.footerTextColor || '#d1d5db';
  const btnBg = settingsMap.footerBtnBg || '#ffffff';
  const btnText = settingsMap.footerBtnText || '#292524';
  const inputBg = settingsMap.footerInputBg || 'rgba(0,0,0,0.2)';
  const inputText = settingsMap.footerInputText || '#ffffff';

  let overlayClass = '';
  if (overlay === 'light') overlayClass = 'bg-black/30';
  if (overlay === 'medium') overlayClass = 'bg-black/60';
  if (overlay === 'dark') overlayClass = 'bg-black/85';
  if (overlay === 'blur') overlayClass = 'bg-black/40 backdrop-blur-md';

  return (
    <footer 
      className="py-12 border-t border-slate-800/50 relative overflow-hidden"
      style={{ 
        backgroundColor: bgType === 'color' ? bgColor : undefined,
        color: textColor
      }}
    >
      {bgType === 'image' && bgMediaUrl && (
        <img src={bgMediaUrl} alt="Footer Background" className="absolute inset-0 w-full h-full object-cover z-0" />
      )}
      {bgType === 'video' && bgMediaUrl && (
        <video src={bgMediaUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
      )}
      
      {(bgType === 'image' || bgType === 'video') && overlay !== 'none' && (
        <div className={`absolute inset-0 z-0 ${overlayClass}`}></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        <div>
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            {siteLogoUrl ? (
              <img src={siteLogoUrl} alt="Logo" className="h-16 w-auto object-contain mb-4" />
            ) : (
              <h3 
                className={`text-3xl font-bold mb-4 tracking-tighter ${!siteLogoText && 'text-white'}`}
                style={{
                  fontFamily: `'${siteLogoFont}', sans-serif`,
                  color: siteLogoText ? (siteLogoColor || '#ffffff') : undefined
                }}
              >
                {siteLogoText || 'MULTISHOP'}
              </h3>
            )}
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            {footerAboutText}
          </p>
          
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {socialLinks.map((url, idx) => {
                const isInstagram = url.toLowerCase().includes('instagram.com');
                const isShopier = url.toLowerCase().includes('shopier.com');
                
                let isGradient = false;
                let buttonStyle = 'hover:opacity-80 transition-opacity';
                if (isInstagram) {
                  buttonStyle = 'bg-gradient-to-tr from-rose-400 via-pink-500 to-rose-600 text-white hover:opacity-80 hover:scale-110 shadow-lg shadow-pink-500/20';
                  isGradient = true;
                } else if (isShopier) {
                  buttonStyle = 'bg-gradient-to-tr from-pink-400 via-rose-500 to-stone-800 text-white hover:opacity-80 hover:scale-110 shadow-lg shadow-rose-500/20';
                  isGradient = true;
                }

                return (
                  <a 
                    key={idx}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${buttonStyle}`}
                    style={isGradient ? {} : { backgroundColor: btnBg, color: btnText }}
                  >
                    {getSocialIcon(url)}
                  </a>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-8 md:col-span-2">
          <div>
            <h4 className="font-semibold mb-4" style={{ color: titleColor }}>Kategoriler</h4>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.map((cat: any) => (
                  <li key={cat.id}>
                    <Link href={`/products?category=${cat.id}`} className="hover:opacity-80 transition" style={{ color: textColor }}>
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li><span className="text-gray-500">Kategori bulunamadı</span></li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: titleColor }}>Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:opacity-80 transition" style={{ color: textColor }}>İletişim</Link></li>
              {customPages.map((page: any) => (
                <li key={page.id}>
                  <Link href={`/sayfa/${page.slug}`} className="hover:opacity-80 transition" style={{ color: textColor }}>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4" style={{ color: titleColor }}>Bültene Abone Ol</h4>
          <p className="text-sm mb-4" style={{ color: textColor }}>Kampanya ve indirimlerden haberdar olmak için e-posta bültenimize katılın.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="E-posta adresiniz" 
              className="px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-white rounded-l-md border border-white/10"
              style={{ backgroundColor: inputBg, color: inputText }}
            />
            <button 
              className="px-4 py-2 font-medium rounded-r-md hover:opacity-90 transition"
              style={{ backgroundColor: btnBg, color: btnText }}
            >
              Katıl
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800/50 text-sm text-center relative z-10">
        <p className="opacity-50 font-light">&copy; {new Date().getFullYear()} Neobasic.co. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
