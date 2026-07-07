const { Client } = require('pg');

async function migrateData() {
  const localClient = new Client({
    connectionString: "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable",
  });
  
  const remoteClient = new Client({
    connectionString: "postgresql://postgres:I1s2g3a4d5.@db.bjpisvmcjtgjylvbmdin.supabase.co:5432/postgres",
  });

  try {
    await localClient.connect();
    await remoteClient.connect();
    console.log("Connected to both databases.");

    // Disable triggers (foreign key checks) on remote DB
    await remoteClient.query("SET session_replication_role = 'replica';");

    const tablesRes = await localClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name NOT LIKE '\\_%'
    `);
    
    for (const row of tablesRes.rows) {
      const tableName = row.table_name;
      console.log(`Migrating table: ${tableName}`);
      
      const dataRes = await localClient.query(`SELECT * FROM "${tableName}"`);
      const rows = dataRes.rows;
      
      if (rows.length === 0) {
        console.log(`  Skipped (0 rows)`);
        continue;
      }

      const columns = Object.keys(rows[0]);
      
      // Clear remote table first
      await remoteClient.query(`TRUNCATE TABLE "${tableName}" CASCADE`);
      
      for (const record of rows) {
        const values = columns.map(c => record[c]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO "${tableName}" ("${columns.join('", "')}") VALUES (${placeholders})`;
        await remoteClient.query(query, values);
      }
      console.log(`  Migrated ${rows.length} rows`);
    }

    // Re-enable triggers
    await remoteClient.query("SET session_replication_role = 'origin';");
    console.log("Migration completed successfully.");

    await localClient.end();
    await remoteClient.end();
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

migrateData();
