"use client";

import { useState, useEffect } from "react";
import { FiSave, FiCreditCard, FiPlus, FiTrash2 } from "react-icons/fi";

type BankInstallment = {
  id: string;
  bankName: string;
  logoText: string;
  logoColor: string;
  condition: string;
  installments: string;
};

export default function BankSettingsPage() {
  const [banks, setBanks] = useState<BankInstallment[]>([]);
  const [iyzicoSettings, setIyzicoSettings] = useState({
    iyzicoApiKey: '',
    iyzicoSecretKey: '',
    iyzicoEnvironment: 'sandbox'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) {
        if (data.bankInstallments) {
          try {
            const parsed = JSON.parse(data.bankInstallments);
            setBanks(parsed);
          } catch(e) {
            console.error("Failed to parse bankInstallments", e);
          }
        }
        setIyzicoSettings({
          iyzicoApiKey: data.iyzicoApiKey || '',
          iyzicoSecretKey: data.iyzicoSecretKey || '',
          iyzicoEnvironment: data.iyzicoEnvironment || 'sandbox'
        });
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleAddBank = () => {
    setBanks([...banks, {
      id: Math.random().toString(36).substring(7),
      bankName: "Yeni Banka",
      logoText: "kartadi",
      logoColor: "#000000",
      condition: "Tüm alışverişlerde",
      installments: "2 Taksit"
    }]);
  };

  const handleRemoveBank = (id: string) => {
    if (confirm("Bu bankayı silmek istediğinize emin misiniz?")) {
      setBanks(banks.filter(b => b.id !== id));
    }
  };

  const handleChange = (id: string, field: keyof BankInstallment, value: string) => {
    setBanks(banks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        bankInstallments: JSON.stringify(banks),
        ...iyzicoSettings
      })
    });
    setSaving(false);
    alert('Banka bilgileri başarıyla kaydedildi!');
  };

  if (loading) return <div className="p-12 text-center text-gray-500 font-medium">Banka Bilgileri Yükleniyor...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 min-h-screen pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
             <FiCreditCard size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Banka ve Taksit Ayarları</h1>
            <p className="text-gray-500 font-medium">Ürün detay sayfasında görünecek taksit tablosunu yönetin.</p>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-slate-900 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
        >
          <FiSave size={20} /> {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-200 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Ödeme Altyapısı (Iyzico) Ayarları</h2>
        <div className="text-sm text-yellow-700 mb-6 space-y-3">
          <p>
            Sitenizde kredi kartı ve banka kartı ile güvenle ödeme alabilmek için Iyzico API bilgilerinizi buraya girmelisiniz. 
            Sisteminiz tam olarak hazır olana kadar <strong>"Test (Sandbox) Modu"</strong>nu kullanabilirsiniz.
          </p>
          <div className="bg-yellow-100/50 p-4 rounded-xl border border-yellow-200">
            <h4 className="font-bold text-yellow-900 mb-1">Bu Anahtarlar Ne İşe Yarar?</h4>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li><strong>API Key (API Anahtarı):</strong> Iyzico&apos;ya &quot;Ben MultiShop&apos;um&quot; demenizi sağlayan kimlik numaranızdır.</li>
              <li><strong>Secret Key (Güvenlik Anahtarı):</strong> Gerçekten sizin olduğunuzu ispatlayan gizli şifrenizdir.</li>
            </ul>
            <h4 className="font-bold text-yellow-900 mb-1">Nasıl Test Edebilirim?</h4>
            <p>
              Iyzico üye iş yeri başvurunuz onaylanmadan önce sistemi denemek isterseniz <a href="https://sandbox-merchant.iyzipay.com/auth/register" target="_blank" rel="noreferrer" className="font-bold underline text-blue-600 hover:text-blue-800">sandbox-merchant.iyzipay.com</a> adresinden 1 dakikada sahte bir test hesabı açabilirsiniz. Oradan alacağınız Test API ve Secret Key&apos;i buraya girerek sitenizi sahte kredi kartlarıyla test edebilirsiniz.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-yellow-900 mb-2">API Key (API Anahtarı)</label>
            <input 
              type="text" 
              value={iyzicoSettings.iyzicoApiKey} 
              onChange={e => setIyzicoSettings({...iyzicoSettings, iyzicoApiKey: e.target.value})} 
              className="w-full p-3 bg-white border border-yellow-300 rounded-xl outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 font-mono text-sm shadow-sm transition-all" 
              placeholder="sandbox-..." 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-yellow-900 mb-2">Secret Key (Güvenlik Anahtarı)</label>
            <input 
              type="text" 
              value={iyzicoSettings.iyzicoSecretKey} 
              onChange={e => setIyzicoSettings({...iyzicoSettings, iyzicoSecretKey: e.target.value})} 
              className="w-full p-3 bg-white border border-yellow-300 rounded-xl outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 font-mono text-sm shadow-sm transition-all" 
              placeholder="sandbox-..." 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-yellow-900 mb-2">Çalışma Modu</label>
            <select 
              value={iyzicoSettings.iyzicoEnvironment} 
              onChange={e => setIyzicoSettings({...iyzicoSettings, iyzicoEnvironment: e.target.value})} 
              className="w-full p-3 bg-white border border-yellow-300 rounded-xl outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 font-bold text-slate-800 shadow-sm transition-all"
            >
              <option value="sandbox">Test (Sandbox) Modu</option>
              <option value="production">Gerçek İşlem (Canlı) Modu</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Banka Taksit Seçenekleri (Vitrin)</h2>
      </div>

      <div className="space-y-6">
        {banks.map((bank, index) => (
          <div key={bank.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 relative group transition-all hover:shadow-md">
            
            <div className="flex-1 space-y-4">
               <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-2">Banka Adı (Örn: İş Bankası)</label>
                    <input 
                      type="text" 
                      value={bank.bankName} 
                      onChange={e => handleChange(bank.id, 'bankName', e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 font-bold"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-2">Kart Programı (Örn: maximum)</label>
                    <input 
                      type="text" 
                      value={bank.logoText} 
                      onChange={e => handleChange(bank.id, 'logoText', e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Kart Rengi</label>
                    <input 
                      type="color" 
                      value={bank.logoColor} 
                      onChange={e => handleChange(bank.id, 'logoColor', e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                  </div>
               </div>

               <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-2">Kampanya Şartı (Örn: Tüm alışverişlerde)</label>
                    <input 
                      type="text" 
                      value={bank.condition} 
                      onChange={e => handleChange(bank.id, 'condition', e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 font-medium text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-2">Taksit (Örn: 2 - 6 Taksit)</label>
                    <input 
                      type="text" 
                      value={bank.installments} 
                      onChange={e => handleChange(bank.id, 'installments', e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 font-bold text-sm"
                    />
                  </div>
               </div>
            </div>

            {/* Önizleme & Silme */}
            <div className="w-full md:w-64 border-l border-gray-100 pl-0 md:pl-6 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">Canlı Önizleme</label>
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-600">{bank.bankName}</div>
                    <div className="text-sm font-black font-serif italic tracking-tighter" style={{ color: bank.logoColor }}>{bank.logoText}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-600">{bank.condition}</div>
                    <div className="text-[13px] font-bold text-slate-900">{bank.installments}</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleRemoveBank(bank.id)}
                className="mt-4 text-red-500 font-bold text-sm flex items-center justify-center gap-2 py-2 px-4 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
              >
                <FiTrash2 /> Bankayı Sil
              </button>
            </div>

          </div>
        ))}

        <button 
          onClick={handleAddBank}
          className="w-full border-2 border-dashed border-gray-300 hover:border-primary-500 hover:text-primary-600 text-slate-500 font-bold py-6 rounded-3xl flex items-center justify-center gap-2 transition-colors"
        >
          <FiPlus size={24} /> Yeni Banka Ekle
        </button>
      </div>

    </div>
  );
}
