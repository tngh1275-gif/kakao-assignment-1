"use client"; 

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-bold text-red-500 mb-4">문제가 발생했어요! 🚨</h2>
      <p className="mb-4 text-gray-700">{error.message}</p>
      <button 
        onClick={() => reset()} 
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        다시 시도하기
      </button>
    </div>
  );
}