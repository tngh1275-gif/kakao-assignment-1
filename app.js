const STORAGE_KEY = 'productivity_todo_data';

// 전역 상태 변수
let todoItems = [];
let currentFilter = 'all';
let selectedDate = new Date(); // 사용자가 선택한 날짜
let currentWeekStart = getMonday(new Date()); // 현재 화면에 보이는 주차의 '월요일' 기준 날짜

// 주요 DOM 요소 노드 선택
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');

// 주간 캘린더 DOM 요소 선택
const monthDisplay = document.getElementById('month-display');
const calendarDaysContainer = document.getElementById('calendar-days');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');

/**
 * 앱 초기화 함수
 */
function initializeApp() {
    loadFromLocalStorage();

    todoForm.addEventListener('submit', handleAddTodo);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterChange);
    });

    // 이전 주, 다음 주 이동 이벤트 설정
    prevWeekBtn.addEventListener('click', () => changeWeek(-1));
    nextWeekBtn.addEventListener('click', () => changeWeek(1));

    // 화면 첫 렌더링
    updateUI();
}

/**
 * 특정 날짜가 포함된 주의 '월요일' Date 객체를 반환하는 헬퍼 함수
 */
function getMonday(dateObj) {
    const d = new Date(dateObj);
    const day = d.getDay(); // 0(일요일) ~ 6(토요일)
    // 일요일(0)이면 -6을 더해 월요일로 가고, 나머지는 해당 요일만큼 빼서 월요일로 맞춤
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0); // 시간 초기화
    return d;
}

/**
 * Date 객체를 'YYYY-MM-DD' 형태의 문자열로 변환
 */
function getFormattedDateStr(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    // padstart(2, '0')는 한 자리 숫자를 두 자리로 만들어주는 역할 (예: 1 -> 01)
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 캘린더의 주차를 변경하는 함수
 * @param {number} direction - 이동할 주 (예: -1은 이전 주, 1은 다음 주)
 */
function changeWeek(direction) {
    currentWeekStart.setDate(currentWeekStart.getDate() + (direction * 7));
    updateUI(); // 주가 변경되었으므로 UI 다시 그리기
}

/**
 * 주간 달력을 화면에 렌더링하는 함수
 */
function renderCalendar() {
    calendarDaysContainer.innerHTML = ''; // 기존 달력 초기화

    // 상단 월 표시 (해당 주의 월요일이 속한 달 기준)
    const year = currentWeekStart.getFullYear();
    const month = currentWeekStart.getMonth() + 1;
    monthDisplay.textContent = `${year}년 ${month}월`;

    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const todayStr = getFormattedDateStr(new Date());
    const selectedStr = getFormattedDateStr(selectedDate);

    // 월요일부터 일요일까지 7일 렌더링
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(currentWeekStart);
        currentDay.setDate(currentWeekStart.getDate() + i);
        const currentDayStr = getFormattedDateStr(currentDay);

        // 1. 달력 날짜 셀 컨테이너 생성
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        
        // 조건: 오늘 날짜 및 선택된 날짜에 대한 스타일 클래스 추가
        if (currentDayStr === todayStr) {
            dayCell.classList.add('today');
        }
        if (currentDayStr === selectedStr) {
            dayCell.classList.add('selected');
        }

        // 클릭 이벤트: 클릭 시 해당 날짜를 선택 상태로 만들고 UI 갱신
        dayCell.addEventListener('click', () => {
            selectedDate = currentDay;
            updateUI();
        });

        // 2. 요일 요소
        const dayNameEl = document.createElement('div');
        dayNameEl.className = 'day-name';
        dayNameEl.textContent = dayNames[i];

        // 3. 날짜 요소
        const dayNumEl = document.createElement('div');
        dayNumEl.className = 'day-number';
        dayNumEl.textContent = currentDay.getDate();

        // 4. 할 일 개수 요소 (해당 날짜와 일치하는 Todo 갯수 카운트)
        const todoCountForDay = todoItems.filter(item => item.date === currentDayStr).length;
        const countEl = document.createElement('div');
        countEl.className = 'todo-count';
        countEl.textContent = todoCountForDay;

        // 노드 조립
        dayCell.appendChild(dayNameEl);
        dayCell.appendChild(dayNumEl);
        dayCell.appendChild(countEl);

        calendarDaysContainer.appendChild(dayCell);
    }
}

/**
 * 캘린더와 Todo 목록을 모두 새롭게 그리는 통합 UI 렌더링 함수
 */
function updateUI() {
    renderCalendar();
    renderTodos();
}

/**
 * 필터 탭 갱신 처리
 */
function handleFilterChange(event) {
    currentFilter = event.target.dataset.filter;
    filterButtons.forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
    updateUI();
}

// ----------------- Todo CRUD 로직 ----------------- //

function handleAddTodo(event) {
    event.preventDefault();
    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert('할 일을 입력해 주세요!');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        date: getFormattedDateStr(selectedDate)
    };

    todoItems.push(newTodo);
    saveAndRender();
    todoInput.value = '';
}

function deleteTodo(id) {
    todoItems = todoItems.filter(item => item.id !== id);
    saveAndRender();
}

function toggleCompleteTodo(id) {
    todoItems = todoItems.map(item => {
        if (item.id === id) {
            return { ...item, completed: !item.completed };
        }
        return item;
    });
    saveAndRender();
}

function editTodo(id) {
    const targetTodo = todoItems.find(item => item.id === id);
    if (!targetTodo) return;

    const updatedText = prompt('할 일을 수정하세요:', targetTodo.text);
    if (updatedText === null) return;
    if (updatedText.trim() === '') {
        alert('수정할 내용을 올바르게 입력해 주세요.');
        return;
    }

    targetTodo.text = updatedText.trim();
    saveAndRender();
}

/**
 * 데이터를 조작한 뒤 스토리지에 저장하고 캘린더 카운트 및 목록 갱신
 */
function saveAndRender() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoItems));
    updateUI();
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        todoItems = JSON.parse(savedData);
    }
}

/**
 * 조건에 맞게 필터링 후 화면 목록 렌더링
 */
function renderTodos() {
    todoList.innerHTML = '';
    const targetDateStr = getFormattedDateStr(selectedDate);

    const filteredTodos = todoItems.filter(item => {
        if (item.date !== targetDateStr) return false;
        if (currentFilter === 'active') return !item.completed;
        if (currentFilter === 'completed') return item.completed;
        return true;
    });

    filteredTodos.forEach(item => {
        const li = document.createElement('li');
        li.className = `todo-item ${item.completed ? 'completed' : ''}`;

        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = item.text;
        li.appendChild(span);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn complete-btn';
        completeBtn.textContent = item.completed ? '해제' : '완료';
        completeBtn.addEventListener('click', () => toggleCompleteTodo(item.id));
        buttonGroup.appendChild(completeBtn);

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = '수정';
        editBtn.addEventListener('click', () => editTodo(item.id));
        buttonGroup.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(item.id));
        buttonGroup.appendChild(deleteBtn);

        li.appendChild(buttonGroup);
        todoList.appendChild(li);
    });
}

// 애플리케이션 실행 초기화
initializeApp();