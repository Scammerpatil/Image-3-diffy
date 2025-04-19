import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";
import User from "@/models/User.model";

dbConfig();

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  if (!formData.email || !formData.password) {
    return NextResponse.json(
      { message: "Please fill all the fields" },
      { status: 400 }
    );
  }
  try {
    const user = await User.findOne({ email: formData.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const isValid = bcrypt.compareSync(formData.password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    const data = {
      id: user.id,
      name: user.name,
      profileImage:
        "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg",
      email: user.email,
    };
    const token = jwt.sign(data, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    const response = NextResponse.json({
      message: "Login successful",
      route: "/user/dashboard",
      token,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while creating account" },
      { status: 500 }
    );
  }
}
