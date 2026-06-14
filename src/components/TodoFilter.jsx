export default function TodoFilter({ filter, onFilterChange }) {
  return (
    <div className="filter-container">
      <button 
        onClick={() => onFilterChange('all')} 
        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
      >전체</button>
      <button 
        onClick={() => onFilterChange('active')} 
        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
      >진행 중</button>
      <button 
        onClick={() => onFilterChange('completed')} 
        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
      >완료</button>
    </div>
  );
}