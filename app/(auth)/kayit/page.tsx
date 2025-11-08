"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validators";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const roller = [
  { value: "sanatci", label: "Sanatçı" },
  { value: "label", label: "Label" },
  { value: "admin", label: "Admin" }
];

export default function KayitPage() {
  const router = useRouter();
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      ad: "",
      soyad: "",
      email: "",
      sifre: "",
      rol: "sanatci",
      labelAdi: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setHata(null);
    setYukleniyor(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mesaj || "Kayıt başarısız");
      }
      router.push("/panel");
    } catch (error: any) {
      setHata(error.message);
    } finally {
      setYukleniyor(false);
    }
  };

  const seciliRol = form.watch("rol");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <img src="/logo-placeholder.svg" alt="Logo" className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Yeni Hesap Oluşturun</h1>
          <p className="text-sm text-slate-500">Sanatçı, label veya admin olarak profesyonel paneli kullanmaya başlayın.</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Ad</label>
            <input
              type="text"
              {...form.register("ad")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {form.formState.errors.ad && (
              <p className="mt-1 text-sm text-rose-600">{form.formState.errors.ad.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Soyad</label>
            <input
              type="text"
              {...form.register("soyad")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {form.formState.errors.soyad && (
              <p className="mt-1 text-sm text-rose-600">{form.formState.errors.soyad.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">E-posta</label>
            <input
              type="email"
              {...form.register("email")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {form.formState.errors.sifre && (
              <p className="mt-1 text-sm text-rose-600">{form.formState.errors.sifre.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Rol</label>
            <select
              {...form.register("rol")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {roller.map((rol) => (
                <option key={rol.value} value={rol.value}>
                  {rol.label}
                </option>
              ))}
            </select>
            {form.formState.errors.rol && (
              <p className="mt-1 text-sm text-rose-600">{form.formState.errors.rol.message}</p>
            )}
          </div>
          {seciliRol === "label" && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Label Adı</label>
              <input
                type="text"
                {...form.register("labelAdi")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {form.formState.errors.labelAdi && (
                <p className="mt-1 text-sm text-rose-600">{form.formState.errors.labelAdi.message}</p>
              )}
            </div>
          )}
          {hata && <p className="text-sm text-rose-600 md:col-span-2">{hata}</p>}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={yukleniyor}
              className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {yukleniyor ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Zaten hesabınız var mı? <a href="/giris" className="font-semibold text-primary">Giriş yapın</a>
        </p>
      </div>
    </main>
  );
}
