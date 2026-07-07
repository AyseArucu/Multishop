"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { FiShield } from 'react-icons/fi';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [mounted, setMounted] = useState(false);
  const [discountThreshold, setDiscountThreshold] = useState(2000);
  const [discountRate, setDiscountRate] = useState(10);
  const [shippingFee, setShippingFee] = useState(49.90);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);
  const { getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Sipariş verebilmek için lütfen giriş yapın veya üye olun.");
      router.push('/profile');
      return;
    } else {
      setFormData(prev => ({ ...prev, email: userEmail }));
    }

    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data) {
        if (data.cartDiscountThreshold) setDiscountThreshold(Number(data.cartDiscountThreshold));
        if (data.cartDiscountRate) setDiscountRate(Number(data.cartDiscountRate));
        if (data.shippingFee) setShippingFee(Number(data.shippingFee));
        if (data.freeShippingThreshold) setFreeShippingThreshold(Number(data.freeShippingThreshold));
      }
    }).catch(console.error);
    setMounted(true);
  }, []);

  const total = getTotalPrice();
  const discountAmount = total >= discountThreshold ? Math.round(total * (discountRate / 100)) : 0;
  const priceAfterDiscount = total - discountAmount;
  const shipping = priceAfterDiscount >= freeShippingThreshold ? 0 : shippingFee;
  const finalTotal = priceAfterDiscount + shipping;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [iyzicoHtml, setIyzicoHtml] = useState<string | null>(null);

  useEffect(() => {
    if (iyzicoHtml) {
      const container = document.getElementById('iyzico-container');
      if (container) {
        container.innerHTML = '';
        const fragment = document.createRange().createContextualFragment(iyzicoHtml);
        container.appendChild(fragment);
      }
    }
  }, [iyzicoHtml]);

  const handleCheckout = async () => {
    if (getTotalItems() === 0) {
      alert("Sepetiniz boş!");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.address) {
      alert("Lütfen tüm teslimat ve fatura adres bilgilerini doldurun.");
      return;
    }

    setIsSubmitting(true);
    try {
      const items = useCartStore.getState().items.map(i => ({
        productId: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price
      }));

      if (paymentMethod === 'CREDIT_CARD') {
        const res = await fetch('/api/checkout/iyzico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            totalAmount: finalTotal,
            shipping,
            ...formData
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.checkoutFormContent) {
            setIyzicoHtml(data.checkoutFormContent);
          } else {
            alert(data.error || data.errorMessage || "Ödeme formu başlatılamadı.");
          }
        } else {
          const errorData = await res.json().catch(() => ({}));
          alert(errorData.error || "Ödeme altyapısına bağlanırken bir hata oluştu.");
        }
      } else {
        // Other methods (BANK_TRANSFER, COD)
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            totalAmount: finalTotal,
            paymentMethod: paymentMethod,
            ...formData
          })
        });

        if (res.ok) {
          const order = await res.json();
          clearCart();
          router.push(`/checkout/success?orderId=${order.id}`);
        } else {
          alert("Sipariş oluşturulurken bir hata oluştu.");
        }
      }
    } catch (err) {
      alert("Bağlantı hatası oluştu!");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return <div className="min-h-screen"></div>;

  if (iyzicoHtml) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Ödemenizi Tamamlayın</h1>
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 min-h-[500px]">
          <div id="iyzico-container" className="w-full h-full min-h-[500px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Güvenli Ödeme</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Form Section */}
        <div className="flex-[2] space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Teslimat ve Fatura Adresi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Ad" className="w-full p-3 border rounded-lg" required />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Soyad" className="w-full p-3 border rounded-lg" required />
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Telefon" className="w-full p-3 border rounded-lg" required />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="E-posta" className="w-full p-3 border rounded-lg" required />
              <div className="md:col-span-2">
                <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Açık Adres" rows={3} className="w-full p-3 border rounded-lg" required></textarea>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Ödeme Yöntemi</h2>
            
            <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'CREDIT_CARD' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`} onClick={() => setPaymentMethod('CREDIT_CARD')}>
              <label className="flex items-center gap-3 cursor-pointer w-full">
                <input 
                  type="radio" 
                  name="payment" 
                  value="CREDIT_CARD" 
                  checked={paymentMethod === 'CREDIT_CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-pink-500 focus:ring-pink-500" 
                />
                <span className="font-bold text-slate-800">Kredi / Banka Kartı</span>
              </label>
            </div>

            <div className={`mt-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'BANK_TRANSFER' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`} onClick={() => setPaymentMethod('BANK_TRANSFER')}>
              <label className="flex items-center gap-3 cursor-pointer w-full">
                <input 
                  type="radio" 
                  name="payment" 
                  value="BANK_TRANSFER" 
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                  className="w-5 h-5 text-pink-500 focus:ring-pink-500" 
                />
                <span className="font-bold text-slate-800">Havale / EFT</span>
              </label>
            </div>
              
            <div className={`mt-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'COD' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`} onClick={() => setPaymentMethod('COD')}>
              <label className="flex items-center gap-3 cursor-pointer w-full">
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="w-5 h-5 text-slate-900" 
                />
                <span className="ml-3 font-medium">Kapıda Ödeme</span>
              </label>
            </div>
            
            {paymentMethod === 'BANK_TRANSFER' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <h4 className="font-bold text-blue-800 mb-2">Banka Hesap Bilgilerimiz</h4>
                <select className="w-full p-2 rounded border mb-4 bg-white">
                  <option>Banka Seçiniz...</option>
                  <option>Ziraat Bankası</option>
                  <option>Garanti BBVA</option>
                  <option>İş Bankası</option>
                </select>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Alıcı Adı:</strong> MultiShop E-Ticaret A.Ş.</p>
                  <p><strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00 (Seçime göre değişecek)</p>
                  <p className="text-xs mt-2 text-blue-600">Lütfen ödeme açıklamanıza Sipariş Numaranızı yazmayı unutmayın.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Summary Section */}
        <div className="flex-1">
          <div className="bg-pink-50 text-slate-900 p-6 rounded-2xl shadow-xl sticky top-24 border border-pink-100">
            <h2 className="text-xl font-bold mb-6 text-pink-600 border-b border-pink-200 pb-4">Sipariş Özeti</h2>
            <div className="space-y-4 mb-6 font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Ürünler ({getTotalItems()} Adet)</span>
                <span className="text-slate-900">{total} ₺</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>İndirim (%{discountRate})</span>
                  <span>-{discountAmount} ₺</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Kargo</span>
                <span className={shipping === 0 ? "text-green-600 font-bold" : "text-slate-900"}>{shipping === 0 ? 'Ücretsiz' : `${shipping} ₺`}</span>
              </div>
              <div className="border-t border-pink-200 my-4"></div>
              <div className="flex justify-between text-xl font-black text-pink-600">
                <span>Ödenecek Tutar</span>
                <span>{finalTotal} ₺</span>
              </div>
            </div>
            
            <button disabled={isSubmitting} onClick={handleCheckout} className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-lg text-lg">
              {isSubmitting ? 'Sipariş Oluşturuluyor...' : 'Siparişi Tamamla'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              Siparişi tamamlayarak &quot;Mesafeli Satış Sözleşmesini&quot; kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
