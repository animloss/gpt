"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema } from "@/lib/validators";
import { z } from "zod";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useCurrentUser } from "@/hooks/use-current-user";

const hedefRoller = [
  { value: "TUMU", label: "Tüm Kullanıcılar" },
  { value: "SANATCI", label: "Sadece Sanatçılar" },
  { value: "LABEL", label: "Sadece Label'lar" }
];

export default function YeniDuyuruPage() {
  const { data: userData } = useCurrentUser();
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      baslik: "",
      icerik: "",
      hedefRol: "TUMU"
    }
  });

  const onSubmit = async (values: z.infer<typeof announcementSchema>) => {
    setMesaj(null);
    setHata(null);
    setYukleniyor(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mesaj || "Duyuru oluşturulamadı");
      }
      form.reset();
      setMesaj("Duyuru başarıyla yayınlandı ve hedef kullanıcılara e-posta gönderildi.");
    } catch (error: any) {
      setHata(error.message);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        baslik="Yeni Duyuru"
        aciklama="Hedef kitlenize özel bilgilendirmeler oluşturun."
        adSoyad={userData?.user ? `${userData.user.ad} ${userData.user.soyad}` : undefined}
      />
      <main className="flex-1 bg-slate-100 p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow">
          <div>
            <label className="block text-sm font-medium text-slate-700">Başlık</label>
            <input
              type="text"
              {...form.register("baslik")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {form.formState.errors.baslik && (
              <p className="mt-1 text-sm text-rose-600">{form.formState.errors.baslik.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">İçerik</label>
            <textarea
              rows={6}
              {...form.register("icerik")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {form.formState.errors.icerik && (
              <p className="mt-1 text-sm text-rose-600">{form.formState.errors.icerik.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Hedef Kitle</label>
            <select
              {...form.register("hedefRol")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {hedefRoller.map((rol) => (
                <option key={rol.value} value={rol.value}>
                  {rol.label}
                </option>
              ))}
            </select>
            {form.formState.errors.hedefRol && (
              <p className="mt-1 text-sm text-rose-600">{form.formState.errors.hedefRol.message}</p>
            )}
          </div>
          {hata && <p className="text-sm text-rose-600">{hata}</p>}
          {mesaj && <p className="text-sm text-emerald-600">{mesaj}</p>}
          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {yukleniyor ? "Yayınlanıyor..." : "Duyuruyu Yayınla"}
          </button>
        </form>
      </main>
    </div>
  );
}
