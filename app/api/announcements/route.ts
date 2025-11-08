import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  let hedefler = ["TUMU"];
  if (session.role === "sanatci") {
    hedefler.push("SANATCI");
  }
  if (session.role === "label") {
    hedefler.push("LABEL");
  }

  const announcements = await prisma.announcement.findMany({
    where: { hedefRol: { in: hedefler } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ announcements });
}
