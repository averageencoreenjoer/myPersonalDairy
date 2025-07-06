import React, { useState, useEffect } from 'react';
import DiaryEntryForm from '@/components/DiaryEntryForm';
import DiaryEntry from '@/components/DiaryEntry';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { fetchNotes, createNote, deleteNote, updateNote, toggleNote } from '@/lib/api';
import type { DiaryEntryType } from '@/lib/api';

const Index = () => {
  const [entries, setEntries] = useState<DiaryEntryType[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes()
      .then(setEntries)
      .catch(error => {
        console.error(error);
        toast({
          title: "Error",
          description: "Could not load entries.",
          variant: "destructive",
        });
      });
  }, []);

  const handleAddEntry = async (content: string) => {
    try {
      const newEntry = await createNote(content);
      setEntries(prev => [newEntry, ...prev]);
      toast({
        title: "Entry added",
        description: "Your diary entry has been saved.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not add entry.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (id: number) => { // Тип изменён на number
    try {
      await deleteNote(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Entry deleted",
        description: "Your diary entry has been removed.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not delete entry.",
        variant: "destructive",
      });
    }
  };

  const handleEditEntry = async (id: number, content: string) => {
    try {
      const entry = entries.find(e => e.id === id);
      if (!entry) throw new Error("Entry not found");

      // Добавляем текущий статус
      const updated = await updateNote(id, content, entry.status);
      setEntries(prev =>
        prev.map(entry =>
          entry.id === id ? { ...entry, content: updated.content } : entry
        )
      );
      toast({
        title: "Entry updated",
        description: "Your diary entry has been updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not update entry.",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      const entry = entries.find(e => e.id === id);
      if (!entry) throw new Error("Entry not found");

      const newStatus = entry.status === "active" ? "completed" : "active";
      // Используем updateNote вместо toggleNote
      const updated = await updateNote(id, entry.content, newStatus);

      setEntries(prev =>
        prev.map(entry =>
          entry.id === id ? { ...entry, status: updated.status } : entry
        )
      );
      toast({
        title: "Entry status updated",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not update entry status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-8 max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black">
            My Personal Diary
          </h1>
          <p className="text-gray-600 mt-2">
            Record your thoughts, reflections, and experiences
          </p>
        </header>

        <section className="mb-8">
          <DiaryEntryForm onAddEntry={handleAddEntry} />
        </section>

        <Separator className="my-8 bg-gray-200" />

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-black">
            Your Entries
          </h2>

          {entries.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No entries yet. Start writing your first diary entry above!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map(entry => (
                <DiaryEntry
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDeleteEntry}
                  onEdit={handleEditEntry}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;