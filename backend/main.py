#main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import get_db, check_db_connection
from models import Note, NoteCreate
from crud import create_note, get_notes, get_note, update_note, delete_note
import asyncpg

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/notes/", response_model=Note)
async def create_new_note(note: NoteCreate, db: asyncpg.Connection = Depends(get_db)):
    try:
        return await create_note(db, note)
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Note already exists")


@app.get("/notes/", response_model=list[Note])
async def read_notes(status: str = None, db: asyncpg.Connection = Depends(get_db)):
    return await get_notes(db, status)


@app.get("/notes/{note_id}", response_model=Note)
async def read_note(note_id: int, db: asyncpg.Connection = Depends(get_db)):
    note = await get_note(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@app.put("/notes/{note_id}", response_model=Note)
async def update_existing_note(note_id: int, note: NoteCreate, db: asyncpg.Connection = Depends(get_db)):
    updated_note = await update_note(db, note_id, note)
    if not updated_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated_note


@app.delete("/notes/{note_id}", response_model=dict)
async def remove_note(note_id: int, db: asyncpg.Connection = Depends(get_db)):
    deleted_note = await delete_note(db, note_id)
    if not deleted_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted", "id": deleted_note["id"]}


@app.on_event("startup")
async def startup():
    try:
        await check_db_connection()
        print("INFO:     Database connection successful")
    except Exception as e:
        print(f"INFO:     Database connection failed: {e}")
        raise
