"use client";

import { useQuery } from "@tanstack/react-query";

interface CurrentUserResponse {
  user: {
    id: string;
    ad: string;
    soyad: string;
    email: string;
    rol: "admin" | "sanatci" | "label";
    labelAdi?: string | null;
  } | null;
}

export function useCurrentUser() {
  return useQuery<CurrentUserResponse>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Oturum bulunamadı");
      }
      return res.json();
    }
  });
}
