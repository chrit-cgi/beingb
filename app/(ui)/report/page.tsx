import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getReportForDate } from "@/lib/services/reports";
import ReportEditor from "@/app/(ui)/components/report/Editor";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default async function ReportPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const today = todayISO();
  const existing = session ? await getReportForDate(session.user.id, today) : null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 bg-black text-white px-3 py-2 rounded-lg">
        Today — {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
      </h2>
      <ReportEditor date={today} initialContent={existing?.content ?? ""} />
    </div>
  );
}
