import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  try {
    const user = await prisma.user.create({
      data: { name: 'Ahmet Yılmaz', email: 'ahmet.y@example.com', password: 'hashedpassword' }
    });
    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({ data: { name: 'Elektronik', slug: 'elektronik' } });
    }
    const product = await prisma.product.create({
      data: { title: 'Test Telefon', description: 'Test', price: 5000, categoryId: category.id }
    });
    await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 5000,
        paymentMethod: 'COD',
        orderItems: {
          create: { productId: product.id, quantity: 1, price: 5000 }
        }
      }
    });
    console.log('Mock order created!');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
seed();
