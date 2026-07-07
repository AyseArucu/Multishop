const fs = require('fs');

// Revert schema.prisma
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
schema = schema.replace(/provider = "sqlite"\n  url      = "file:\.\/dev\.db"/g, 'provider = "postgresql"');
schema = schema.replace(/images Json/g, 'images String[]');
schema = schema.replace(/colors Json @default\("\[\]"\)/g, 'colors String[] @default([])');
schema = schema.replace(/sizes Json @default\("\[\]"\)/g, 'sizes String[] @default([])');

// We need to put @db.Text back.
// It's tricky to restore exactly, so let's just pull the original schema from transcript if needed, 
// or I can just run git checkout if it was in git? No, it's not a git repo.
// Actually, missing @db.Text is mostly harmless for Prisma Postgres (it will just use Text). Let's restore what we can.
// Let's just leave @db.Text out for now, Postgres handles String as text anyway.

fs.writeFileSync('prisma/schema.prisma', schema);

// Revert prisma.ts
const prismaTs = `import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
`;
fs.writeFileSync('src/lib/prisma.ts', prismaTs);

// Revert .env
const envStr = `# Environment variables declared in this file are NOT automatically loaded by Prisma.
# Please add \`import "dotenv/config";\` to your \`prisma.config.ts\` file, or use the Prisma CLI with Bun
# to load environment variables from .env files: https://pris.ly/prisma-config-env-vars.

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# The following \`prisma+postgres\` URL is similar to the URL produced by running a local Prisma Postgres
# server with the \`prisma dev\` CLI command, when not choosing any non-default ports or settings. The API key, unlike the
# one found in a remote Prisma Postgres URL, does not contain any sensitive information.

DATABASE_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable&connection_limit=10&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0"
`;
fs.writeFileSync('.env', envStr);
