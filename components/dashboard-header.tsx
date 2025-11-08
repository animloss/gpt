"use client";

import { useRouter } from "next/navigation";

export function DashboardHeader({
  baslik,
  aciklama,
  adSoyad
}: {
  baslik: string;
  aciklama?: string;
  adSoyad?: string;
}) {
  const router = useRouter();

  const cikisYap = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/giris");
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 py-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{baslik}</h1>
        {aciklama && <p className="text-sm text-slate-500">{aciklama}</p>}
      </div>
      <div className="flex items-center gap-6">
        {adSoyad && <span className="text-sm text-slate-600">{adSoyad}</span>}
        <button
          onClick={cikisYap}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Çıkış Yap
        </button>
      </div>
    </header>
  );
}
