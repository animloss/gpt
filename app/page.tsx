import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <img src="/logo-placeholder.svg" alt="Logo" className="h-20 w-20" />
      <h1 className="text-4xl font-bold">Müzik Distribütörü Platformu</h1>
      <p className="max-w-xl text-center text-lg text-slate-200">
        Dijital mağazalara hızlı dağıtım, detaylı telif raporları ve rol bazlı kontrol
        panelleriyle sanatçılar ve label&apos;lar için profesyonel çözümler.
      </p>
      <div className="flex gap-4">
        <Link
          href="/kayit"
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow hover:bg-blue-500"
        >
          Hemen Kayıt Ol
        </Link>
        <Link
          href="/giris"
          className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
        >
          Giriş Yap
        </Link>
      </div>
    </main>
  );
}
