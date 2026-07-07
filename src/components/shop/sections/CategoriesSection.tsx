import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import EditableText from '@/components/shop/EditableText';
import { motion } from 'framer-motion';

export default function CategoriesSection({ pageSettings }: { pageSettings: any }) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setCategories((data || []).slice(0, 3));
      })
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  const defaultImages = [
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=1000&auto=format&fit=crop", 
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mb-32 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <motion.div variants={itemVariants} className="max-w-2xl">
          <EditableText
            as="h2"
            settingKey="homeCategoriesTitle"
            defaultValue={pageSettings.homeCategoriesTitle || "Kategorileri Keşfet"}
            className="text-4xl md:text-5xl font-serif italic font-bold text-pink-500 mb-4 tracking-wider"
          />
          <EditableText
            as="p"
            settingKey="homeCategoriesDesc"
            defaultValue={pageSettings.homeCategoriesDesc || "İhtiyacınıza en uygun ürünleri bulmak için sizin için özenle seçilmiş kategorilerimize göz atın."}
            className="text-gray-500 text-lg font-medium leading-relaxed"
            multiline
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link href="/products" className="text-pink-600 font-bold hover:text-primary-800 text-lg flex items-center gap-2 group transition-colors">
            Tüm Koleksiyon <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {categories.map((cat, index) => {
          const isLarge = index === 0;
          const imageSrc = cat.imageUrl || defaultImages[index % defaultImages.length];

          return (
            <motion.div 
              key={cat.id} 
              variants={itemVariants}
              className={`${isLarge ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              <Link 
                href={`/products?category=${cat.id}`} 
                className={`group relative overflow-hidden rounded-[2rem] shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 bg-slate-100 block h-full w-full`}
              >
                <div className={`absolute inset-0 bg-gradient-to-t ${isLarge ? 'from-slate-900/90 via-slate-900/20' : 'from-slate-900/90'} to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity duration-500`}></div>
                <img src={imageSrc} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                <div className={`absolute bottom-0 left-0 ${isLarge ? 'p-10' : 'p-8'} z-20 w-full`}>
                  {isLarge && <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 inline-block shadow-sm">Popüler</span>}
                  <h3 className={`${isLarge ? 'text-4xl' : 'text-3xl'} font-serif italic font-bold text-pink-400 mb-2 tracking-wider`}>{cat.name}</h3>
                  {isLarge && <p className="text-pink-100 text-lg max-w-md mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">Bu kategoriye ait ürünleri hemen keşfedin.</p>}
                </div>
              </Link>
            </motion.div>
          );
        })}

        {categories.length === 0 && (
          <motion.div variants={itemVariants} className="col-span-3 h-full flex flex-col items-center justify-center bg-gray-50 rounded-[2rem] text-gray-400 border border-dashed border-gray-200">
            <p className="text-xl font-bold">Henüz kategori eklenmemiş.</p>
            <p className="mt-2 text-sm">Admin panelinden kategori ekleyin.</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
