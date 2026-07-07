import { motion } from 'framer-motion';
import { FiTruck, FiLock, FiRefreshCcw, FiHeadphones } from 'react-icons/fi';

export default function InfoSection({ pageSettings }: { pageSettings?: any }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Get settings or fallbacks
  const bgType = pageSettings?.infoBgType || 'color';
  const bgColor = pageSettings?.infoBgColor || '#ffffff';
  const bgMediaUrl = pageSettings?.infoBgMediaUrl;
  const overlay = pageSettings?.infoBgOverlay || 'none';
  
  const titleColor = pageSettings?.infoTitleColor || '#1e293b';
  const textColor = pageSettings?.infoTextColor || '#64748b';
  const btnBg = pageSettings?.infoBtnBg || '#fdf2f8';
  const btnText = pageSettings?.infoBtnText || '#ec4899';
  const cardBg = pageSettings?.infoCardBg || '#ffffff';

  return (
    <section 
      className="py-8 relative overflow-hidden w-full mb-16 border-b border-gray-100"
      style={{ backgroundColor: bgType === 'color' ? bgColor : 'transparent' }}
    >
      {/* Background Media */}
      {bgType === 'image' && bgMediaUrl && (
        <img src={bgMediaUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
      )}
      {bgType === 'video' && bgMediaUrl && (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src={bgMediaUrl} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      {bgType !== 'color' && overlay !== 'none' && (
        <div 
          className={`absolute inset-0 z-0 ${
            overlay === 'light' ? 'bg-black/30' : 
            overlay === 'medium' ? 'bg-black/60' : 
            overlay === 'dark' ? 'bg-black/85' : 
            overlay === 'blur' ? 'backdrop-blur-md bg-white/10' : ''
          }`}
        ></div>
      )}

      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div 
          className="rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8"
          style={{ backgroundColor: cardBg }}
        >
          <div className="grid grid-cols-4 gap-2 lg:gap-0 lg:divide-x divide-gray-100">
            
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center text-center lg:text-left gap-2 lg:gap-4 px-1 lg:px-8 group">
              <div 
                className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110"
                style={{ backgroundColor: 'transparent', color: btnText, borderColor: btnBg === 'transparent' ? btnText : btnBg }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = btnBg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <FiTruck className="w-5 h-5 lg:w-[22px] lg:h-[22px]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[10px] sm:text-xs lg:text-[15px] font-bold leading-tight" style={{ color: titleColor }}>Hızlı Teslimat</h4>
                <p className="hidden lg:block text-sm font-medium mt-0.5" style={{ color: textColor }}>1-3 iş günü içinde</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center text-center lg:text-left gap-2 lg:gap-4 px-1 lg:px-8 group">
              <div 
                className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110"
                style={{ backgroundColor: 'transparent', color: btnText, borderColor: btnBg === 'transparent' ? btnText : btnBg }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = btnBg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <FiLock className="w-5 h-5 lg:w-[22px] lg:h-[22px]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[10px] sm:text-xs lg:text-[15px] font-bold leading-tight" style={{ color: titleColor }}>Güvenli Ödeme</h4>
                <p className="hidden lg:block text-sm font-medium mt-0.5" style={{ color: textColor }}>256-bit SSL koruma</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center text-center lg:text-left gap-2 lg:gap-4 px-1 lg:px-8 group">
              <div 
                className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110"
                style={{ backgroundColor: 'transparent', color: btnText, borderColor: btnBg === 'transparent' ? btnText : btnBg }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = btnBg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <FiRefreshCcw className="w-5 h-5 lg:w-[22px] lg:h-[22px]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[10px] sm:text-xs lg:text-[15px] font-bold leading-tight" style={{ color: titleColor }}>İade Garantisi</h4>
                <p className="hidden lg:block text-sm font-medium mt-0.5" style={{ color: textColor }}>Koşulsuz iade hakkı</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center text-center lg:text-left gap-2 lg:gap-4 px-1 lg:px-8 group">
              <div 
                className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110"
                style={{ backgroundColor: 'transparent', color: btnText, borderColor: btnBg === 'transparent' ? btnText : btnBg }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = btnBg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <FiHeadphones className="w-5 h-5 lg:w-[22px] lg:h-[22px]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[10px] sm:text-xs lg:text-[15px] font-bold leading-tight" style={{ color: titleColor }}>Müşteri Desteği</h4>
                <p className="hidden lg:block text-sm font-medium mt-0.5" style={{ color: textColor }}>7/24 destek hattı</p>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
