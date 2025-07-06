import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import type { DiaryEntryType } from '@/lib/api';

interface DiaryEntryProps {
  entry: DiaryEntryType;
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
  onToggleComplete: (id: number) => void;
}

const DiaryEntry: React.FC<DiaryEntryProps> = ({
  entry,
  onDelete,
  onEdit,
  onToggleComplete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(entry.content);
  const { toast } = useToast();

  const handleSaveEdit = async () => {
    try {
      // Передаем только id и content, status будет взят из текущей записи
      await onEdit(entry.id, editedContent);
      setIsEditing(false);
      toast({ title: "Entry updated" });
    } catch (error) {
      toast({
        title: "Error updating entry",
        description: String(error),
        variant: "destructive"
      });
    }
  };

  const handleToggleComplete = async () => {
    try {
      await onToggleComplete(entry.id);
    } catch (error) {
      toast({
        title: "Error toggling completion",
        description: String(error),
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(entry.id);
    } catch (error) {
      toast({
        title: "Error deleting entry",
        description: String(error),
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card
      className={cn(
        "border mb-4 transition-all duration-200 animate-fade-in shadow hover:shadow-md",
        entry.status === "completed" ? "bg-gray-100 border-gray-200" : "bg-white border-gray-300"
      )}
    >
      <CardContent className="pt-6">
        {!isEditing ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">
                {formatDate(entry.created_at)}
              </p>
              {entry.status === "completed" && (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  Completed
                </Badge>
              )}
            </div>
            <p className={cn(
              "whitespace-pre-wrap",
              entry.status === "completed" && "text-gray-500"
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
            <Button onClick={handleSaveEdit} className="bg-black hover:bg-gray-800">
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={entry.status === "completed" ? "default" : "outline"}
              size="icon"
              onClick={handleToggleComplete}
              className={entry.status === "completed" ? "bg-green-600 hover:bg-green-700" : ""}
              title={entry.status === "completed" ? "Mark as incomplete" : "Mark as completed"}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              disabled={entry.status === "completed"}
              title="Edit entry"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
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