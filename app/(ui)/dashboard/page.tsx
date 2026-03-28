import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getReports } from "@/lib/services/reports";
import ViewText from "@/app/(ui)/components/report/ViewText";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const reports = session ? await getReports(session.user.id) : [];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">All reports</h2>
      <ViewText reports={reports} />
    </div>
  );
}
