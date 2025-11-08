import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  const tracks = await prisma.track.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { ad: true, soyad: true, email: true, rol: true } } }
  });

  return NextResponse.json({ tracks });
}
