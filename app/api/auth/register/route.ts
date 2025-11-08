import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);

    if (parsed.rol === "label" && !parsed.labelAdi) {
      return NextResponse.json({ mesaj: "Label kullanıcıları için label adı zorunludur" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return NextResponse.json({ mesaj: "Bu e-posta ile kullanıcı mevcut" }, { status: 400 });
    }

    const sifreHash = await hashPassword(parsed.sifre);

    const user = await prisma.user.create({
      data: {
        ad: parsed.ad,
        soyad: parsed.soyad,
        email: parsed.email,
        sifreHash,
        rol: parsed.rol,
        labelAdi: parsed.labelAdi || null
      }
    });

    const token = createToken({ userId: user.id, role: user.rol, email: user.email });
    setSessionCookie(token);

    return NextResponse.json({ mesaj: "Kayıt başarılı", user: { id: user.id, rol: user.rol, ad: user.ad } });
  } catch (error) {
    console.error("Kayıt hatası", error);
    return NextResponse.json({ mesaj: "Kayıt sırasında hata oluştu" }, { status: 400 });
  }
}
