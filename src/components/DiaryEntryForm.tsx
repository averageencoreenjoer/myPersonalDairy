import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type { DiaryEntryType } from '@/lib/api';

interface DiaryEntryFormProps {
  onAddEntry: (content: string) => void; // Изменён тип пропса
}

const DiaryEntryForm: React.FC<DiaryEntryFormProps> = ({ onAddEntry }) => {
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something in your diary entry.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onAddEntry(content);
      setContent('');

      toast({
        title: "Entry added",
        description: "Your diary entry has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error adding entry",
        description: String(error),
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-gray-300 shadow-md">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <Textarea
            placeholder="What's on your mind today?"
            className="min-h-[120px] resize-none focus:border-black focus:ring-black"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-end border-t bg-gray-50 px-6 py-4">
          <Button
            type="submit"
            className="bg-black hover:bg-gray-800"
          >
            Add Entry
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DiaryEntryForm;