"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard-header";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

interface Track {
  id: string;
  isim: string;
  tur: string;
  durum: "INCELEMEDE" | "ONAYLANDI" | "REDDEDILDI";
  retSebebi?: string | null;
  createdAt: string;
}

interface TracksResponse {
  tracks: Track[];
}

export default function SarkilarimPage() {
  const { data: userData } = useCurrentUser();

  const { data, isLoading, error, refetch } = useQuery<TracksResponse>({
    queryKey: ["tracks"],
    queryFn: async () => {
      const res = await fetch("/api/tracks", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Şarkılar getirilemedi");
      }
      return res.json();
    }
  });

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        baslik="Şarkılarım"
        aciklama="Gönderdiğiniz şarkıların durumunu buradan takip edin."
        adSoyad={userData?.user ? `${userData.user.ad} ${userData.user.soyad}` : undefined}
      />
      <main className="flex-1 space-y-6 bg-slate-100 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Son Gönderimler</h2>
          <button
            onClick={() => refetch()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Yenile
          </button>
        </div>

        {isLoading && <LoadingState mesaj="Şarkılar yükleniyor..." />}
        {error && <p className="text-sm text-rose-600">{(error as Error).message}</p>}

        {data && data.tracks.length === 0 && <EmptyState mesaj="Henüz şarkı göndermediniz." />}

        {data && data.tracks.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Şarkı</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tür</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Detay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {data.tracks.map((track) => (
                  <tr key={track.id}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{track.isim}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{track.tur}</td>
                    <td className="px-6 py-4">
                      <StatusBadge durum={track.durum} />
                      {track.durum === "REDDEDILDI" && track.retSebebi && (
                        <p className="mt-2 text-xs text-rose-600">Ret sebebi: {track.retSebebi}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/panel/sarkilar/${track.id}`} className="text-primary">
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
