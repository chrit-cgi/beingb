/**
 * Database connection.
 * Swap point for SQLite → Postgres: change this file + DATABASE_URL only.
 * Nothing else in the codebase should import a DB driver directly.
 *
 * Lazy singleton — connection is created on first use, not at import time.
 * This prevents build-time failures when the database directory doesn't exist.
 */
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type * as schema from "@/db/schema";

type DB = BetterSQLite3Database<typeof schema>;

let _db: DB | null = null;
let _sqlite: any = null;

export function getDb(): DB {
  if (!_db) {
    const Database = require("better-sqlite3");
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    const s = require("@/db/schema");
    const dbPath = process.env.DATABASE_URL?.replace("file:", "") ?? "./dev.db";
    _sqlite = new Database(dbPath);
    _db = drizzle(_sqlite, { schema: s });
  }
  return _db!;
}

export function getSqlite() {
  if (!_sqlite) getDb();
  return _sqlite;
}

// Convenience proxy so existing `db.query.*` calls keep working
export const db = new Proxy({} as DB, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
