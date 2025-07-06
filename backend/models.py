#models.py
from pydantic import BaseModel
from typing import Optional


class NoteBase(BaseModel):
    content: str
    status: str


class NoteCreate(NoteBase):
    created_at: Optional[str] = None


class Note(NoteBase):
    id: int
    created_at: str

    class Config:
        from_attributes = True
