import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { getDb, getSqlite } = await import("@/lib/db");
  const { users } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const { randomUUID } = await import("crypto");
  const bcrypt = await import("bcryptjs");
  const path = await import("path");

  const db = getDb();
  const sqlite = getSqlite();
  const migrationsFolder = path.join(process.cwd(), "db/migrations");

  // If the old better-auth schema exists (has 'verifications' table),
  // drop all tables so migrations can run cleanly on a fresh schema.
  try {
    const tables = sqlite.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='verifications'"
    ).all() as { name: string }[];

    if (tables.length > 0) {
      console.log("[startup] Detected old schema — dropping tables for clean migration");
      sqlite.pragma("foreign_keys = OFF");
      const allTables = sqlite.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      ).all() as { name: string }[];
      for (const { name } of allTables) {
        sqlite.prepare(`DROP TABLE IF EXISTS "${name}"`).run();
      }
      sqlite.pragma("foreign_keys = ON");
      console.log("[startup] Old tables dropped");
    }
  } catch (e) {
    console.warn("[startup] Schema check failed, continuing:", e);
  }

  migrate(db, { migrationsFolder });
  console.log("[startup] Migrations applied");

  const existing = await db.query.users.findFirst({
    where: eq(users.email, "lucy@lucy.eu"),
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash("changeme123", 12);
    await db.insert(users).values({
      id: randomUUID(),
      email: "lucy@lucy.eu",
      name: "Lucy",
      password: hashedPassword,
      role: "admin",
    });
    console.log("[startup] Seeded lucy@lucy.eu as admin");
  } else if (!existing.password) {
    const hashedPassword = await bcrypt.hash("changeme123", 12);
    await db.update(users).set({ password: hashedPassword }).where(eq(users.email, "lucy@lucy.eu"));
    console.log("[startup] Repaired missing password for lucy@lucy.eu");
  } else {
    console.log("[startup] Seed user already exists, skipping");
  }
}
