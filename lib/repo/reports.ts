import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { reports } from "@/db/schema";
import { randomUUID } from "crypto";

export async function getReportsByUser(userId: string) {
  return db
    .select()
    .from(reports)
    .where(eq(reports.userId, userId))
    .orderBy(desc(reports.date));
}

export async function getReportByDate(userId: string, date: string) {
  return db.query.reports.findFirst({
    where: (r, { and, eq }) => and(eq(r.userId, userId), eq(r.date, date)),
  });
}

export async function upsertReport(userId: string, date: string, content: string) {
  const existing = await getReportByDate(userId, date);
  const now = new Date();

  if (existing) {
    return db
      .update(reports)
      .set({ content, updatedAt: now })
      .where(eq(reports.id, existing.id))
      .returning();
  }

  return db
    .insert(reports)
    .values({ id: randomUUID(), userId, date, content, createdAt: now, updatedAt: now })
    .returning();
}

export async function deleteReport(id: string, _userId: string) {
  return db.delete(reports).where(eq(reports.id, id));
}
