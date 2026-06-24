import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json(); // 클라이언트가 보낸 데이터 읽기
  const baseUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  // FastAPI로 전달 
  const res = await fetch(`${baseUrl}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data); // 결과를 다시 클라이언트로 반환
}