from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# 환경변수 로드 (.env.local 파일에서 프론트엔드 주소를 가져오기 위함)
load_dotenv(dotenv_path=".env.local")

# DB 설정 
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
FRONTEND_URL = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB 모델 (테이블 구조 정의)
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)            # 투두 내용
    is_completed = Column(Boolean, default=False) # 완료 여부

# Pydantic 스키마 (요청/응답 데이터 구조 정의)
class TodoCreate(BaseModel):
    title: str

class TodoUpdate(BaseModel):
    title: str
    is_completed: bool

class TodoResponse(BaseModel):
    id: int
    title: str
    is_completed: bool

    class Config:
        from_attributes = True # DB 모델을 Pydantic 모델로 자동 변환

# 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(title="Todo API")

# 환경변수에서 프론트엔드 URL 가져오기 
FRONTEND_URL = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# FastAPI 앱 미들웨어 및 CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 엔드포인트 구현

# 전체 Todo 목록 조회
@app.get("/todos", response_model=list[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    # 모든 투두 데이터를 조회하여 반환
    todos = db.query(Todo).all()
    return todos

# 새 Todo 생성
@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    # 전달받은 데이터로 새 DB 객체 생성
    new_todo = Todo(title=todo.title)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo) # 생성된 id값을 가져오기 위해 새로고침
    return new_todo

# Todo 수정
@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    # 수정할 데이터가 있는지 확인
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # 값 업데이트 및 저장
    db_todo.title = todo.title
    db_todo.is_completed = todo.is_completed
    db.commit()
    db.refresh(db_todo)
    return db_todo

# Todo 삭제
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    # 삭제할 데이터가 있는지 확인
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # 데이터 삭제
    db.delete(db_todo)
    db.commit()
    return {"message": "Todo deleted successfully"}