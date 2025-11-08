"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GirisPage() {
  const router = useRouter();
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", sifre: "" }
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setHata(null);
    setYukleniyor(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mesaj || "Giriş başarısız");
      }
      router.push("/panel");
    } catch (error: any) {
      setHata(error.message);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <img src="/logo-placeholder.svg" alt="Logo" className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Hesabınıza Giriş Yapın</h1>
          <p className="text-sm text-slate-500">Sanatçı ve label kontrol paneline erişmek için bilgilerinizi girin.</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">E-posta</label>
            <input
              type="email"
              {...form.register("email")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-rose-600">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Şifre</label>
            <input
              type="password"
              {...form.register("sifre")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {form.formState.errors.sifre && (
              <p className="mt-1 text-sm text-rose-600">{form.formState.errors.sifre.message}</p>
            )}
          </div>
          {hata && <p className="text-sm text-rose-600">{hata}</p>}
          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {yukleniyor ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/sifre-sifirla" className="text-sm text-primary">
            Şifremi Unuttum
          </a>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          Hesabınız yok mu? <a href="/kayit" className="font-semibold text-primary">Hemen kayıt olun</a>
        </p>
      </div>
    </main>
  );
}
