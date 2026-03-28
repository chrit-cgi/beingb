/**
 * Database connection.
 * Swap point for SQLite → Postgres: change this file + DATABASE_URL only.
 * Nothing else in the codebase should import a DB driver directly.
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/db/schema";

const sqlite = new Database(process.env.DATABASE_URL?.replace("file:", "") ?? "./dev.db");

export const db = drizzle(sqlite, { schema });
export type DB = typeof db;
