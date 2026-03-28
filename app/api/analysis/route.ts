import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Placeholder — analysis endpoints will be added here.
 * Each analysis task maps to a function in lib/services/analysis/.
 */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ message: "Analysis endpoint — coming soon" });
}
