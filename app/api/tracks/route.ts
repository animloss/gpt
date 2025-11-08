import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { trackSchema } from "@/lib/validators";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  const tracks = await prisma.track.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ tracks });
}

export async function POST(request: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = trackSchema.parse(body);

    if (!body.audioDosyaYolu || !body.kapakGorseliYolu) {
      return NextResponse.json({ mesaj: "Dosya yolları zorunludur" }, { status: 400 });
    }

    const track = await prisma.track.create({
      data: {
        isim: parsed.isim,
        sanatciAdi: parsed.sanatciAdi,
        labelAdi: parsed.labelAdi || null,
        tur: parsed.tur,
        cikisTarihi: new Date(parsed.cikisTarihi),
        isrc: parsed.isrc,
        telifSahibi: parsed.telifSahibi,
        audioDosyaYolu: body.audioDosyaYolu,
        kapakGorseliYolu: body.kapakGorseliYolu,
        userId: session.userId,
        durum: "INCELEMEDE"
      }
    });

    return NextResponse.json({ mesaj: "Şarkı gönderildi", track });
  } catch (error) {
    console.error("Şarkı kaydetme hatası", error);
    return NextResponse.json({ mesaj: "Şarkı kaydedilemedi" }, { status: 400 });
  }
}
