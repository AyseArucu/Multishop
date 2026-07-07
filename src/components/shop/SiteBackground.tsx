import prisma from "@/lib/prisma";

export default async function SiteBackground() {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ['siteBgUrl', 'siteBgType', 'siteBgOverlay'] } }
    });
    
    const map = settings.reduce((acc, s) => ({...acc, [s.key]: s.value}), {} as Record<string, string>);
    
    if (!map.siteBgUrl || map.siteBgType === 'none') {
      return (
        <div className="fixed inset-0 w-full h-full -z-[100] overflow-hidden bg-slate-50">
          {/* Animated Gradient Background */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-300/20 blur-[100px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-300/20 blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-pink-300/20 blur-[120px] animate-blob animation-delay-4000"></div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 w-full h-full -z-[100] overflow-hidden bg-slate-100">
        {map.siteBgType === 'video' ? (
          <video 
            src={map.siteBgUrl} 
            className="w-full h-full object-cover" 
            autoPlay muted loop playsInline 
          />
        ) : (
          <img 
            src={map.siteBgUrl} 
            alt="Site Background" 
            className="w-full h-full object-cover" 
          />
        )}
        {/* Opsiyonel kararartma overlay */}
        {map.siteBgOverlay !== 'none' && (
          <div className={`absolute inset-0 ${map.siteBgOverlay === 'dark' ? 'bg-black/50' : 'bg-white/50 backdrop-blur-[2px]'}`}></div>
        )}
      </div>
    );
  } catch (error) {
    return null;
  }
}
