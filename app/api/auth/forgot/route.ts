import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validators";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) {
      return NextResponse.json({ mesaj: "E-posta gönderildi" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    const resetLink = `${process.env.APP_URL || "http://localhost:3000"}/sifre-sifirla?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
      port: Number(process.env.SMTP_PORT || 2525),
      auth: {
        user: process.env.SMTP_USER || "demo",
        pass: process.env.SMTP_PASS || "demo"
      }
    });

    await transporter.sendMail({
      from: "Müzik Distribütörü <no-reply@muzik.local>",
      to: user.email,
      subject: "Şifre Sıfırlama Talebi",
      html: `<p>Merhaba ${user.ad},</p><p>Şifrenizi sıfırlamak için aşağıdaki bağlantıyı kullanın:</p><p><a href="${resetLink}">Şifreyi Sıfırla</a></p>`
    });

    await prisma.emailLog.create({
      data: {
        kime: user.email,
        konu: "Şifre Sıfırlama Talebi",
        icerikOzeti: resetLink,
        tip: "sifreSifirla"
      }
    });

    return NextResponse.json({ mesaj: "E-posta gönderildi" });
  } catch (error) {
    console.error("Şifre sıfırlama hatası", error);
    return NextResponse.json({ mesaj: "İşlem başarısız" }, { status: 400 });
  }
}
