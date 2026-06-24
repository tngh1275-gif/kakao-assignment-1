'use server';

export async function fetchTodosAction() {
  // FastAPI 백엔드 주소로 직접 요청
  const baseUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/todos`, {
    cache: 'no-store', // 항상 최신 데이터를 가져오도록 캐시 끄기
  });

  if (!res.ok) {
    throw new Error('데이터를 가져오지 못했습니다.');
  }

  return await res.json();
}