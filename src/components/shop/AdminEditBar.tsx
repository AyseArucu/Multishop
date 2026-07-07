"use client";

import { useEditStore } from "@/store/useEditStore";
import { useState } from "react";
import { FiEdit3, FiSave, FiX, FiCheck } from "react-icons/fi";

export default function AdminEditBar() {
  const { isEditMode, toggleEditMode, draftSettings } = useEditStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // In a real app with next-auth, you would check the session here.
  // We'll simulate admin access for the demo.
  const isAdmin = true;

  if (!isAdmin) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftSettings)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert("Kaydetme başarısız!");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-[100] transition-transform duration-300 ${isEditMode ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-slate-900 text-white shadow-xl px-6 py-3 flex items-center justify-between border-b-4 border-primary-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
              <FiEdit3 size={18} />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Canlı Düzenleyici Modu Aktif</p>
              <p className="text-xs text-slate-400">Üzerine tıklayarak metinleri değiştirebilir, yandaki oklarla sıralamayı ayarlayabilirsiniz.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <FiX size={16} /> Moddan Çık
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                saved 
                  ? 'bg-green-500 text-white'
                  : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30'
              }`}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : saved ? (
                <FiCheck size={16} />
              ) : (
                <FiSave size={16} />
              )}
              {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button when closed - HIDDEN FOR NOW */}
      {/*
      {!isEditMode && isAdmin && (
        <button
          onClick={toggleEditMode}
          className="fixed bottom-24 right-6 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all hover:scale-110 z-[90] flex items-center justify-center group border-2 border-white/10"
        >
          <FiEdit3 size={24} />
          <span className="absolute right-16 bg-slate-900 text-white text-sm font-bold py-2 px-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Düzenleyiciyi Aç
          </span>
        </button>
      )}
      */}
    </>
  );
}
