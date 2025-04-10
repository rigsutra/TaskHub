import { getUserByToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await getUserByToken(token);
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}
