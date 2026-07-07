const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: "postgresql://postgres:I1s2g3a4d5.@db.bjpisvmcjtgjylvbmdin.supabase.co:5432/postgres",
  });
  try {
    await client.connect();
    console.log("SUCCESS!");
    await client.end();
  } catch (err) {
    console.error("FAIL:", err.message);
  }
}

testConnection();
