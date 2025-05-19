
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DiaryEntryType {
  id: string;
  content: string;
  date: Date;
  completed: boolean;
}

interface DiaryEntryProps {
  entry: DiaryEntryType;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  onToggleComplete: (id: string) => void;
}

const DiaryEntry: React.FC<DiaryEntryProps> = ({
  entry,
  onDelete,
  onEdit,
  onToggleComplete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(entry.content);

  const handleSaveEdit = () => {
    onEdit(entry.id, editedContent);
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className={cn(
      "border mb-4 transition-all duration-200 animate-fade-in shadow hover:shadow-md",
      entry.completed ? "bg-gray-100 border-gray-200" : "bg-white border-gray-300"
    )}>
      <CardContent className="pt-6">
        {!isEditing ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">
                {formatDate(entry.date)}
              </p>
              {entry.completed && (
                <Badge variant="outline" className="bg-black/5 text-black border-gray-200">
                  Completed
                </Badge>
              )}
            </div>
            <p className={cn(
              "whitespace-pre-wrap",
              entry.completed && "text-gray-500"
            )}>
              {entry.content}
            </p>
          </>
        ) : (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px] focus:border-black focus:ring-black"
          />
        )}
      </CardContent>
      <CardFooter className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setEditedContent(entry.content);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              className="bg-black hover:bg-gray-800"
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={entry.completed ? "default" : "outline"}
              size="icon"
              onClick={() => onToggleComplete(entry.id)}
              className={entry.completed ? "bg-black hover:bg-gray-800" : ""}
              title={entry.completed ? "Mark as incomplete" : "Mark as completed"}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              disabled={entry.completed}
              title="Edit entry"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(entry.id)}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
              title="Delete entry"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default DiaryEntry;
