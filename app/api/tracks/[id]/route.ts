import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ mesaj: "Yetkisiz" }, { status: 401 });
  }

  const track = await prisma.track.findFirst({
    where: { id: params.id, userId: session.userId }
  });

  if (!track) {
    return NextResponse.json({ mesaj: "Kayıt bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ track });
}
