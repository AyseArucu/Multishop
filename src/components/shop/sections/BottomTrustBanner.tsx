export default function BottomTrustBanner({ pageSettings }: { pageSettings?: any }) {
  return (
    <section className="w-full bg-primary-50 py-10 mt-16 border-t border-primary-100">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-pink-500 font-black text-xl group-hover:scale-110 transition-transform">
              {pageSettings?.trustBannerIcon1 || 'N'}
            </div>
            <div className="flex flex-col">
              <span className="text-slate-800 font-black tracking-widest text-sm uppercase">{pageSettings?.trustBannerTitle || 'Neobasic Co Kalitesi'}</span>
              <span className="text-slate-500 font-medium text-xs">{pageSettings?.trustBannerDesc || 'Premium ürün garantisi'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-pink-500 font-black text-xl group-hover:scale-110 transition-transform">
              {pageSettings?.trustBannerIcon2 || 'T'}
            </div>
            <div className="flex flex-col">
              <span className="text-slate-800 font-black tracking-widest text-sm uppercase">{pageSettings?.trustBannerTitle2 || 'Trendy Tasarımlar'}</span>
              <span className="text-slate-500 font-medium text-xs">{pageSettings?.trustBannerDesc2 || 'Her sezon yenilenen koleksiyon'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="flex -space-x-3 group-hover:space-x-1 transition-all">
              <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" alt="User" />
              <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" alt="User" />
              <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" alt="User" />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shadow-sm z-10">
                +10k
              </div>
            </div>
            <div className="flex flex-col ml-2">
              <span className="text-slate-800 font-black tracking-widest text-sm uppercase">{pageSettings?.trustBannerTitle3 || 'Mutlu Müşteriler'}</span>
              <span className="text-slate-500 font-medium text-xs">{pageSettings?.trustBannerDesc3 || 'Bizimle alışveriş yapan binler'}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
