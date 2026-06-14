import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onEdit, onDelete }) {
  if (todos.length === 0) {
    return <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>이 날은 등록된 할 일이 없어요!</p>;
  }

  return (
    <ul id="todo-list">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onToggle={onToggle} 
          onEdit={onEdit} 
          onDelete={onDelete} /* ✨ 이 부분을 onDelete로 정확히 매칭해 주어야 합니다 */
        />
      ))}
    </ul>
  );
}