import { deleteToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return new NextResponse("Token is required", { status: 400 });
    }
    await deleteToken(token);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}
