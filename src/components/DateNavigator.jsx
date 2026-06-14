export default function DateNavigator({ selectedDate, onPrev, onNext }) {
  return (
    <div className="weekly-calendar">
      <div className="calendar-header">
        <button onClick={onPrev} className="icon-btn">◀</button>
        <h2 id="month-display">
          {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
        </h2>
        <button onClick={onNext} className="icon-btn">▶</button>
      </div>
    </div>
  );
}