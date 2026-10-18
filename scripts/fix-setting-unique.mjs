import "dotenv/config";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
const db = createClient({ url, authToken });

async function run() {
  // Check current Setting schema
  const info = await db.execute(`PRAGMA table_info("Setting")`);
  console.log("Current Setting columns:", info.rows.map(r => r[1]));

  const indices = await db.execute(`PRAGMA index_list("Setting")`);
  console.log("Current indices:", indices.rows.map(r => [r[1], r[2]]));

  // Recreate Setting table without the old key unique constraint
  // New table: id TEXT PK, salonId TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Setting_new (
      id      TEXT PRIMARY KEY,
      salonId TEXT NOT NULL,
      key     TEXT NOT NULL,
      value   TEXT NOT NULL DEFAULT '',
      UNIQUE(salonId, key)
    )
  `);
  console.log("✓ Created Setting_new");

  // Copy data
  await db.execute(`
    INSERT OR IGNORE INTO Setting_new (id, salonId, key, value)
    SELECT
      COALESCE(id, lower(hex(randomblob(8)))),
      COALESCE(salonId, 'salon_pbr'),
      key,
      COALESCE(value, '')
    FROM Setting
  `);
  const count = await db.execute(`SELECT COUNT(*) as n FROM Setting_new`);
  console.log(`✓ Copied ${count.rows[0][0]} rows`);

  // Drop old, rename new
  await db.execute(`DROP TABLE Setting`);
  await db.execute(`ALTER TABLE Setting_new RENAME TO Setting`);
  console.log("✓ Setting table replaced");

  const newInfo = await db.execute(`PRAGMA table_info("Setting")`);
  console.log("New Setting columns:", newInfo.rows.map(r => r[1]));

  const newIdx = await db.execute(`PRAGMA index_list("Setting")`);
  console.log("New indices:", newIdx.rows.map(r => [r[1], r[2]]));
}

run().catch(console.error).finally(() => process.exit(0));
