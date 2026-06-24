"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function TodoEditPage({ params }: { params: Promise<{ todoId: string }> }) {
  const [title, setTitle] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const resolvedParams = use(params);
  const todoId = resolvedParams.todoId;

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

    fetch(`${backendUrl}/todos`)
      .then((res) => res.json())
      .then((data) => {
        const target = data.find((t: any) => t.id === parseInt(todoId));
        if (target) {
          setTitle(target.title);
          setIsCompleted(target.is_completed);
        }
      });
  }, [todoId]);

  const handleUpdate = async () => {
    await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, is_completed: isCompleted }),
    });
    router.push("/todos");
    router.refresh();
  };

  const handleDelete = async () => {
    await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });
    router.push("/todos");
    router.refresh();
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">✏️ 할 일 수정 및 삭제</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            className="w-5 h-5"
          />
          이 할 일을 완료했나요?
        </label>
        <div className="flex gap-2 mt-4">
          <button onClick={handleUpdate} className="flex-1 bg-blue-500 text-white py-2 rounded">수정 완료</button>
          <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2 rounded">삭제하기</button>
        </div>
      </div>
    </div>
  );
}