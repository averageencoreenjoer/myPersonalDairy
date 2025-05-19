
import React, { useState } from 'react';
import DiaryEntryForm from '@/components/DiaryEntryForm';
import DiaryEntry, { DiaryEntryType } from '@/components/DiaryEntry';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Sample initial data (in-memory store)
const initialEntries: DiaryEntryType[] = [
  {
    id: "1",
    content: "Today I started using this diary app. It's quite nice with its black and white design.",
    date: new Date(),
    completed: false
  }
];

const Index = () => {
  const [entries, setEntries] = useState<DiaryEntryType[]>(initialEntries);
  const { toast } = useToast();

  const handleAddEntry = (content: string) => {
    const newEntry: DiaryEntryType = {
      id: uuidv4(),
      content,
      date: new Date(),
      completed: false
    };

    setEntries(prev => [newEntry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Entry deleted",
      description: "Your diary entry has been removed.",
    });
  };

  const handleEditEntry = (id: string, content: string) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, content } : entry
      )
    );
    toast({
      title: "Entry updated",
      description: "Your diary entry has been updated.",
    });
  };

  const handleToggleComplete = (id: string) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { ...entry, completed: !entry.completed } 
          : entry
      )
    );
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
