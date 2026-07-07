"use client";

import { useState, useEffect } from "react";
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiEdit, FiTrash2 } from "react-icons/fi";

const statusMap: Record<string, { label: string, color: string, icon: any }> = {
  PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-800", icon: FiClock },
  PREPARING: { label: "Hazırlanıyor", color: "bg-blue-100 text-blue-800", icon: FiPackage },
  SHIPPED: { label: "Kargolandı", color: "bg-purple-100 text-purple-800", icon: FiTruck },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-800", icon: FiCheckCircle },
  CANCELLED: { label: "İptal Edildi", color: "bg-red-100 text-red-800", icon: FiXCircle }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  const [trackingCompany, setTrackingCompany] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openTrackingModal = (order: any) => {
    setSelectedOrder(order);
    setTrackingCompany(order.trackingCompany || "");
    setTrackingNumber(order.trackingNumber || "");
    setOrderStatus(order.status || "");
  };

  const closeTrackingModal = () => {
    setSelectedOrder(null);
    setTrackingCompany("");
    setTrackingNumber("");
    setOrderStatus("");
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCompany,
          trackingNumber,
          status: orderStatus
        })
      });
      
      const data = await res.json();
      if (data.success) {
        // Otomatik Kargolandı işaretleme mantığı
        // Eger kargo numarası girildi ve durum hala PENDING/PREPARING ise:
        if (trackingNumber && trackingCompany && (orderStatus === 'PENDING' || orderStatus === 'PREPARING')) {
           await fetch(`/api/orders/${selectedOrder.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'SHIPPED' })
          });
        }
        await fetchOrders();
        closeTrackingModal();
        alert("Sipariş başarıyla güncellendi.");
      } else {
        alert(data.error || "Güncelleme başarısız.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Bu siparişi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
    
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        alert("Sipariş başarıyla silindi.");
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || "Silme işlemi başarısız oldu.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Sipariş Yönetimi</h1>
          <p className="text-gray-500 font-medium">Müşteri siparişlerini ve kargo süreçlerini yönetin.</p>
        </div>
        <button onClick={fetchOrders} className="text-sm font-bold bg-white border border-gray-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
          Yenile
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500 font-medium">Siparişler yükleniyor...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
          <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium text-lg">Şu anda hiç siparişiniz bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-gray-700 uppercase text-xs font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Sipariş No / Tarih</th>
                  <th className="px-6 py-4">Müşteri</th>
                  <th className="px-6 py-4">Tutar</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4">Kargo Durumu</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const StatusIcon = statusMap[order.status]?.icon || FiPackage;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-slate-800 text-xs">#{order.id.slice(-8).toUpperCase()}</div>
                        <div className="text-gray-400 text-xs mt-1">{new Date(order.createdAt).toLocaleString('tr-TR')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{order.user?.name || "Bilinmeyen Müşteri"}</div>
                        <div className="text-gray-500 text-xs">{order.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {order.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusMap[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                          <StatusIcon size={12} />
                          {statusMap[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.trackingNumber ? (
                          <div>
                            <div className="text-xs font-bold text-primary-600">{order.trackingCompany}</div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">{order.trackingNumber}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Kargo bekleniyor</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => openTrackingModal(order)}
                          className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                        >
                          <FiEdit size={14} /> Düzenle
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                          title="Siparişi Sil"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRACKING MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-slate-800">Sipariş İşlemleri</h3>
              <button onClick={closeTrackingModal} className="text-gray-400 hover:text-gray-600">
                <FiXCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              
              {/* TESLIMAT BILGILERI */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl mb-6">
                <h4 className="text-sm font-bold text-slate-800 mb-3 border-b border-gray-200 pb-2">Teslimat Bilgileri</h4>
                <div className="space-y-1.5 text-sm">
                  <p><span className="text-gray-500 font-medium">Alıcı:</span> <span className="font-bold">{selectedOrder.firstName || 'Bilinmiyor'} {selectedOrder.lastName || ''}</span></p>
                  <p><span className="text-gray-500 font-medium">Telefon:</span> {selectedOrder.phone || 'Belirtilmedi'}</p>
                  <p><span className="text-gray-500 font-medium">E-Posta:</span> {selectedOrder.email || 'Belirtilmedi'}</p>
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <p className="text-gray-500 font-medium mb-1">Açık Adres:</p>
                    <p className="text-slate-700 bg-white p-2 rounded border border-gray-100">{selectedOrder.address || 'Adres bilgisi yok.'}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sipariş Durumu</label>
                <select 
                  value={orderStatus} 
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-medium text-slate-700"
                >
                  <option value="PENDING">Bekliyor</option>
                  <option value="PREPARING">Hazırlanıyor</option>
                  <option value="SHIPPED">Kargolandı</option>
                  <option value="DELIVERED">Teslim Edildi</option>
                  <option value="CANCELLED">İptal Edildi</option>
                </select>
                {selectedOrder.status === 'CANCELLED' && selectedOrder.cancelReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-xs font-bold text-red-800 mb-1">İptal Bilgisi:</p>
                    <p className="text-sm text-red-600">{selectedOrder.cancelReason}</p>
                  </div>
                )}
              </div>

              <div className="bg-primary-50/50 border border-primary-100 p-4 rounded-2xl space-y-4 mt-6">
                <h4 className="text-sm font-bold text-primary-800 flex items-center gap-2"><FiTruck /> Kargo Bilgileri</h4>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Kargo Firması</label>
                  <input 
                    type="text" 
                    value={trackingCompany} 
                    onChange={(e) => setTrackingCompany(e.target.value)}
                    placeholder="Örn: Yurtiçi Kargo"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Takip Numarası</label>
                  <input 
                    type="text" 
                    value={trackingNumber} 
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Örn: 1Z9999999999999999"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-mono"
                  />
                </div>
                <p className="text-[11px] text-gray-500">Not: Kargo bilgileri girildiğinde durum "Bekliyor/Hazırlanıyor" ise otomatik "Kargolandı" olur.</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button 
                onClick={closeTrackingModal}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition"
              >
                İptal
              </button>
              <button 
                onClick={handleUpdateOrder}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-primary-600 transition shadow-lg disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
