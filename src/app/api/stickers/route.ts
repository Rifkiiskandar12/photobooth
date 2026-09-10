import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const stickersDirectory = path.join(process.cwd(), "public", "stickers");

    const filenames = fs.readdirSync(stickersDirectory);
    const images = filenames.filter((name) =>
      name.match(/\.(png|jpe?g|svg|gif|webp)$/i)
    );
    const stickerPaths = images.map((name) => `/stickers/${name}`);

    return NextResponse.json({ stickers: stickerPaths });
  } catch (error) {
    console.error("Error reading stickers directory", error);
    return NextResponse.json({ stickers: [] }, { status: 200 });
  }
}
