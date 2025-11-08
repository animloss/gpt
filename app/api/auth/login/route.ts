import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createToken, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) {
      return NextResponse.json({ mesaj: "Kullanıcı bulunamadı" }, { status: 401 });
    }

    const valid = await comparePassword(parsed.sifre, user.sifreHash);
    if (!valid) {
      return NextResponse.json({ mesaj: "Şifre hatalı" }, { status: 401 });
    }

    const token = createToken({ userId: user.id, role: user.rol, email: user.email });
    setSessionCookie(token);

    return NextResponse.json({ mesaj: "Giriş başarılı", user: { id: user.id, rol: user.rol, ad: user.ad } });
  } catch (error) {
    console.error("Giriş hatası", error);
    return NextResponse.json({ mesaj: "Giriş başarısız" }, { status: 400 });
  }
}
