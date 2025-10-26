import { useDraggable } from "@dnd-kit/core";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import type { Card as CardType } from "./store/useBoardStore";

interface CardProps extends CardType {
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, description: string) => void;
}

const Card = ({ title, id, description, onDelete, onUpdate }: CardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { id, title, description },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedDescription) {
      onUpdate?.(id, editedDescription);
    }
  };

  const handleDelete = () => {
    onDelete?.(id);
  };

  return (
    <div
      className={`flex flex-col h-32 m-2 bg-amber-600 rounded-lg p-2 text-lime-950 ${
        isDragging ? "opacity-30 border border-dashed" : "opacity-100"
      }`}
      ref={setNodeRef}
    >
      <div className="flex justify-between w-full">
        <span>{title}</span>
        <div className="flex justify-end gap-1">
          <button type="button" className="cursor-pointer" onClick={handleEdit}>
            <AiOutlineEdit />
          </button>
          <button
            type="button"
            className="cursor-pointer"
            onClick={handleDelete}
          >
            <AiOutlineDelete />
          </button>
        </div>
      </div>
      <div
        className="w-full flex-1 text-sm text-gray-700"
        {...attributes}
        {...listeners}
      >
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full h-full resize-none"
            rows={3}
            autoFocus
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleBlur();
              }
            }}
          />
        ) : (
          description
        )}
      </div>
    </div>
  );
};

export default React.memo(Card);
