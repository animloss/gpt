"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard-header";
import { LoadingState } from "@/components/loading-state";
import { StatusBadge } from "@/components/status-badge";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Track {
  id: string;
  isim: string;
  sanatciAdi: string;
  labelAdi?: string | null;
  tur: string;
  cikisTarihi: string;
  isrc: string;
  telifSahibi: string;
  durum: "INCELEMEDE" | "ONAYLANDI" | "REDDEDILDI";
  retSebebi?: string | null;
  audioDosyaYolu: string;
  kapakGorseliYolu: string;
}

interface TrackResponse {
  track: Track;
}

export default function SarkiDetayPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: userData } = useCurrentUser();

  const { data, isLoading, error } = useQuery<TrackResponse>({
    queryKey: ["track", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/tracks/${params.id}`, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Şarkı bulunamadı");
      }
      return res.json();
    }
  });

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        baslik="Şarkı Detayı"
        aciklama="Gönderdiğiniz şarkının içerik ve durum bilgileri."
        adSoyad={userData?.user ? `${userData.user.ad} ${userData.user.soyad}` : undefined}
      />
      <main className="flex-1 space-y-6 bg-slate-100 p-8">
        <button
          onClick={() => router.back()}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
        >
          ← Listeye Dön
        </button>

        {isLoading && <LoadingState mesaj="Şarkı bilgileri getiriliyor..." />}
        {error && <p className="text-sm text-rose-600">{(error as Error).message}</p>}

        {data && (
          <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow">
            <div className="flex flex-col gap-4 md:flex-row">
              <img
                src={data.track.kapakGorseliYolu || "/logo-placeholder.svg"}
                alt={data.track.isim}
                className="h-40 w-40 rounded-lg object-cover"
              />
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900">{data.track.isim}</h2>
                <p className="text-sm text-slate-600">Sanatçı: {data.track.sanatciAdi}</p>
                {data.track.labelAdi && <p className="text-sm text-slate-600">Label: {data.track.labelAdi}</p>}
                <p className="text-sm text-slate-600">Tür: {data.track.tur}</p>
                <p className="text-sm text-slate-600">Çıkış Tarihi: {new Date(data.track.cikisTarihi).toLocaleDateString("tr-TR")}</p>
                <p className="text-sm text-slate-600">ISRC: {data.track.isrc}</p>
                <p className="text-sm text-slate-600">Telif Sahibi: {data.track.telifSahibi}</p>
                <StatusBadge durum={data.track.durum} />
                {data.track.retSebebi && (
                  <p className="text-sm text-rose-600">Ret sebebi: {data.track.retSebebi}</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Ses Dosyası</p>
              <audio controls className="mt-2 w-full">
                <source src={data.track.audioDosyaYolu} />
                Tarayıcınız audio bileşenini desteklemiyor.
              </audio>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
