
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface DiaryEntryFormProps {
  onAddEntry: (content: string) => void;
}

const DiaryEntryForm: React.FC<DiaryEntryFormProps> = ({ onAddEntry }) => {
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something in your diary entry.",
        variant: "destructive"
      });
      return;
    }
    
    onAddEntry(content);
    setContent('');
    
    toast({
      title: "Entry added",
      description: "Your diary entry has been saved.",
    });
  };

  return (
    <Card className="border-diary-light shadow-md">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Textarea
              placeholder="What's on your mind today?"
              className="min-h-[120px] resize-none focus:border-diary focus:ring-diary"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t bg-muted/20 px-6 py-4">
          <Button 
            type="submit"
            className="bg-diary hover:bg-diary-dark"
          >
            Add Entry
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DiaryEntryForm;
