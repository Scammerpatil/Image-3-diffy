import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("file") as File;
    if (!image) {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await image.arrayBuffer());
    const filePath = "python/uploads/sketch.png";
    fs.writeFileSync(filePath, buffer);
    const outputFilePath = "public/generated_image.png";
    const { stdout, stderr } = await execAsync(
      `py -3.12 python/generate_image.py "${filePath}"`
    );
    console.log(`py -3.12 python/generate_image.py "${filePath}"`);
    console.log("Python script output:", stdout);
    const generatedImagePath = stdout.trim().split("\n").pop();
    fs.copyFileSync(generatedImagePath!, outputFilePath);
    return NextResponse.json(
      {
        message: "Image generated successfully!",
        imagePath: "/generated_image.png",
      },
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
