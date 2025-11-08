"use client";

import clsx from "clsx";

export function StatusBadge({ durum }: { durum: "INCELEMEDE" | "ONAYLANDI" | "REDDEDILDI" }) {
  const labelMap = {
    INCELEMEDE: "İncelemede",
    ONAYLANDI: "Onaylandı",
    REDDEDILDI: "Reddedildi"
  } as const;

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        durum === "INCELEMEDE" && "bg-yellow-100 text-yellow-800",
        durum === "ONAYLANDI" && "bg-emerald-100 text-emerald-700",
        durum === "REDDEDILDI" && "bg-rose-100 text-rose-700"
      )}
    >
      {labelMap[durum]}
    </span>
  );
}
