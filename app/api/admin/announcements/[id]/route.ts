import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  const announcement = await prisma.announcement.findUnique({ where: { id: params.id } });
  if (!announcement) {
    return NextResponse.json({ mesaj: "Kayıt bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ announcement });
}

export async function DELETE(request: Request, { params }: Params) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  await prisma.announcement.delete({ where: { id: params.id } });
  return NextResponse.json({ mesaj: "Duyuru silindi" });
}
