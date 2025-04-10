import { findUserByEmail, comparePasswords, generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new NextResponse("All fields are required", { status: 400 });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    const token = await generateToken(user);
    return NextResponse.json({ token });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}
