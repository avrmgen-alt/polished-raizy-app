import "dotenv/config";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("TURSO_DATABASE_URL not set");
  process.exit(1);
}

const db = createClient({ url, authToken });

async function run() {
  // ── 1. Create Salon table ──────────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Salon (
      id                   TEXT PRIMARY KEY,
      name                 TEXT NOT NULL,
      slug                 TEXT UNIQUE NOT NULL,
      businessType         TEXT NOT NULL DEFAULT 'nail_salon',
      ownerEmail           TEXT UNIQUE NOT NULL,
      ownerPasswordHash    TEXT NOT NULL,
      stripeCustomerId     TEXT,
      stripeSubscriptionId TEXT,
      subscriptionStatus   TEXT NOT NULL DEFAULT 'active',
      trialEndsAt          DATETIME,
      createdAt            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✓ Salon table ready");

  // ── 2. Add salonId columns to existing tables (idempotent) ─────────────────
  const tables = ["Setting", "Service", "GalleryPhoto", "Booking", "ContactMessage", "FaqItem"];
  for (const table of tables) {
    try {
      await db.execute(`ALTER TABLE "${table}" ADD COLUMN salonId TEXT`);
      console.log(`✓ Added salonId to ${table}`);
    } catch (e) {
      if (e.message?.includes("duplicate column") || e.message?.includes("already exists")) {
        console.log(`  salonId already exists on ${table}, skipping`);
      } else {
        throw e;
      }
    }
  }

  // ── 3. Migrate Setting table: drop old PK, add id + composite unique ───────
  // SQLite can't drop/modify PK, so we migrate to a new table if needed
  const cols = await db.execute(`PRAGMA table_info("Setting")`);
  const hasId = cols.rows.some(r => r[1] === "id");
  if (!hasId) {
    console.log("Migrating Setting table to add id column...");
    await db.execute(`ALTER TABLE "Setting" ADD COLUMN id TEXT`);
    // We'll set id values in the backfill step
  }

  // ── 4. Insert seed Salon (polishedbyraizy) ─────────────────────────────────
  const existing = await db.execute(`SELECT id FROM Salon WHERE slug = 'polishedbyraizy'`);
  if (existing.rows.length === 0) {
    const hash = await bcrypt.hash("admin123", 12);
    await db.execute({
      sql: `INSERT INTO Salon (id, name, slug, businessType, ownerEmail, ownerPasswordHash, subscriptionStatus)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ["salon_pbr", "Polished by Raizy", "polishedbyraizy", "nail_salon", "raizy@polishedbyraizy.com", hash, "active"],
    });
    console.log("✓ Created polishedbyraizy salon (password: admin123, email: raizy@polishedbyraizy.com)");
  } else {
    console.log("  polishedbyraizy salon already exists, skipping");
  }

  // ── 5. Backfill salonId on all existing rows ───────────────────────────────
  for (const table of tables) {
    await db.execute({
      sql: `UPDATE "${table}" SET salonId = 'salon_pbr' WHERE salonId IS NULL`,
      args: [],
    });
  }
  console.log("✓ Backfilled salonId on all existing rows");

  // ── 6. For Setting: ensure id column is populated ─────────────────────────
  const settingsWithoutId = await db.execute(`SELECT key FROM Setting WHERE id IS NULL`);
  for (const row of settingsWithoutId.rows) {
    const id = "set_" + Math.random().toString(36).slice(2, 12);
    await db.execute({
      sql: `UPDATE Setting SET id = ? WHERE key = ? AND (salonId = 'salon_pbr' OR salonId IS NULL)`,
      args: [id, row[0]],
    });
  }
  if (settingsWithoutId.rows.length > 0) {
    console.log(`✓ Populated id for ${settingsWithoutId.rows.length} Setting rows`);
  }

  // ── 7. Verify ──────────────────────────────────────────────────────────────
  const salonCount = await db.execute(`SELECT COUNT(*) FROM Salon`);
  console.log(`\n✅ Migration complete. Salons: ${salonCount.rows[0][0]}`);

  for (const table of tables) {
    const count = await db.execute(`SELECT COUNT(*) FROM "${table}" WHERE salonId = 'salon_pbr'`);
    console.log(`   ${table}: ${count.rows[0][0]} rows for polishedbyraizy`);
  }
}

run().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
