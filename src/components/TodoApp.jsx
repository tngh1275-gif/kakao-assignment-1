import { useState, useEffect } from 'react';
import DateNavigator from './DateNavigator';
import TodoInput from './TodoInput';
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';

const STORAGE_KEY = 'productivity_todo_data';

const getFormattedDateStr = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  });
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (text) => {
    const newTodo = { id: Date.now(), text, completed: false, date: getFormattedDateStr(selectedDate) };
    setTodos([...todos, newTodo]);
  };

  const handlePrevDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const toggleTodo = (id) => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const editTodo = (id, newText) => setTodos(todos.map(t => t.id === id ? { ...t, text: newText } : t));
  const deleteTodo = (id) => setTodos(todos.filter(t => t.id !== id));

  const targetDateStr = getFormattedDateStr(selectedDate);
  const filteredTodos = todos.filter(todo => {
    if (todo.date !== targetDateStr) return false;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="app-container">
      <header>
        <h1>생산성 Todo</h1>
      </header>
      
      <DateNavigator selectedDate={selectedDate} onPrev={handlePrevDate} onNext={handleNextDate} />
      <TodoInput onAdd={handleAddTodo} />
      <TodoFilter filter={filter} onFilterChange={setFilter} />
      <TodoList todos={filteredTodos} onToggle={toggleTodo} onEdit={editTodo} onDelete={deleteTodo} />
    </div>
  );
}