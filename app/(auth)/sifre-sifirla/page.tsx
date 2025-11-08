"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validators";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function SifreSifirlaPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  const requestForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token || "", yeniSifre: "" }
  });

  const sifreTalepEt = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setHata(null);
    setMesaj(null);
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) {
      const data = await res.json();
      setHata(data.mesaj || "İşlem başarısız");
      return;
    }
    setMesaj("Eğer kayıtlı bir hesabınız varsa, sıfırlama bağlantısı e-posta adresinize gönderildi.");
  };

  const sifreGuncelle = async (values: z.infer<typeof resetPasswordSchema>) => {
    setHata(null);
    setMesaj(null);
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) {
      const data = await res.json();
      setHata(data.mesaj || "İşlem başarısız");
      return;
    }
    setMesaj("Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...");
    setTimeout(() => router.push("/giris"), 2000);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <img src="/logo-placeholder.svg" alt="Logo" className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Şifre Yardımı</h1>
          <p className="text-sm text-slate-500">
            {token
              ? "Yeni şifrenizi belirleyin ve güvenliğinizi artırın."
              : "E-postanızı girin, size şifre sıfırlama bağlantısı gönderelim."}
          </p>
        </div>

        {token ? (
          <form onSubmit={resetForm.handleSubmit(sifreGuncelle)} className="space-y-4">
            <input type="hidden" {...resetForm.register("token")} value={token} />
            <div>
              <label className="block text-sm font-medium text-slate-700">Yeni Şifre</label>
              <input
                type="password"
                {...resetForm.register("yeniSifre")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {resetForm.formState.errors.yeniSifre && (
                <p className="mt-1 text-sm text-rose-600">{resetForm.formState.errors.yeniSifre.message}</p>
              )}
            </div>
            {hata && <p className="text-sm text-rose-600">{hata}</p>}
            {mesaj && <p className="text-sm text-emerald-600">{mesaj}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-500"
            >
              Şifreyi Güncelle
            </button>
          </form>
        ) : (
          <form onSubmit={requestForm.handleSubmit(sifreTalepEt)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">E-posta</label>
              <input
                type="email"
                {...requestForm.register("email")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {requestForm.formState.errors.email && (
                <p className="mt-1 text-sm text-rose-600">{requestForm.formState.errors.email.message}</p>
              )}
            </div>
            {hata && <p className="text-sm text-rose-600">{hata}</p>}
            {mesaj && <p className="text-sm text-emerald-600">{mesaj}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-500"
            >
              Bağlantı Gönder
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
