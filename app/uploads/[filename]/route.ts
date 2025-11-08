import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface Params {
  params: { filename: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const filePath = path.join(process.cwd(), "uploads", params.filename);
    const file = await fs.readFile(filePath);
    const extension = path.extname(params.filename).toLowerCase();

    const contentTypeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav"
    };

    const contentType = contentTypeMap[extension] || "application/octet-stream";
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (error) {
    return NextResponse.json({ mesaj: "Dosya bulunamadı" }, { status: 404 });
  }
}
