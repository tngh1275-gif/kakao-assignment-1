import TodoApp from './components/TodoApp';
import './style.css'; // 기본으로 있는 css가 꼬이는 걸 방지 (내용 비워둬도 됨)

function App() {
  return <TodoApp />; // 감싸고 있던 div들을 지우고 바로 렌더링
}

export default App; 