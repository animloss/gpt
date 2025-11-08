"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard-header";
import { LoadingState } from "@/components/loading-state";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";

interface SettingsResponse {
  ayarlar: Record<string, string>;
}

export default function AyarlarPage() {
  const { data: userData } = useCurrentUser();
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({
    siteAdi: "Müzik Distribütörü",
    destekEposta: "destek@muzik.local",
    cikisBildirimMetni: "Çıkış yaptığınız için teşekkürler!"
  });

  const { isLoading } = useQuery<SettingsResponse>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Ayarlar getirilemedi");
      }
      const data = await res.json();
      setFormValues((prev) => ({ ...prev, ...data.ayarlar }));
      return data;
    }
  });

  const kaydetMutasyonu = useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mesaj || "Ayarlar kaydedilemedi");
      }
      return res.json();
    },
    onSuccess: () => {
      setMesaj("Ayarlar başarıyla güncellendi.");
      setHata(null);
    },
    onError: (error: any) => {
      setHata(error.message);
      setMesaj(null);
    }
  });

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    kaydetMutasyonu.mutate(formValues);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        baslik="Site Ayarları"
        aciklama="Marka metinleri, destek kanalları ve panel başlıklarını özelleştirin."
        adSoyad={userData?.user ? `${userData.user.ad} ${userData.user.soyad}` : undefined}
      />
      <main className="flex-1 bg-slate-100 p-8">
        {isLoading ? (
          <LoadingState mesaj="Ayarlar yükleniyor..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow">
            <div>
              <label className="block text-sm font-medium text-slate-700">Site Adı</label>
              <input
                value={formValues.siteAdi || ""}
                onChange={(event) => handleChange("siteAdi", event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Destek E-posta Adresi</label>
              <input
                value={formValues.destekEposta || ""}
                onChange={(event) => handleChange("destekEposta", event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Çıkış Bildirim Metni</label>
              <textarea
                rows={4}
                value={formValues.cikisBildirimMetni || ""}
                onChange={(event) => handleChange("cikisBildirimMetni", event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {hata && <p className="text-sm text-rose-600">{hata}</p>}
            {mesaj && <p className="text-sm text-emerald-600">{mesaj}</p>}
            <button
              type="submit"
              disabled={kaydetMutasyonu.isLoading}
              className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {kaydetMutasyonu.isLoading ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
