const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Обновлённый интерфейс для соответствия бэкенду
export interface DiaryEntryType {
  id: number; // Изменили string на number
  created_at: string; // Бэкенд присылает строку, а не Date
  content: string;
  status: string; // Заменили completed на status
}

export async function fetchNotes(): Promise<DiaryEntryType[]> {
  const res = await fetch(`${API_URL}/notes/`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return await res.json();
}

export async function createNote(content: string): Promise<DiaryEntryType> {
  const res = await fetch(`${API_URL}/notes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      status: "active", // Отправляем статус вместо completed
    }),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return await res.json();
}

export async function deleteNote(id: number) { // Тип изменён на number
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error("Failed to delete note");
}

export async function updateNote(id: number, content: string, status: string): Promise<DiaryEntryType> {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, status }), // Добавляем status
  });
  if (!res.ok) throw new Error("Failed to update note");
  return await res.json();
}

