import { redirect } from "next/navigation";

// Root redirects to report (authenticated) or login
export default function Home() {
  redirect("/report");
}
