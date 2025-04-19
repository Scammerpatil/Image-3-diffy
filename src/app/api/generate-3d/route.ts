import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const filePath = "python/uploads/image.jpg";
  const buffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));
  try {
    const { stdout, stderr } = await execAsync(
      `py -3.12 python/point_cloud.py ${filePath}`
    );

    if (stderr) {
      console.error("Python script error:", stderr);
    }

    console.log("Python script output:", stdout);
    return NextResponse.json({ message: "3D model generated successfully" });
  } catch (error) {
    console.error("Error executing Python script:", error);
    return NextResponse.json(
      { message: "Error executing Python script" },
      { status: 500 }
    );
  }
}
