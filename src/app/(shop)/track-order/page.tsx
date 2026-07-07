"use client";

import { useState, useEffect, Suspense } from "react";
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiBox } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

const stages = [
  { id: "PENDING", label: "Sipariş Alındı", icon: FiClock },
  { id: "PREPARING", label: "Hazırlanıyor", icon: FiBox },
  { id: "SHIPPED", label: "Kargoya Verildi", icon: FiTruck },
  { id: "DELIVERED", label: "Teslim Edildi", icon: FiCheckCircle },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');
  
  const [orderId, setOrderId] = useState(urlId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();

  // Auto-search if URL has an ID
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Sipariş detaylarını görüntülemek için giriş yapmalısınız.");
      router.push('/profile');
      return;
    }

    if (urlId) {
      performSearch(urlId);
    }
  }, [urlId, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    performSearch(orderId.trim());
  };

  const performSearch = async (idToSearch: string) => {
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${idToSearch}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || "Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.");
      }
    } catch (err) {
      console.error(err);
      setError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status: string) => {
    if (status === 'CANCELLED') return -1;
    return stages.findIndex(s => s.id === status);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Kargom Nerede?</h1>
          <p className="text-gray-500 font-medium">Sipariş numaranızı girerek kargonuzun güncel durumunu öğrenebilirsiniz.</p>
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                <FiSearch size={20} />
              </div>
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Sipariş Numaranız (Örn: cm5n2...)" 
                className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-mono text-slate-700"
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !orderId.trim()}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-600/30 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:shadow-none"
            >
              {loading ? 'Sorgulanıyor...' : 'Sorgula'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* ORDER DETAILS */}
        {order && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Sipariş Detayı</h2>
                <p className="text-gray-500 text-sm font-mono mt-1">#{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Sipariş Tarihi</p>
                <p className="font-bold text-slate-800">{new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6 sm:p-12 border-b border-gray-100">
              {order.status === 'CANCELLED' ? (
                <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                  <h3 className="text-red-600 font-bold text-xl mb-2">Sipariş İptal Edildi</h3>
                  <p className="text-red-500 text-sm">Bu sipariş iptal edilmiştir. Detaylı bilgi için müşteri hizmetleriyle iletişime geçebilirsiniz.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Bar Background */}
                  <div className="absolute left-[19px] sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 sm:top-[20px] sm:bottom-auto sm:left-[10%] sm:right-[10%] w-[2px] sm:w-auto sm:h-[2px] bg-gray-200" />
                  
                  {/* Active Progress Bar */}
                  <div 
                    className="absolute left-[19px] sm:left-1/2 sm:-translate-x-1/2 top-0 sm:top-[20px] sm:bottom-auto sm:left-[10%] w-[2px] sm:h-[2px] bg-primary-500 transition-all duration-1000" 
                    style={{ 
                      height: typeof window !== 'undefined' && window.innerWidth < 640 ? `${(getStageIndex(order.status) / 3) * 100}%` : 'auto',
                      width: typeof window !== 'undefined' && window.innerWidth >= 640 ? `${(getStageIndex(order.status) / 3) * 100}%` : 'auto'
                    }} 
                  />

                  <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-0">
                    {stages.map((stage, index) => {
                      const isActive = getStageIndex(order.status) >= index;
                      const Icon = stage.icon;
                      return (
                        <div key={stage.id} className="flex sm:flex-col items-center sm:w-1/4 gap-4 sm:gap-3 group">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${isActive ? 'bg-primary-500 border-primary-100 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                            <Icon size={16} />
                          </div>
                          <span className={`font-bold text-sm sm:text-center transition-colors duration-500 ${isActive ? 'text-slate-900' : 'text-gray-400'}`}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tracking Info */}
            {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && order.trackingNumber && (
              <div className="p-6 sm:p-8 bg-blue-50/50 border-b border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center text-blue-600">
                    <FiTruck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Kargo Bilgileri</h3>
                    <p className="text-sm text-gray-600 mb-3">Siparişiniz kargoya verilmiştir. Aşağıdaki kargo numarasını tıklayarak takip edebilirsiniz.</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-xs text-gray-500 block mb-0.5">Kargo Firması</span>
                        <span className="font-bold text-slate-800">{order.trackingCompany || 'Belirtilmedi'}</span>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-xs text-gray-500 block mb-0.5">Takip Numarası</span>
                        <a 
                          href={`https://www.google.com/search?q=${encodeURIComponent(order.trackingCompany + ' kargo takip ' + order.trackingNumber)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-bold font-mono text-primary-600 hover:text-primary-800 hover:underline flex items-center gap-1"
                        >
                          {order.trackingNumber}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            <div className="p-6 sm:p-8">
              <h3 className="font-bold text-slate-800 mb-6">Sipariş İçeriği</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 overflow-hidden relative flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.product.title} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <FiPackage />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate">{item.product.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.quantity} Adet</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-slate-600">Toplam Tutar</span>
                <span className="text-2xl font-black text-slate-900">{order.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-32 text-center text-gray-500">Yükleniyor...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
