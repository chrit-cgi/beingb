import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export async function register() {
  // Only run on the Node.js server runtime, not in the Edge runtime
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { db } = await import("@/lib/db");
  const { auth } = await import("@/lib/auth");
  const { users } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const path = await import("path");

  // Run migrations on every startup — safe to run repeatedly
  migrate(db, { migrationsFolder: path.join(process.cwd(), "db/migrations") });
  console.log("[startup] Migrations applied");

  // Seed lucy@lucy.eu if no users exist
  const existing = await db.query.users.findFirst({
    where: eq(users.email, "lucy@lucy.eu"),
  });

  if (!existing) {
    await auth.api.signUpEmail({
      body: { email: "lucy@lucy.eu", password: "changeme123", name: "Lucy" },
    });
    await db
      .update(users)
      .set({ role: "admin", updatedAt: new Date() })
      .where(eq(users.email, "lucy@lucy.eu"));
    console.log("[startup] Seeded lucy@lucy.eu as admin");
  }
}
