import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default function PanelYonlendirme() {
  const session = getSession();
  if (!session) {
    redirect("/giris");
  }

  redirect("/panel/sarkilar");
}
