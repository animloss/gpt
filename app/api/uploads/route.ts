import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kategori = formData.get("kategori");

    if (!(file instanceof File) || typeof kategori !== "string") {
      return NextResponse.json({ mesaj: "Dosya yüklenemedi" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_SIZE) {
      return NextResponse.json({ mesaj: "Dosya boyutu çok büyük" }, { status: 400 });
    }

    const extension = path.extname(file.name).toLowerCase();

    if (kategori === "audio") {
      if (![".mp3", ".wav"].includes(extension)) {
        return NextResponse.json({ mesaj: "Ses dosyası formatı desteklenmiyor" }, { status: 400 });
      }
    } else if (kategori === "kapak") {
      if (![".png", ".jpg", ".jpeg", ".webp"].includes(extension)) {
        return NextResponse.json({ mesaj: "Kapak görsel formatı desteklenmiyor" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ mesaj: "Kategori hatalı" }, { status: 400 });
    }

    const fileName = `${randomUUID()}${extension}`;
    const uploadDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    return NextResponse.json({ dosyaYolu: `/uploads/${fileName}` });
  } catch (error) {
    console.error("Dosya yükleme hatası", error);
    return NextResponse.json({ mesaj: "Dosya yükleme başarısız" }, { status: 500 });
  }
}
