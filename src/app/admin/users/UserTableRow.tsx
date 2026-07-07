"use client";

import { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiTrash2, FiUserCheck, FiUserX, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function UserTableRow({ user }: { user: any }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleToggleApproval = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !user.isApproved })
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "İşlem başarısız.");
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bu müşteriyi (ve tüm siparişlerini/verilerini) kalıcı olarak silmek istediğinize emin misiniz?")) return;
    
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Silme başarısız.");
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="p-4">
        <div className="font-bold text-slate-900">{user.name}</div>
        <div className="text-sm text-slate-500">{user.email}</div>
      </td>
      <td className="p-4 text-sm text-slate-600 font-medium">
        {user.phone || '-'}
      </td>
      <td className="p-4 text-sm text-slate-600">
        {new Date(user.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
      <td className="p-4">
        {user.isApproved ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
            <FiCheckCircle size={14} /> Onaylı
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
            <FiClock size={14} /> Onay Bekliyor
          </span>
        )}
      </td>
      <td className="p-4 text-right flex justify-end gap-2">
        {user.isApproved ? (
          <button 
            disabled={isUpdating}
            onClick={handleToggleApproval}
            className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
            title="Onayı Kaldır"
          >
            <FiUserX size={14} /> Onayı Al
          </button>
        ) : (
          <button 
            disabled={isUpdating}
            onClick={handleToggleApproval}
            className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 hover:bg-green-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
            title="Kullanıcıyı Onayla"
          >
            <FiUserCheck size={14} /> Onayla
          </button>
        )}
        <button 
          disabled={isUpdating}
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
          title="Kullanıcıyı Sil"
        >
          <FiTrash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
