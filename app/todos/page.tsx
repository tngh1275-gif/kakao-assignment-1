import Link from "next/link";
import { fetchTodosAction } from "../actions"; // actions.ts에서 함수 불러오기

export default async function TodosPage() {
  // actions.ts를 통해 FastAPI에서 직접 데이터 가져오기 
  const todos = await fetchTodosAction();

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">📝 내 할 일 목록</h1>
      
      <ul className="space-y-3 mb-6">
        {todos.map((todo: any) => (
          <li key={todo.id} className="border p-3 rounded hover:bg-gray-50">
            <Link href={`/todos/${todo.id}`} className="block">
              {todo.is_completed ? "✅" : "⬜️"} {todo.title}
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/todos/new" className="bg-blue-500 text-white px-4 py-2 rounded block text-center font-bold">
        + 새 할 일 추가하기
      </Link>
    </div>
  );
}