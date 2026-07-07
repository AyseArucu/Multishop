import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Verileri çek - Promise.all yerine sırayla çekiyoruz ki DB bağlantısı aynı anda yorulmasın (neon serverless connection limit error)
  const orders = await prisma.order.findMany({
    where: { status: { not: 'CANCELLED' } },
    select: { totalAmount: true }
  });
  
  const usersCount = await prisma.user.count();
  
  const lowStockProducts = await prisma.product.count({
    where: { stock: { lt: 5 } }
  });
  
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      totalAmount: true,
      status: true,
      createdAt: true
    }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Yönetim Paneli Özeti</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Toplam Ciro (Başarılı)</h3>
          <p className="text-3xl font-bold text-slate-900">{totalRevenue.toLocaleString('tr-TR')} ₺</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Toplam Sipariş</h3>
          <p className="text-3xl font-bold text-slate-900">{totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Kayıtlı Kullanıcı Sayısı</h3>
          <p className="text-3xl font-bold text-slate-900">{usersCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-red-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Kritik Stok Uyarısı</h3>
          <p className="text-3xl font-bold text-red-500">{lowStockProducts}</p>
          <span className="text-gray-400 text-sm mt-2 block">Stoğu 5'in altında olan ürünler</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80 flex flex-col justify-center items-center text-gray-400">
           <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
           <p className="font-medium">Satış Grafiği Modülü Yakında Eklenecek</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-y-auto max-h-80">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Son Siparişler</h3>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500">Henüz sipariş bulunmuyor.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-slate-800">{order.firstName} {order.lastName}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')} - {new Date(order.createdAt).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-bold text-pink-600">{order.totalAmount.toLocaleString('tr-TR')} ₺</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold mt-1 ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                      order.status === 'PREPARING' ? 'bg-blue-100 text-blue-600' :
                      order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-600' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {order.status === 'COMPLETED' ? 'Tamamlandı' : 
                       order.status === 'PREPARING' ? 'Hazırlanıyor' : 
                       order.status === 'SHIPPED' ? 'Kargolandı' : 
                       order.status === 'CANCELLED' ? 'İptal Edildi' : 'Bekliyor'}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link href="/admin/orders" className="text-sm font-bold text-pink-500 hover:text-pink-600">
                  Tüm Siparişleri Gör →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
