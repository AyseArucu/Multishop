export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-lg text-slate-500 mb-8">Aradığınız sayfa bulunamadı.</p>
      <Link href="/" className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
