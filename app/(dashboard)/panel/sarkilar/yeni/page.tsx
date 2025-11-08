"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackSchema } from "@/lib/validators";
import { z } from "zod";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useCurrentUser } from "@/hooks/use-current-user";

interface TrackForm extends z.infer<typeof trackSchema> {
  kapak: FileList;
  audio: FileList;
}

export default function YeniSarkiPage() {
  const { data: userData } = useCurrentUser();
  const [hata, setHata] = useState<string | null>(null);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  const form = useForm<TrackForm>({
    resolver: zodResolver(trackSchema.extend({
      kapak: z.any(),
      audio: z.any()
    })),
    defaultValues: {
      isim: "",
      sanatciAdi: "",
      labelAdi: "",
      tur: "",
      cikisTarihi: "",
      isrc: "",
      telifSahibi: ""
    }
  });

  const dosyaYukle = async (file: File, kategori: "kapak" | "audio") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kategori", kategori);

    const res = await fetch("/api/uploads", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.mesaj || "Dosya yüklenemedi");
    }

    const data = await res.json();
    return data.dosyaYolu as string;
  };

  const onSubmit = async (values: TrackForm) => {
    setHata(null);
    setMesaj(null);
    setYukleniyor(true);
    try {
      if (!values.audio?.[0] || !values.kapak?.[0]) {
        throw new Error("Ses dosyası ve kapak görseli zorunludur");
      }

      const audioPath = await dosyaYukle(values.audio[0], "audio");
      const kapakPath = await dosyaYukle(values.kapak[0], "kapak");

      const payload = {
        isim: values.isim,
        sanatciAdi: values.sanatciAdi,
        labelAdi: values.labelAdi,
        tur: values.tur,
        cikisTarihi: values.cikisTarihi,
        isrc: values.isrc,
        telifSahibi: values.telifSahibi,
        audioDosyaYolu: audioPath,
        kapakGorseliYolu: kapakPath
      };

      const res = await fetch("/api/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mesaj || "Şarkı gönderilemedi");
      }

      form.reset();
      setMesaj("Şarkınız başarıyla gönderildi. Onay sürecini Şarkılarım sayfasından takip edebilirsiniz.");
    } catch (error: any) {
      setHata(error.message);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        baslik="Yeni Şarkı Yükle"
        aciklama="Tüm zorunlu meta bilgileri doldurarak şarkınızı incelemeye gönderin."
        adSoyad={userData?.user ? `${userData.user.ad} ${userData.user.soyad}` : undefined}
      />
      <main className="flex-1 bg-slate-100 p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Şarkı Adı</label>
              <input
                type="text"
                {...form.register("isim")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {form.formState.errors.isim && <p className="mt-1 text-sm text-rose-600">{form.formState.errors.isim.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Sanatçı Adı</label>
              <input
                type="text"
                {...form.register("sanatciAdi")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {form.formState.errors.sanatciAdi && (
                <p className="mt-1 text-sm text-rose-600">{form.formState.errors.sanatciAdi.message as string}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Label Adı</label>
              <input
                type="text"
                {...form.register("labelAdi")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Tür</label>
              <input
                type="text"
                {...form.register("tur")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {form.formState.errors.tur && <p className="mt-1 text-sm text-rose-600">{form.formState.errors.tur.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Çıkış Tarihi</label>
              <input
                type="date"
                {...form.register("cikisTarihi")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {form.formState.errors.cikisTarihi && (
                <p className="mt-1 text-sm text-rose-600">{form.formState.errors.cikisTarihi.message as string}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">ISRC</label>
              <input
                type="text"
                {...form.register("isrc")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {form.formState.errors.isrc && <p className="mt-1 text-sm text-rose-600">{form.formState.errors.isrc.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Telif Sahibi</label>
              <input
                type="text"
                {...form.register("telifSahibi")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {form.formState.errors.telifSahibi && (
                <p className="mt-1 text-sm text-rose-600">{form.formState.errors.telifSahibi.message as string}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Kapak Görseli (PNG/JPG/WEBP)</label>
              <input type="file" accept="image/*" {...form.register("kapak")} className="mt-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Ses Dosyası (MP3/WAV)</label>
              <input type="file" accept="audio/mpeg,audio/wav" {...form.register("audio")} className="mt-1 w-full" />
            </div>
          </div>

          {hata && <p className="text-sm text-rose-600">{hata}</p>}
          {mesaj && <p className="text-sm text-emerald-600">{mesaj}</p>}

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {yukleniyor ? "Gönderiliyor..." : "İncelemeye Gönder"}
          </button>
        </form>
      </main>
    </div>
  );
}
