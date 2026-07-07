import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6">
          <Link href="/admin/dashboard" className="text-2xl font-bold tracking-tighter">
            ADMIN PANEL
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin/dashboard" className="block px-4 py-3 rounded-md bg-slate-800 text-white font-medium">
            Kontrol Paneli
          </Link>
          <Link href="/admin/products" className="block px-4 py-3 rounded-md text-gray-400 hover:bg-slate-800 hover:text-white transition">
            Ürünler
          </Link>
          <Link href="/admin/categories" className="block px-4 py-3 rounded-md text-gray-400 hover:bg-slate-800 hover:text-white transition">
            Kategoriler
          </Link>
          <Link href="/admin/users" className="block px-4 py-3 rounded-md text-gray-400 hover:bg-slate-800 hover:text-white transition">
            Müşteriler
          </Link>
          <Link href="/admin/reviews" className="block px-4 py-3 rounded-md text-gray-400 hover:bg-slate-800 hover:text-white transition">
            Yorum Yönetimi
          </Link>
          <Link href="/admin/orders" className="block px-4 py-3 rounded-md text-gray-400 hover:bg-slate-800 hover:text-white transition">
            Siparişler
          </Link>
          <Link href="/admin/pages" className="block px-4 py-3 rounded-md text-gray-400 hover:bg-slate-800 hover:text-white transition">
            Sayfa Yönetimi
          </Link>
          <Link href="/admin/settings" className="block px-4 py-3 rounded-md text-gray-400 hover:bg-slate-800 hover:text-white transition">
            Site & Logo Ayarları
          </Link>
          <Link href="/admin/settings/banks" className="block px-4 py-3 rounded-md text-gray-400 hover:bg-slate-800 hover:text-white transition">
            Banka & Taksit Ayarları
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">Yönetim Masası</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Admin Kullanıcısı</span>
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
