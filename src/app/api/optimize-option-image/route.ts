import sharp from "sharp";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_WIDTH = 900;
const TARGET_MAX_BYTES = 200 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing image file" },
        { status: 400 }
      );
    }

    const sourceBuffer = Buffer.from(await file.arrayBuffer());
    let quality = 62;
    let optimized = Buffer.from([]);
    let outputInfo: { width?: number; height?: number } | undefined;

    while (quality >= 40) {
      const transformer = sharp(sourceBuffer)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality, effort: 4 });

      const result = await transformer.toBuffer({ resolveWithObject: true });
      optimized = Buffer.from(result.data);
      outputInfo = result.info;

      if (optimized.byteLength <= TARGET_MAX_BYTES) break;
      quality -= 6;
    }

    return new NextResponse(optimized, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": String(optimized.byteLength),
        "X-Image-Width": String(outputInfo?.width || 0),
        "X-Image-Height": String(outputInfo?.height || 0),
        "X-Image-Size": String(optimized.byteLength),
        "X-Image-MimeType": "image/webp",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to optimize image",
      },
      { status: 500 }
    );
  }
}
