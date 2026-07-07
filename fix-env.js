const fs = require('fs');
let content = fs.readFileSync('.env', 'utf8');
content = content.replace(/^DATABASE_URL=.*$/m, 'DATABASE_URL="file:./dev.db"');
fs.writeFileSync('.env', content);
