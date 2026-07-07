"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus, FiTrash2, FiEdit2, FiFolder, FiFolderMinus } from "react-icons/fi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", isActive: true, imageUrl: "" });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setEditFormData({ ...editFormData, imageUrl: data.url });
      } else {
        alert(data.error || "Resim yüklenemedi");
      }
    } catch (error) {
      alert("Resim yükleme hatası");
    } finally {
      setUploading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?all=true", { cache: "no-store" });
      if (!res.ok) throw new Error("Kategoriler getirilemedi");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? Alt kategorileri varsa silinemez.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Silme başarısız");
      }
      setCategories(categories.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        setEditingId(null);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || "Güncelleme başarısız");
      }
    } catch (err) {
      alert("Bağlantı hatası");
    }
  };

  // Group categories by parentId to build a hierarchy view
  const rootCategories = categories.filter(c => !c.parentId);
  
  const renderCategoryNode = (category: any, depth: number = 0) => {
    const children = categories.filter(c => c.parentId === category.id);
    
    return (
      <div key={category.id} className="flex flex-col">
        <div className={`flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors ${depth > 0 ? 'ml-8 border-l-4 border-l-gray-200' : ''}`}>
          {editingId === category.id ? (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full">
                <input 
                  type="text" 
                  value={editFormData.name} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none flex-1 font-bold text-slate-900"
                  placeholder="Kategori Adı"
                />
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editFormData.isActive} 
                    onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  Aktif
                </label>
                <div className="flex items-center gap-2 ml-auto">
                  <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors">İptal</button>
                  <button onClick={() => handleUpdate(category.id)} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors">Kaydet</button>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full mt-2 border border-gray-100 p-3 rounded-lg bg-gray-50/50">
                <span className="text-xs font-bold text-slate-500 uppercase">Kategori Resmi</span>
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <button type="button" disabled={uploading} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors whitespace-nowrap disabled:opacity-50">
                      {uploading ? "Yükleniyor..." : "Bilgisayardan Seç"}
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 font-bold">veya</span>
                  <input 
                    type="text" 
                    value={editFormData.imageUrl || ""} 
                    onChange={(e) => setEditFormData({...editFormData, imageUrl: e.target.value})}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none flex-1 text-slate-700"
                    placeholder="Resim URL (Örn: https://...)"
                  />
                </div>
                {editFormData.imageUrl && (
                  <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
                    <img src={editFormData.imageUrl} alt="Önizleme" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                {depth === 0 ? <FiFolder className="text-primary-500" size={20} /> : <FiFolderMinus className="text-gray-400" size={18} />}
                <div>
                  <p className="font-bold text-slate-800">{category.name}</p>
                  <p className="text-xs text-gray-500">/{category.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                  {category._count?.products || 0} Ürün
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {category.isActive ? 'Aktif' : 'Pasif'}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setEditingId(category.id);
                      setEditFormData({ name: category.name, isActive: category.isActive, imageUrl: category.imageUrl || "" });
                    }}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Render children recursively */}
        {children.length > 0 && (
          <div className="flex flex-col w-full">
            {children.map(child => renderCategoryNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Kategoriler</h1>
          <p className="text-gray-500 font-medium">Mağazanızdaki tüm kategorileri görüntüleyin ve yönetin.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Tüm Kategoriler</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Yükleniyor...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-medium">{error}</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">Henüz kategori bulunmuyor. Ürün eklerken hızlıca oluşturabilirsiniz.</div>
        ) : (
          <div className="flex flex-col w-full">
            {rootCategories.map(cat => renderCategoryNode(cat, 0))}
          </div>
        )}
      </div>
    </div>
  );
}
