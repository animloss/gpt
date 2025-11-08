import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { trackStatusSchema } from "@/lib/validators";
import { sendEmail } from "@/lib/mail";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  const track = await prisma.track.findUnique({
    where: { id: params.id },
    include: { user: { select: { ad: true, soyad: true, email: true, rol: true } } }
  });

  if (!track) {
    return NextResponse.json({ mesaj: "Kayıt bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ track });
}

export async function PUT(request: Request, { params }: Params) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = trackStatusSchema.parse(body);

    const track = await prisma.track.findUnique({ where: { id: params.id }, include: { user: true } });
    if (!track) {
      return NextResponse.json({ mesaj: "Kayıt bulunamadı" }, { status: 404 });
    }

    if (parsed.durum === "REDDEDILDI" && !parsed.retSebebi) {
      return NextResponse.json({ mesaj: "Ret sebebi zorunludur" }, { status: 400 });
    }

    const updated = await prisma.track.update({
      where: { id: params.id },
      data: {
        durum: parsed.durum,
        retSebebi: parsed.durum === "REDDEDILDI" ? parsed.retSebebi ?? null : null
      }
    });

    if (parsed.durum === "REDDEDILDI") {
      await sendEmail({
        to: track.user.email,
        subject: `Şarkı reddedildi: ${track.isim}`,
        template: "ret",
        variables: {
          AD: track.user.ad,
          SARKI: track.isim,
          SEBEP: parsed.retSebebi || "",
          LOGO: `${process.env.APP_URL || "http://localhost:3000"}/logo-placeholder.svg`
        },
        type: "retMaili"
      });

      await prisma.emailLog.create({
        data: {
          kime: track.user.email,
          konu: `Şarkı reddedildi: ${track.isim}`,
          icerikOzeti: parsed.retSebebi || "",
          tip: "retMaili"
        }
      });
    } else {
      await sendEmail({
        to: track.user.email,
        subject: `Şarkınız onaylandı: ${track.isim}`,
        template: "duyuru",
        variables: {
          BASLIK: "Şarkınız yayın için hazır!",
          ICERIK: `${track.isim} adlı şarkınız kontrol edildi ve onaylandı. Tebrikler!`,
          LOGO: `${process.env.APP_URL || "http://localhost:3000"}/logo-placeholder.svg`
        },
        type: "duyuruMaili"
      });

      await prisma.emailLog.create({
        data: {
          kime: track.user.email,
          konu: `Şarkınız onaylandı: ${track.isim}`,
          icerikOzeti: "Şarkı onaylandı",
          tip: "duyuruMaili"
        }
      });
    }

    return NextResponse.json({ mesaj: "Durum güncellendi", track: updated });
  } catch (error) {
    console.error("Durum güncelleme hatası", error);
    return NextResponse.json({ mesaj: "Güncelleme başarısız" }, { status: 400 });
  }
}
