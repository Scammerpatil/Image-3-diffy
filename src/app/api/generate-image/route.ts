import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

export async function POST(req: NextRequest) {
  try {
    const { imageData } = await req.json();
    if (!imageData) {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const imagePath = path.join(process.cwd(), "public", "image.png");
    fs.writeFileSync(imagePath, base64Data, "base64");

    return NextResponse.json(
      { message: "Image generated successfully!", imageData: `/image.png` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
