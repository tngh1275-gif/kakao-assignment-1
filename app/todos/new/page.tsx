"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTodoPage() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지
    
    // 백엔드로 새 할 일 생성 요청
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title }), 
    });

    router.push("/todos"); // 생성이 끝나면 목록 페이지로 돌아가기
    router.refresh(); // 목록 화면의 데이터를 최신 상태로 새로고침
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6"> 새 할 일 만들기</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded focus:outline-blue-500"
          placeholder="무엇을 해야 하나요?"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded font-bold">
          저장하기
        </button>
      </form>
    </div>
  );
}