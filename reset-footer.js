const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.setting.deleteMany({
    where: {
      key: {
        in: ['footerBgColor', 'footerTitleColor', 'footerTextColor', 'footerBtnBg', 'footerBtnText']
      }
    }
  });
  console.log('Footer reset to defaults');
}

main().catch(console.error).finally(() => prisma.$disconnect());
