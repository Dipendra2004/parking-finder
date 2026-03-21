import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { name, email, password: hashed },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}