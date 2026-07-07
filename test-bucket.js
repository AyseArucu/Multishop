const { Client } = require('pg');

async function createBucket() {
  const client = new Client({
    connectionString: "postgresql://postgres:I1s2g3a4d5.@db.bjpisvmcjtgjylvbmdin.supabase.co:5432/postgres",
  });
  try {
    await client.connect();
    console.log("Connected to DB.");

    // Create bucket if not exists
    await client.query(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('uploads', 'uploads', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    console.log("Bucket created.");

    // Create policy for public access
    await client.query(`
      CREATE POLICY "Public Access"
      ON storage.objects FOR ALL
      USING ( bucket_id = 'uploads' );
    `);
    console.log("Policy created.");

    await client.end();
  } catch (err) {
    console.error("FAIL:", err.message);
    await client.end();
  }
}

createBucket();
