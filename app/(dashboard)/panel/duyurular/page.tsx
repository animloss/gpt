"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard-header";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Announcement {
  id: string;
  baslik: string;
  icerik: string;
  createdAt: string;
}

interface AnnouncementResponse {
  announcements: Announcement[];
}

export default function DuyurularPage() {
  const { data: userData } = useCurrentUser();

  const { data, isLoading, error } = useQuery<AnnouncementResponse>({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await fetch("/api/announcements", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Duyurular getirilemedi");
      }
      return res.json();
    }
  });

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        baslik="Duyurular"
        aciklama="Admin tarafından yayınlanan önemli haberler ve güncellemeler."
        adSoyad={userData?.user ? `${userData.user.ad} ${userData.user.soyad}` : undefined}
      />
      <main className="flex-1 space-y-6 bg-slate-100 p-8">
        {isLoading && <LoadingState mesaj="Duyurular yükleniyor..." />}
        {error && <p className="text-sm text-rose-600">{(error as Error).message}</p>}
        {data && data.announcements.length === 0 && <EmptyState mesaj="Yeni duyuru bulunmuyor." />}
        {data && data.announcements.length > 0 && (
          <div className="space-y-4">
            {data.announcements.map((announcement) => (
              <article key={announcement.id} className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{announcement.baslik}</h3>
                  <time className="text-xs text-slate-500">
                    {new Date(announcement.createdAt).toLocaleDateString("tr-TR")}
                  </time>
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
