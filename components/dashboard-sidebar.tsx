"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface SidebarProps {
  role: "admin" | "sanatci" | "label";
}

const baseLinks = [
  { href: "/panel/sarkilar", label: "Şarkılarım" },
  { href: "/panel/sarkilar/yeni", label: "Yeni Şarkı" },
  { href: "/panel/duyurular", label: "Duyurular" }
];

const adminLinks = [
  { href: "/admin/sarkilar", label: "Tüm Şarkılar" },
  { href: "/admin/duyurular", label: "Duyurular" },
  { href: "/admin/duyurular/yeni", label: "Yeni Duyuru" },
  { href: "/admin/ayarlar", label: "Ayarlar" }
];

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "admin" ? adminLinks : baseLinks;

  return (
    <aside className="w-full max-w-xs border-r border-slate-200 bg-white p-6">
      <div className="mb-8 flex items-center gap-3">
        <img src="/logo-placeholder.svg" alt="Logo" className="h-12 w-12" />
        <div>
          <p className="text-sm text-slate-500">Müzik Distribütörü</p>
          <p className="text-lg font-semibold text-slate-800">Kontrol Paneli</p>
        </div>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "block rounded-lg px-4 py-2 text-sm font-medium transition",
              pathname.startsWith(link.href)
                ? "bg-primary text-white shadow"
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
