import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.parse(body);

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token: parsed.token } });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ mesaj: "Token geçersiz veya süresi dolmuş" }, { status: 400 });
    }

    const sifreHash = await hashPassword(parsed.yeniSifre);

    await prisma.user.update({ where: { id: resetToken.userId }, data: { sifreHash } });
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return NextResponse.json({ mesaj: "Şifre güncellendi" });
  } catch (error) {
    console.error("Şifre güncelleme hatası", error);
    return NextResponse.json({ mesaj: "İşlem başarısız" }, { status: 400 });
  }
}
