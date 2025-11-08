import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { announcementSchema } from "@/lib/validators";
import { sendEmail } from "@/lib/mail";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ announcements });
}

export async function POST(request: Request) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = announcementSchema.parse(body);

    const announcement = await prisma.announcement.create({
      data: {
        baslik: parsed.baslik,
        icerik: parsed.icerik,
        hedefRol: parsed.hedefRol,
        createdById: session.userId
      }
    });

    let whereClause: any = {};
    if (parsed.hedefRol === "SANATCI") {
      whereClause = { rol: "sanatci" };
    } else if (parsed.hedefRol === "LABEL") {
      whereClause = { rol: "label" };
    }

    const users = await prisma.user.findMany({ where: whereClause });

    const logo = `${process.env.APP_URL || "http://localhost:3000"}/logo-placeholder.svg`;

    await Promise.all(
      users.map(async (user) => {
        await sendEmail({
          to: user.email,
          subject: parsed.baslik,
          template: "duyuru",
          variables: {
            BASLIK: parsed.baslik,
            ICERIK: parsed.icerik,
            LOGO: logo
          },
          type: "duyuruMaili"
        });

        await prisma.emailLog.create({
          data: {
            kime: user.email,
            konu: parsed.baslik,
            icerikOzeti: parsed.icerik.slice(0, 120),
            tip: "duyuruMaili"
          }
        });
      })
    );

    return NextResponse.json({ mesaj: "Duyuru oluşturuldu", announcement });
  } catch (error) {
    console.error("Duyuru hatası", error);
    return NextResponse.json({ mesaj: "Duyuru oluşturulamadı" }, { status: 400 });
  }
}
