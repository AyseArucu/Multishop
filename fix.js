const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');
content = content.replace(/provider = "postgresql"/g, 'provider = "sqlite"\n  url      = "file:./dev.db"');
content = content.replace(/@db\.Text/g, '');
content = content.replace(/images\s+String\[\]/g, 'images Json');
content = content.replace(/colors\s+String\[\]\s+@default\(\[\]\)/g, 'colors Json @default("[]")');
content = content.replace(/sizes\s+String\[\]\s+@default\(\[\]\)/g, 'sizes Json @default("[]")');
fs.writeFileSync('prisma/schema.prisma', content);
console.log('Schema updated successfully.');
