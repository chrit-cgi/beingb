import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { db } = await import("@/lib/db");
  const { auth } = await import("@/lib/auth");
  const { users, accounts } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const path = await import("path");

  migrate(db, { migrationsFolder: path.join(process.cwd(), "db/migrations") });
  console.log("[startup] Migrations applied");

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, "lucy@lucy.eu"),
  });

  const existingAccount = existingUser
    ? await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id),
      })
    : null;

  // Seed if user missing, or if user exists but has no password account (broken seed)
  if (!existingUser || !existingAccount) {
    console.log("[startup] Seed user missing or incomplete — seeding now...");

    if (existingUser) {
      // Clean up broken record before re-seeding
      await db.delete(users).where(eq(users.email, "lucy@lucy.eu"));
      console.log("[startup] Removed incomplete user record");
    }

    await auth.api.signUpEmail({
      body: { email: "lucy@lucy.eu", password: "changeme123", name: "Lucy" },
    });
    await db
      .update(users)
      .set({ role: "admin", updatedAt: new Date() })
      .where(eq(users.email, "lucy@lucy.eu"));
    console.log("[startup] Seeded lucy@lucy.eu as admin");
  } else {
    console.log("[startup] Seed user already exists, skipping");
  }
}
