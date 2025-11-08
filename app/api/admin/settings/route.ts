import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  const ayarlar = await prisma.setting.findMany();
  return NextResponse.json({
    ayarlar: ayarlar.reduce<Record<string, string>>((acc, item) => {
      acc[item.anahtar] = item.deger;
      return acc;
    }, {})
  });
}

export async function POST(request: Request) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ mesaj: "Geçersiz gövde" }, { status: 400 });
    }

    const entries = Object.entries(body as Record<string, unknown>);
    await Promise.all(
      entries.map(([anahtar, deger]) =>
        prisma.setting.upsert({
          where: { anahtar },
          create: { anahtar, deger: String(deger ?? "") },
          update: { deger: String(deger ?? "") }
        })
      )
    );

    return NextResponse.json({ mesaj: "Ayarlar güncellendi" });
  } catch (error) {
    console.error("Ayar güncelleme hatası", error);
    return NextResponse.json({ mesaj: "Ayarlar kaydedilemedi" }, { status: 400 });
  }
}
