import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("./dev.db");
const db = drizzle(sqlite, { schema });

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: { enabled: true },
  baseURL: "http://localhost:3000",
});

async function seed() {
  console.log("Seeding database...");

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, "lucy@lucy.eu"),
  });

  if (existing) {
    console.log("Seed user lucy@lucy.eu already exists, skipping.");
    process.exit(0);
  }

  await auth.api.signUpEmail({
    body: {
      email: "lucy@lucy.eu",
      password: "changeme123",
      name: "Lucy",
    },
  });

  // Set admin role
  await db
    .update(schema.users)
    .set({ role: "admin" })
    .where(
      (await import("drizzle-orm")).eq(schema.users.email, "lucy@lucy.eu")
    );

  console.log("Seed complete. User: lucy@lucy.eu / changeme123 (role: admin)");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
