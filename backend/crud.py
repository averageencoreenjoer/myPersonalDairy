# crud.py

from models import NoteCreate, NoteBase

async def create_note(conn, note: NoteCreate):
    query = """
    INSERT INTO notes (created_at, content, status)
    VALUES (COALESCE($1, TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')), $2, $3)
    RETURNING id, created_at, content, status
    """
    row = await conn.fetchrow(query, note.created_at, note.content, note.status)
    return dict(row) if row else None

async def get_notes(conn, status: str = None):
    base_query = "SELECT id, created_at, content, status FROM notes"
    if status:
        rows = await conn.fetch(f"{base_query} WHERE status = $1", status)
    else:
        rows = await conn.fetch(base_query)
    return [dict(row) for row in rows]

async def get_note(conn, note_id: int):
    query = "SELECT id, created_at, content, status FROM notes WHERE id = $1"
    row = await conn.fetchrow(query, note_id)
    return dict(row) if row else None

async def update_note(conn, note_id: int, note: NoteBase):
    query = """
    UPDATE notes
    SET content = $1, status = $2
    WHERE id = $3
    RETURNING id, created_at, content, status
    """
    row = await conn.fetchrow(query, note.content, note.status, note_id)
    return dict(row) if row else None

async def delete_note(conn, note_id: int):
    query = "DELETE FROM notes WHERE id = $1 RETURNING id"
    row = await conn.fetchrow(query, note_id)
    return dict(row) if row else None
