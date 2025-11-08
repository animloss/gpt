import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default function AdminAnaSayfa() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    redirect("/panel");
  }
  redirect("/admin/sarkilar");
}
