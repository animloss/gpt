import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ mesaj: "Oturum bulunamadı" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, ad: true, soyad: true, email: true, rol: true, labelAdi: true }
  });

  return NextResponse.json({ user });
}
