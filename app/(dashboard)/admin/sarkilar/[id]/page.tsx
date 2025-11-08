"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard-header";
import { LoadingState } from "@/components/loading-state";
import { StatusBadge } from "@/components/status-badge";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";

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
  user: {
    ad: string;
    soyad: string;
    email: string;
    rol: string;
  };
}

interface TrackResponse {
  track: Track;
}

export default function AdminTrackDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: userData } = useCurrentUser();
  const [modalAcik, setModalAcik] = useState(false);
  const [retSebebi, setRetSebebi] = useState("");
  const [hata, setHata] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<TrackResponse>({
    queryKey: ["admin-track", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/tracks/${params.id}`, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Şarkı bulunamadı");
      }
      return res.json();
    }
  });

  const durumMutasyon = useMutation({
    mutationFn: async (payload: { durum: "ONAYLANDI" | "REDDEDILDI"; retSebebi?: string }) => {
      const res = await fetch(`/api/admin/tracks/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mesaj || "Güncelleme başarısız");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-track", params.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-tracks"] });
      setModalAcik(false);
      setRetSebebi("");
    },
    onError: (error: any) => {
      setHata(error.message);
    }
  });

  const onayla = () => durumMutasyon.mutate({ durum: "ONAYLANDI" });
  const reddet = () => {
    if (retSebebi.trim().length < 10) {
      setHata("Ret sebebi en az 10 karakter olmalı");
      return;
    }
    durumMutasyon.mutate({ durum: "REDDEDILDI", retSebebi });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        baslik="Şarkı İnceleme"
        aciklama="Şarkıyı detaylı inceleyip kararınızı verin."
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
        {hata && <p className="text-sm text-rose-600">{hata}</p>}

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
                {data.track.retSebebi && <p className="text-sm text-rose-600">Ret sebebi: {data.track.retSebebi}</p>}
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-700">Gönderen</h3>
              <p className="text-sm text-slate-600">
                {data.track.user.ad} {data.track.user.soyad} - {data.track.user.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Ses Dosyası</p>
              <audio controls className="mt-2 w-full">
                <source src={data.track.audioDosyaYolu} />
                Tarayıcınız audio bileşenini desteklemiyor.
              </audio>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onayla}
                disabled={durumMutasyon.isLoading}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                Onayla
              </button>
              <button
                onClick={() => setModalAcik(true)}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
              >
                Reddet
              </button>
            </div>
          </div>
        )}

        {modalAcik && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
            <div className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-slate-900">Ret Sebebi</h3>
              <p className="text-sm text-slate-600">Ret sebebinizi detaylı yazın. En az 10 karakter olmalıdır.</p>
              <textarea
                value={retSebebi}
                onChange={(event) => setRetSebebi(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setModalAcik(false);
                    setRetSebebi("");
                    setHata(null);
                  }}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Vazgeç
                </button>
                <button
                  onClick={reddet}
                  disabled={durumMutasyon.isLoading}
                  className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600 disabled:opacity-50"
                >
                  Ret Gönder
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
