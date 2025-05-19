
import React, { useState, useEffect } from 'react';
import DiaryEntryForm from '@/components/DiaryEntryForm';
import DiaryEntry, { DiaryEntryType } from '@/components/DiaryEntry';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [entries, setEntries] = useState<DiaryEntryType[]>(() => {
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      return parsed.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
    }
    return [];
  });
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
  }, [entries]);

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
    <div className="min-h-screen bg-gradient-to-b from-white to-diary-light/30">
      <div className="container px-4 py-8 max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-diary-dark to-diary bg-clip-text text-transparent">
            My Personal Diary
          </h1>
          <p className="text-muted-foreground mt-2">
            Record your thoughts, reflections, and experiences
          </p>
        </header>

        <section className="mb-8">
          <DiaryEntryForm onAddEntry={handleAddEntry} />
        </section>

        <Separator className="my-8 bg-diary-light/50" />

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-diary-dark">
            Your Entries
          </h2>
          
          {entries.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">No entries yet. Start writing your first diary entry above!</p>
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
