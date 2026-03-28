import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import * as schema from "./schema";

const sqlite = new Database("./dev.db");
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log("Seeding database...");

  const existing = await db.query.users.findFirst({
    where: eq(schema.users.email, "lucy@lucy.eu"),
  });

  if (existing) {
    console.log("Seed user lucy@lucy.eu already exists, skipping.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("changeme123", 12);
  await db.insert(schema.users).values({
    id: randomUUID(),
    email: "lucy@lucy.eu",
    name: "Lucy",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Seed complete. User: lucy@lucy.eu / changeme123 (role: admin)");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
