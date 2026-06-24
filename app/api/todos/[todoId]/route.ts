import { NextResponse } from "next/server";


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {

  const resolvedParams = await params;
  const todoId = resolvedParams.todoId;

  const body = await request.json();
  const baseUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

  const res = await fetch(`${baseUrl}/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {

  const resolvedParams = await params;
  const todoId = resolvedParams.todoId;

  const baseUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

  const res = await fetch(`${baseUrl}/todos/${todoId}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return NextResponse.json(data);
}