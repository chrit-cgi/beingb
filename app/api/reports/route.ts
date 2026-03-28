import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveReport, getReports } from "@/lib/services/reports";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reports = await getReports(session.user.id);
  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, content } = await req.json();
  if (!date || !content) {
    return NextResponse.json({ error: "date and content required" }, { status: 400 });
  }

  const report = await saveReport(session.user.id, date, content);
  return NextResponse.json(report);
}
