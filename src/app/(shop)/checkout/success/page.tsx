"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiTruck, FiShoppingBag, FiCopy } from 'react-icons/fi';
import { Suspense, useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [copied, setCopied] = useState(false);
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    // Sipariş başarılı olduğuna göre sepeti temizle
    clearCart();
  }, [clearCart]);

  const copyToClipboard = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <FiCheckCircle size={48} />
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-4 text-center">Siparişiniz Başarıyla Alındı!</h1>
      <p className="text-lg text-slate-600 mb-8 text-center max-w-lg">
        Bizi tercih ettiğiniz için teşekkür ederiz. Siparişiniz özenle hazırlanıp en kısa sürede kargoya verilecektir.
      </p>

      {orderId && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-center mb-10 w-full max-w-md">
          <p className="text-sm text-gray-500 mb-2 font-bold uppercase tracking-wider">Sipariş Numaranız</p>
          <div 
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-3 text-xl font-mono font-bold text-primary-600 bg-primary-50 py-3 px-4 rounded-xl border border-primary-100 cursor-pointer hover:bg-primary-100 transition-colors group"
            title="Kopyalamak için tıklayın"
          >
            {orderId}
            <FiCopy className="text-primary-400 group-hover:text-pink-600" />
          </div>
          <p className={`text-xs mt-3 font-medium transition-colors ${copied ? 'text-green-500' : 'text-gray-400'}`}>
            {copied ? 'Kopyalandı!' : 'Bu numarayı sipariş takibi için lütfen not edin.'}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link href={`/track-order${orderId ? `?id=${orderId}` : ''}`} className="flex-1 bg-slate-900 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg text-center flex items-center justify-center gap-2 group">
          <FiTruck size={20} className="group-hover:translate-x-1 transition-transform" />
          Kargom Nerede?
        </Link>
        <Link href="/products" className="flex-1 bg-white border-2 border-gray-200 hover:border-slate-400 text-slate-700 font-bold py-4 px-6 rounded-xl transition text-center flex items-center justify-center gap-2">
          <FiShoppingBag size={20} />
          Alışverişe Dön
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
