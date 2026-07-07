const iadeData = {
  title: 'İade Koşulları',
  slug: 'iade',
  content: 'İade Koşulları\n\nSitemizden aldığınız ürünleri 30 gün içerisinde koşulsuz iade edebilirsiniz. İade işlemleri için iletişim adresimizden bizimle irtibata geçebilirsiniz.\n\nİade Edilemeyecek Ürünler:\n- Kullanılmış ürünler\n- Kozmetik ve kişisel bakım ürünleri (paketi açılmışsa)\n\nİade süreci başlatıldıktan sonra ücret iadeniz 3-5 iş günü içerisinde bankanıza iletilir.',
  isActive: true,
};

const gizlilikData = {
  title: 'Gizlilik Sözleşmesi',
  slug: 'gizlilik',
  content: 'Gizlilik Sözleşmesi\n\nMüşteri verileriniz 256-bit SSL sertifikası ile korunmaktadır. Kredi kartı bilgileriniz hiçbir şekilde sunucularımızda saklanmaz.\n\nKişisel Verilerin Korunması:\nBizimle paylaştığınız e-posta ve telefon bilgileri sadece sipariş süreçleriniz ve (onayınız varsa) kampanya bilgilendirmeleri için kullanılır. Üçüncü şahıslarla asla paylaşılmaz.',
  isActive: true,
};

async function seed() {
  try {
    await fetch('http://localhost:3000/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(iadeData)
    });
    console.log("İade oluşturuldu");
    
    await fetch('http://localhost:3000/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gizlilikData)
    });
    console.log("Gizlilik oluşturuldu");
  } catch (err) {
    console.error(err);
  }
}

seed();
