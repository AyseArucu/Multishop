"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingFee, setShippingFee] = useState(49.90);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);
  const [savingShipping, setSavingShipping] = useState(false);

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterColor, setFilterColor] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all"); // all, inStock, outOfStock
  const [sortPrice, setSortPrice] = useState<string>("none"); // none, asc, desc

  // Available colors extracted from products
  const availableColors = Array.from(new Set(products.flatMap(p => p.colors || [])));

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
      setCategories(data.categories || []);

      const settingsRes = await fetch('/api/settings');
      const settingsData = await settingsRes.json();
      if (settingsData) {
        if (settingsData.shippingFee) setShippingFee(Number(settingsData.shippingFee));
        if (settingsData.freeShippingThreshold) setFreeShippingThreshold(Number(settingsData.freeShippingThreshold));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveShipping = async () => {
    setSavingShipping(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          shippingFee: shippingFee.toString(),
          freeShippingThreshold: freeShippingThreshold.toString()
        })
      });
      alert('Kargo ayarları başarıyla kaydedildi!');
    } catch (error) {
      console.error(error);
      alert('Kargo ayarları kaydedilirken bir hata oluştu.');
    } finally {
      setSavingShipping(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
    
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Silme işlemi başarısız!");
    }
  };

  let filteredProducts = [...products];

  if (filterCategory !== "all") {
    filteredProducts = filteredProducts.filter(p => p.categoryId === filterCategory);
  }

  if (filterColor !== "all") {
    filteredProducts = filteredProducts.filter(p => p.colors?.includes(filterColor));
  }

  if (filterStatus === "inStock") {
    filteredProducts = filteredProducts.filter(p => p.stock > 0);
  } else if (filterStatus === "outOfStock") {
    filteredProducts = filteredProducts.filter(p => p.stock <= 0);
  }

  if (sortPrice === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortPrice === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="pb-24 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Ürün Yönetimi</h1>
          <p className="text-gray-500 font-medium">Sitenizdeki tüm ürünleri buradan ekleyebilir, silebilir veya güncelleyebilirsiniz.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-slate-900 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-colors flex items-center gap-2"
        >
          <FiPlus size={20} /> Yeni Ürün Ekle
        </Link>
      </div>

      {/* KARGO AYARLARI KART */}
      <div className="bg-pink-50 p-6 rounded-3xl shadow-sm border border-pink-100 mb-8 flex flex-col md:flex-row md:items-end gap-6">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-pink-700 mb-2">Sipariş Kargo Ücreti</h2>
          <p className="text-sm text-pink-600 mb-4">Tüm siparişlerde geçerli olacak sabit kargo ücretini ve ücretsiz kargo barajını belirleyin.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-pink-700 uppercase tracking-wider mb-2">Sabit Kargo Ücreti (TL)</label>
              <input 
                type="number" 
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full p-3 bg-white border border-pink-200 rounded-xl font-bold text-slate-700 outline-none focus:border-pink-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-pink-700 uppercase tracking-wider mb-2">Ücretsiz Kargo Barajı (TL)</label>
              <input 
                type="number" 
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full p-3 bg-white border border-pink-200 rounded-xl font-bold text-slate-700 outline-none focus:border-pink-500"
              />
            </div>
          </div>
        </div>
        <button 
          onClick={handleSaveShipping}
          disabled={savingShipping}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition disabled:opacity-50 h-12 flex items-center whitespace-nowrap"
        >
          {savingShipping ? 'Kaydediliyor...' : 'Kargo Ayarlarını Kaydet'}
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Filtreleme & Sıralama</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Renk</label>
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="all">Tüm Renkler</option>
              {availableColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stok Durumu</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="inStock">Stokta Var (Aktif)</option>
              <option value="outOfStock">Tükendi (Pasif)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fiyat Sıralaması</label>
            <select
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="none">Sıralama Yok</option>
              <option value="asc">En Düşük Fiyat</option>
              <option value="desc">En Yüksek Fiyat</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-gray-500 font-medium">Ürünler Yükleniyor...</div>
        ) : products.length === 0 ? (
           <div className="p-16 text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📦</span>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Henüz hiç ürün eklenmemiş</h3>
             <p className="text-gray-500 font-medium max-w-sm mx-auto">Sitenizde satılacak ürünleri "Yeni Ürün Ekle" butonuna tıklayarak oluşturabilirsiniz.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-5 font-bold uppercase tracking-wider">Ürün Adı</th>
                  <th className="p-5 font-bold uppercase tracking-wider">Kategori</th>
                  <th className="p-5 font-bold uppercase tracking-wider">Stok</th>
                  <th className="p-5 font-bold uppercase tracking-wider">Fiyat</th>
                  <th className="p-5 font-bold uppercase tracking-wider">Durum</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-5 flex items-center space-x-4">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Görsel Yok</div>
                      )}
                      <span className="font-bold text-slate-900 line-clamp-1">{product.title}</span>
                    </td>
                    <td className="p-5 text-gray-600 font-medium">{product.category?.name || "Bilinmiyor"}</td>
                    <td className="p-5">
                      {product.stock > 0 ? (
                        <span className="text-green-600 font-bold">{product.stock} Adet</span>
                      ) : (
                        <span className="text-red-500 font-bold">Tükendi (0)</span>
                      )}
                    </td>
                    <td className="p-5 font-black text-slate-900">{product.price.toLocaleString('tr-TR')} ₺</td>
                    <td className="p-5">
                      {product.stock > 0 ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase tracking-wider rounded-full">Aktif</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider rounded-full">Pasif</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/${product.id}`}
                          className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                          title="Düzenle"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                          title="Sil"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
