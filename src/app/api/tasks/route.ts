import { createTask, getAllTasks } from "@/lib/tasks";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, description, metaTags, maxParticipants, creatorId } = await req.json();
    if (!title || !description || !metaTags || !maxParticipants || !creatorId) {
      return new NextResponse("All fields are required", { status: 400 });
    }
    const task = await createTask(title, description, metaTags, maxParticipants, creatorId);
    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}
