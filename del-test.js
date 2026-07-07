const {PrismaClient}=require('@prisma/client');
const {Pool}=require('pg');
const {PrismaPg}=require('@prisma/adapter-pg');
require('dotenv/config');

const p = new PrismaClient({adapter:new PrismaPg(new Pool({connectionString:process.env.DATABASE_URL}))});
async function run() {
  // Find the test product
  const prod = await p.product.findFirst({ where: { title: 'Test Telefon' } });
  if (prod) {
    // Delete any order items linked to it
    await p.orderItem.deleteMany({ where: { productId: prod.id } });
    console.log('Deleted order items for Test Telefon');
  }
  
  p.$disconnect();
}
run();
