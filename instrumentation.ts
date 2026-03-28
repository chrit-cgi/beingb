import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { db } = await import("@/lib/db");
  const { users } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const { randomUUID } = await import("crypto");
  const bcrypt = await import("bcryptjs");
  const path = await import("path");

  migrate(db, { migrationsFolder: path.join(process.cwd(), "db/migrations") });
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
  } else {
    console.log("[startup] Seed user already exists, skipping");
  }
}
