"use client";

import { useState, useEffect } from "react";
import { FiMessageCircle, FiCheck, FiX, FiTrash2, FiCornerDownRight } from "react-icons/fi";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: !currentStatus } : r));
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Bu yorumu tamamen silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    }
  };

  const submitReply = async () => {
    if (!selectedReview) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedReview.id, adminReply: replyText })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.map(r => r.id === selectedReview.id ? { ...r, adminReply: replyText } : r));
        setReplyModalOpen(false);
        setSelectedReview(null);
        setReplyText("");
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
             <FiMessageCircle size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Yorum Yönetimi</h1>
            <p className="text-gray-500 font-medium">Müşteri yorumlarını onaylayın ve yanıtlayın.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Yorumlar yükleniyor...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">Henüz yorum yapılmamış.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="p-4 font-bold text-slate-600 text-sm">Müşteri / Ürün</th>
                <th className="p-4 font-bold text-slate-600 text-sm">Yorum</th>
                <th className="p-4 font-bold text-slate-600 text-sm w-32">Durum</th>
                <th className="p-4 font-bold text-slate-600 text-sm text-right w-48">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 align-top">
                    <div className="font-bold text-slate-900">{review.user?.name || "İsimsiz"}</div>
                    <div className="text-xs text-slate-500 mb-2">{review.user?.email}</div>
                    <div className="text-xs font-bold text-primary-600">{review.product?.title}</div>
                    <div className="text-[11px] text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString("tr-TR")}</div>
                  </td>
                  <td className="p-4 align-top">
                    <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>
                    {review.adminReply && (
                      <div className="mt-2 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                          <FiCornerDownRight /> Mağaza Yanıtı
                        </span>
                        <p className="text-xs text-slate-700">{review.adminReply}</p>
                      </div>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    <button 
                      onClick={() => toggleApproval(review.id, review.isApproved)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        review.isApproved 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      {review.isApproved ? <FiCheck size={14} /> : <FiX size={14} />}
                      {review.isApproved ? 'Onaylı' : 'Onay Bekliyor'}
                    </button>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedReview(review);
                          setReplyText(review.adminReply || "");
                          setReplyModalOpen(true);
                        }}
                        className="bg-white border border-gray-200 text-slate-700 hover:text-primary-600 hover:border-primary-200 p-2 rounded-lg transition-colors"
                        title="Yanıtla"
                      >
                        <FiCornerDownRight size={18} />
                      </button>
                      <button 
                        onClick={() => deleteReview(review.id)}
                        className="bg-white border border-gray-200 text-slate-700 hover:text-red-500 hover:border-red-200 p-2 rounded-lg transition-colors"
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
        )}
      </div>

      {replyModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-900">Yoruma Yanıt Ver</h2>
              <button 
                onClick={() => setReplyModalOpen(false)} 
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">{selectedReview.user?.name} diyor ki:</span>
                <p className="text-sm text-slate-700 italic">"{selectedReview.comment}"</p>
              </div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mağaza Yanıtınız</label>
              <textarea 
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                rows={4}
                placeholder="Müşteriye yanıtınızı buraya yazın..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700 font-medium resize-none"
              />
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setReplyModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={submitReply}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-primary-600 shadow-lg transition-colors"
              >
                Yanıtı Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
