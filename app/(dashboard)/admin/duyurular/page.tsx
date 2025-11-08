"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard-header";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

interface Announcement {
  id: string;
  baslik: string;
  icerik: string;
  hedefRol: string;
  createdAt: string;
}

interface AnnouncementResponse {
  announcements: Announcement[];
}

export default function AdminAnnouncementsPage() {
  const { data: userData } = useCurrentUser();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<AnnouncementResponse>({
    queryKey: ["admin-announcements"],
    queryFn: async () => {
      const res = await fetch("/api/admin/announcements", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Duyurular getirilemedi");
      }
      return res.json();
    }
  });

  const silMutasyonu = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mesaj || "Silme başarısız");
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-announcements"] })
  });

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        baslik="Duyuru Yönetimi"
        aciklama="Yeni duyurular oluşturun, mevcutları yönetin."
        adSoyad={userData?.user ? `${userData.user.ad} ${userData.user.soyad}` : undefined}
      />
      <main className="flex-1 space-y-6 bg-slate-100 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Tüm Duyurular</h2>
          <Link
            href="/admin/duyurular/yeni"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Yeni Duyuru
          </Link>
        </div>

        {isLoading && <LoadingState mesaj="Duyurular yükleniyor..." />}
        {error && <p className="text-sm text-rose-600">{(error as Error).message}</p>}
        {data && data.announcements.length === 0 && <EmptyState mesaj="Henüz duyuru oluşturulmadı." />}

        {data && data.announcements.length > 0 && (
          <div className="space-y-4">
            {data.announcements.map((announcement) => (
              <article key={announcement.id} className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{announcement.baslik}</h3>
                    <p className="text-xs uppercase text-slate-500">Hedef: {announcement.hedefRol}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <time className="text-xs text-slate-500">
                      {new Date(announcement.createdAt).toLocaleDateString("tr-TR")}
                    </time>
                    <button
                      onClick={() => silMutasyonu.mutate(announcement.id)}
                      className="rounded-md border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{announcement.icerik}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
