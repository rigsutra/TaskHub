import { getTaskById, joinTask } from "@/lib/tasks";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id;
    if (!taskId) {
      return new NextResponse("Task id is required", { status: 400 });
    }
    const task = await getTaskById(taskId);
    if (!task) {
      return new NextResponse("Task not found", { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id;
    if (!taskId) {
      return new NextResponse("Task id is required", { status: 400 });
    }
    const { userId } = await req.json();
    if (!userId) {
      return new NextResponse("User id is required", { status: 400 });
    }
    const task = await joinTask(taskId, userId);
    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}
