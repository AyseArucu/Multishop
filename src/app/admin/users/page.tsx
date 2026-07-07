import prisma from '@/lib/prisma';
import { FiUsers } from 'react-icons/fi';
import UserTableRow from './UserTableRow';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
          <FiUsers size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Müşteriler & Kullanıcılar</h1>
          <p className="text-gray-500 font-medium">Sisteme kayıtlı üyeler ve açık rıza onay durumları.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="p-4 font-bold text-slate-600 text-sm">Müşteri / E-posta</th>
                <th className="p-4 font-bold text-slate-600 text-sm">Telefon</th>
                <th className="p-4 font-bold text-slate-600 text-sm">Kayıt Tarihi</th>
                <th className="p-4 font-bold text-slate-600 text-sm">Durum</th>
                <th className="p-4 font-bold text-slate-600 text-sm text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <UserTableRow key={user.id} user={user} />
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">
                    Henüz kayıtlı bir müşteri bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
