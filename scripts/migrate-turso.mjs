import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
  process.exit(1);
}

const client = createClient({ url, authToken });

const migrationSql = readFileSync(
  resolve(__dirname, '../prisma/migrations/20260616172350_init/migration.sql'),
  'utf-8'
);

// Remove comment lines, then split on ; at end of statements
const cleaned = migrationSql
  .split('\n')
  .filter(line => !line.trimStart().startsWith('--'))
  .join('\n');

const statements = cleaned
  .split(/;\s*\n/)
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`Applying ${statements.length} statements to Turso...`);

for (const stmt of statements) {
  try {
    await client.execute(stmt);
    console.log('OK:', stmt.slice(0, 60).replace(/\n/g, ' '));
  } catch (err) {
    if (err.message?.includes('already exists')) {
      console.log('SKIP (already exists):', stmt.slice(0, 60).replace(/\n/g, ' '));
    } else {
      console.error('FAIL:', stmt.slice(0, 80));
      console.error(err.message);
      process.exit(1);
    }
  }
}

console.log('\nMigration complete.');
