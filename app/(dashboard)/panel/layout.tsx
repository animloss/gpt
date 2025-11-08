import { ReactNode } from "react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = getSession();
  if (!session) {
    redirect("/giris");
  }

  if (session.role === "admin") {
    redirect("/admin/sarkilar");
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <DashboardSidebar role={session.role} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
