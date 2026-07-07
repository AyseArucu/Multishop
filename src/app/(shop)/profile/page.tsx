"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPackage, FiTruck, FiClock, FiCheckCircle, FiXCircle, FiMail, FiChevronRight, FiBox, FiUser, FiPhone, FiLock } from 'react-icons/fi';

const statusMap: Record<string, { label: string, color: string, icon: any }> = {
  PENDING: { label: "Sipariş Alındı", color: "bg-yellow-100 text-yellow-800", icon: FiClock },
  PREPARING: { label: "Hazırlanıyor", color: "bg-blue-100 text-blue-800", icon: FiBox },
  SHIPPED: { label: "Kargoya Verildi", color: "bg-purple-100 text-purple-800", icon: FiTruck },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-800", icon: FiCheckCircle },
  CANCELLED: { label: "İptal Edildi", color: "bg-red-100 text-red-800", icon: FiXCircle }
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Register specific fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [consentChecked, setConsentChecked] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
      fetchOrders(savedEmail);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, hasAcceptedConsent: true })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("userEmail", email.trim());
        setIsLoggedIn(true);
        fetchOrders(email.trim());
        
        // Sync stores
        import('@/store/useCartStore').then(mod => mod.useCartStore.getState().syncWithServer(email.trim()));
        import('@/store/useFavoriteStore').then(mod => mod.useFavoriteStore.getState().syncWithServer(email.trim()));
      } else {
        alert(data.error || "Giriş başarısız.");
      }
    } catch (err) {
      console.error(err);
      alert("Bağlantı hatası.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !passwordConfirm) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    if (password !== passwordConfirm) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    if (!consentChecked) {
      alert("Lütfen Açık Rıza Metni'ni onaylayın.");
      return;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(), 
          password, 
          hasAcceptedConsent: consentChecked 
        })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(data.message || "Hesabınız başarıyla oluşturuldu, yönetici onayı bekleniyor.");
        setActiveTab('login');
        // Kullanıcı onaya düştüğü için artık otomatik giriş YAPMIYORUZ
      } else {
        alert(data.error || "Kayıt işlemi başarısız.");
      }
    } catch (err) {
      console.error(err);
      alert("Bağlantı hatası.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setOrders([]);
    setConsentChecked(false);
    
    // Clear stores
    import('@/store/useCartStore').then(mod => mod.useCartStore.getState().setItems([]));
    import('@/store/useFavoriteStore').then(mod => mod.useFavoriteStore.getState().setItems([]));
  };

  const fetchOrders = async (userEmail: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/my-orders?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || "Siparişleriniz yüklenirken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Siparişinizi iptal etmek istediğinize emin misiniz?")) return;
    
    try {
      const res = await fetch(`/api/orders/track/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', email: email })
      });
      const data = await res.json();
      if (data.success) {
        alert("Siparişiniz başarıyla iptal edildi.");
        fetchOrders(email);
      } else {
        alert(data.error || "İptal işlemi başarısız oldu.");
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    }
  };

  const consentText = "Ünalan Mahallesi, Libadiye Caddesi, Emaar Square, F Blok No:82 F/10 Üsküdar/İstanbul adresinde mukim Veri Sorumlusu MARKA MAĞAZACILIK ANONİM ŞİRKETİ ve Türkiye'de Temsilcisi Olduğu Tüm Markalar (M&S, GAP, Forever21, Lululemon) (hepsi birlikte \"MARKA MAĞAZACILIK\") olarak; Şirketimizin Türkiye'de temsilciliği bulunan her bir markaya ait internet sitesinde yer alan İşbu Elektronik Ticari İleti Açık Rıza Metni kapsamında... İşbu açık rızanıza istinaden Şirketimizle paylaşmış olduğunuz veriler tarafınıza sunulan Elektronik Ticari İleti Aydınlatma Metni ve işbu açık rıza metninde taahhüt edilen şekilde kullanılacaktır. 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve 6698 sayılı Kişisel Verilerin Korunması Hakkında Kanun uyarınca; açık rızanın geri alındığı, ticari elektronik iletinin içeriği ve gönderiye ilişkin diğer kayıtlar gerektiğinde ilgili Bakanlığa ve/veya yargı mercilerine sunulmak üzere kayıt altına alınarak; herhangi bir hukuki ihtilafın vuku bulması halleri hariç açık rızanın geri alındığı tarihten itibaren 10 yıl boyunca saklanacaktır. İşbu süre geçtikten sonra kişisel verileriniz Şirketimiz tarafından imha edilecektir. İşbu açık rızanızı geri almak ve size kampanya tanıtımları veya bilgilendirme amacıyla gönderilen iletilerin artık gönderilmesini istemediğiniz takdirde size gönderilen iletilerde yer alan çıkış işlemini gerçekleştirebilirsiniz. İzinli veri tabanından çıkış işleminiz Şirketimiz ile imzalamış olduğunuz sözleşmeleri sona erdirmez, hizmet almaya devam edersiniz.";

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${activeTab === 'login' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-400 hover:text-slate-700'}`}
            >
              Giriş Yap
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${activeTab === 'register' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-400 hover:text-slate-700'}`}
            >
              Üye Ol
            </button>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-slate-900 mb-2">
                {activeTab === 'login' ? 'Hoş Geldiniz' : 'Aramıza Katılın'}
              </h1>
              <p className="text-gray-500 text-sm">
                {activeTab === 'login' ? 'Alışverişe devam etmek için giriş yapın.' : 'Yeni fırsatları yakalamak için hemen üye olun.'}
              </p>
            </div>

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                      <FiMail size={20} />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta Adresi" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-700"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                      <FiLock size={20} />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Şifre" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-700"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!email.trim() || !password}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Giriş Yap
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                      <FiUser size={20} />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ad Soyad" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-700"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                      <FiPhone size={20} />
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telefon Numarası" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-700"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                      <FiMail size={20} />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta Adresi" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-700"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                      <FiLock size={20} />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Şifre" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-700"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                      <FiLock size={20} />
                    </div>
                    <input 
                      type="password" 
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="Şifreyi Doğrula" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-slate-700"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                  <div className="flex items-center h-5 mt-0.5">
                    <input 
                      id="consent" 
                      type="checkbox" 
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      required
                    />
                  </div>
                  <label htmlFor="consent" className="text-[13px] text-gray-600 leading-tight">
                    <button 
                      type="button" 
                      onClick={() => setConsentModalOpen(true)}
                      className="text-primary-600 font-bold hover:underline"
                    >
                      Açık Rıza Metni
                    </button>
                    'ni okudum ve onaylıyorum.
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={!consentChecked || !name.trim() || !email.trim() || !phone.trim() || !password || !passwordConfirm}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Üye Ol
                </button>
              </form>
            )}

          </div>
        </div>

        {/* Consent Modal */}
        {consentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-slate-900">Açık Rıza Metni</h2>
                <button 
                  onClick={() => setConsentModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-900 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
                >
                  <FiXCircle size={24} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4 font-medium">
                <p>{consentText}</p>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl">
                <button 
                  onClick={() => {
                    setConsentChecked(true);
                    setConsentModalOpen(false);
                  }}
                  className="w-full bg-slate-900 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <FiCheckCircle size={20} /> Okudum, Onaylıyorum
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">Profilim</h1>
            <p className="text-gray-500 font-medium">Hoş geldiniz, <span className="text-slate-800">{email}</span></p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-bold text-gray-500 hover:text-red-500 bg-white border border-gray-200 px-4 py-2 rounded-xl transition shadow-sm"
          >
            Çıkış Yap
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FiPackage /> Sipariş Geçmişim
          </h2>

          {loading ? (
            <div className="py-12 text-center text-gray-500">Siparişleriniz yükleniyor...</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">{error}</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage size={32} />
              </div>
              <p className="text-gray-500 font-medium mb-4">Henüz hiç siparişiniz bulunmamaktadır.</p>
              <Link href="/products" className="inline-block bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition">
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const StatusIcon = statusMap[order.status]?.icon || FiPackage;
                const isShipped = order.status === 'SHIPPED' || order.status === 'DELIVERED';
                
                return (
                  <div key={order.id} className="border border-gray-100 rounded-2xl p-4 sm:p-6 bg-gray-50/50 hover:bg-white transition-colors group">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      
                      {/* Left: Info */}
                      <div className="flex-1 w-full space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Sipariş No</span>
                            <span className="font-mono font-bold text-slate-800">#{order.id.slice(-8).toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Tarih</span>
                            <span className="font-medium text-slate-700">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Tutar</span>
                            <span className="font-black text-slate-900">{order.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                          </div>
                          <div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusMap[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                              <StatusIcon size={14} />
                              {statusMap[order.status]?.label || order.status}
                            </span>
                          </div>
                        </div>

                        {/* Products preview */}
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-3 overflow-hidden">
                            {order.orderItems.slice(0, 4).map((item: any) => (
                              <div key={item.id} className="w-10 h-10 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden">
                                {item.product.images?.[0] ? (
                                  <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <FiPackage className="text-gray-400 text-xs" />
                                  </div>
                                )}
                              </div>
                            ))}
                            {order.orderItems.length > 4 && (
                              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm z-10">
                                +{order.orderItems.length - 4}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            {order.orderItems.length} ürün içeriyor
                          </span>
                        </div>
                        
                        {/* Kargo Bilgisi Özeti */}
                        {isShipped && order.trackingNumber && (
                          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 inline-block w-full sm:w-auto">
                            <p className="text-xs text-gray-500 mb-1">Kargo Firması: <strong className="text-slate-800">{order.trackingCompany}</strong></p>
                            <p className="text-xs text-gray-500">Takip No: <strong className="font-mono text-primary-600">{order.trackingNumber}</strong></p>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
                        <Link 
                          href={`/track-order?id=${order.id}`}
                          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition shadow-sm w-full lg:w-auto ${
                            isShipped 
                            ? 'bg-slate-900 text-white hover:bg-primary-600 hover:shadow-lg' 
                            : 'bg-white border border-gray-200 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {isShipped ? (
                            <>
                              <FiTruck /> Kargom Nerede
                            </>
                          ) : (
                            <>
                              Sipariş Detayı <FiChevronRight />
                            </>
                          )}
                        </Link>
                        {order.status === 'PENDING' && (
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition shadow-sm w-full lg:w-auto bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200"
                          >
                            İptal Et
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
