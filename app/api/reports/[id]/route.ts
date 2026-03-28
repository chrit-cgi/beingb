import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { removeReport } from "@/lib/services/reports";
import { headers } from "next/headers";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await removeReport(id, session.user.id);
  return NextResponse.json({ ok: true });
}
