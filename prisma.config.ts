import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

const tursoUrl = process.env.TURSO_DATABASE_URL
const tursoToken = process.env.TURSO_AUTH_TOKEN
const localUrl = `file:${path.resolve(__dirname, "prisma/dev.db")}`

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: tursoUrl ? `${tursoUrl}?authToken=${tursoToken}` : localUrl,
  },
});
