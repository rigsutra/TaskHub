import { createUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return new NextResponse("All fields are required", { status: 400 });
    }
    const user = await createUser(username, email, password);
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}
