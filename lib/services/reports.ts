/**
 * Report service — business logic layer.
 * API routes call these functions, never the repo directly.
 */
import * as repo from "@/lib/repo/reports";

export async function saveReport(userId: string, date: string, content: string) {
  if (!content.trim()) throw new Error("Report content cannot be empty");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Invalid date format");
  return repo.upsertReport(userId, date, content);
}

export async function getReports(userId: string) {
  return repo.getReportsByUser(userId);
}

export async function getReportForDate(userId: string, date: string) {
  return repo.getReportByDate(userId, date);
}

export async function removeReport(reportId: string, userId: string) {
  return repo.deleteReport(reportId, userId);
}
