import { useState } from 'react';

export default function TodoInput({ onAdd }) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;
    onAdd(inputText);
    setInputText('');
  };
  
  return (
    <form id="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        id="todo-input"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="새로운 할 일을 입력하세요..."
        autoComplete="off"
      />
      <button type="submit" id="add-button">추가</button>
    </form>
  );
}