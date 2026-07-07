const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const themeSetting = await prisma.setting.findUnique({ where: { key: 'globalThemeColor' } });
  const themeColor = themeSetting ? themeSetting.value : '#ea5a8b';

  await prisma.setting.upsert({
    where: { key: 'footerBgColor' },
    update: { value: '#ffffff' },
    create: { key: 'footerBgColor', value: '#ffffff' }
  });
  await prisma.setting.upsert({
    where: { key: 'footerTitleColor' },
    update: { value: themeColor },
    create: { key: 'footerTitleColor', value: themeColor }
  });
  await prisma.setting.upsert({
    where: { key: 'footerTextColor' },
    update: { value: '#4b5563' },
    create: { key: 'footerTextColor', value: '#4b5563' }
  });
  await prisma.setting.upsert({
    where: { key: 'footerBtnBg' },
    update: { value: themeColor },
    create: { key: 'footerBtnBg', value: themeColor }
  });
  await prisma.setting.upsert({
    where: { key: 'footerBtnText' },
    update: { value: '#ffffff' },
    create: { key: 'footerBtnText', value: '#ffffff' }
  });
  console.log('Footer updated to white with theme color accents!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
