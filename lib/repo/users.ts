import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/db/schema";

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({ where: eq(users.email, email) });
}

export async function getUserById(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}

export async function listUsers() {
  return db.select().from(users);
}

export async function updateUserRole(id: string, role: "admin" | "user") {
  return db.update(users).set({ role }).where(eq(users.id, id));
}

export async function deleteUser(id: string) {
  return db.delete(users).where(eq(users.id, id));
}
