const {PrismaClient}=require('@prisma/client');
const {Pool}=require('pg');
const {PrismaPg}=require('@prisma/adapter-pg');
require('dotenv/config');

const p = new PrismaClient({adapter:new PrismaPg(new Pool({connectionString:process.env.DATABASE_URL}))});
p.product.count().then(c=>{
  console.log('Product Count:', c); 
  p.$disconnect();
});
