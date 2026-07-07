const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });async function main() {
  await prisma.page.create({
    data: {
      title: 'İade Koşulları',
      slug: 'iade',
      content: 'İade Koşulları\n\nSitemizden aldığınız ürünleri 30 gün içerisinde koşulsuz iade edebilirsiniz. İade işlemleri için iletişim adresimizden bizimle irtibata geçebilirsiniz.\n\nİade Edilemeyecek Ürünler:\n- Kullanılmış ürünler\n- Kozmetik ve kişisel bakım ürünleri (paketi açılmışsa)\n\nİade süreci başlatıldıktan sonra ücret iadeniz 3-5 iş günü içerisinde bankanıza iletilir.',
      isActive: true,
    }
  }).catch(() => console.log("İade sayfası zaten var."));

  await prisma.page.create({
    data: {
      title: 'Gizlilik Sözleşmesi',
      slug: 'gizlilik',
      content: 'Gizlilik Sözleşmesi\n\nMüşteri verileriniz 256-bit SSL sertifikası ile korunmaktadır. Kredi kartı bilgileriniz hiçbir şekilde sunucularımızda saklanmaz.\n\nKişisel Verilerin Korunması:\nBizimle paylaştığınız e-posta ve telefon bilgileri sadece sipariş süreçleriniz ve (onayınız varsa) kampanya bilgilendirmeleri için kullanılır. Üçüncü şahıslarla asla paylaşılmaz.',
      isActive: true,
    }
  }).catch(() => console.log("Gizlilik sayfası zaten var."));
  
  console.log("Sayfalar başarıyla oluşturuldu.");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
