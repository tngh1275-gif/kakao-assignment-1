import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim() === '') {
      alert('할 일을 입력해 주세요.');
      return;
    }
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div style={{ display: 'flex', flex: 1, gap: '8px', marginRight: '12px' }}>
          <input
            type="text" 
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: '2px solid #672be0', outline: 'none' }}
            autoFocus
          />
          <button onClick={handleSave} className="action-btn edit-btn">저장</button>
          <button onClick={() => { setEditText(todo.text); setIsEditing(false); }} className="action-btn">취소</button>
        </div>
      ) : (
        <>
          <span className="todo-text">{todo.text}</span>
          <div className="button-group">
            <button onClick={() => onToggle(todo.id)} className="action-btn complete-btn">
              {todo.completed ? '해제' : '완료'}
            </button>
            <button onClick={() => setIsEditing(true)} className="action-btn edit-btn">수정</button>
            <button onClick={() => onDelete(todo.id)} className="action-btn delete-btn">삭제</button>
          </div>
        </>
      )}
    </li>
  );
}