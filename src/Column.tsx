import { useDroppable } from "@dnd-kit/core";
import type { PropsWithChildren } from "react";
import { Card } from "./Card";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";

export interface Column extends PropsWithChildren {
  id: string;
  title: string;
  cardIds: string[];
  cards: Record<string, Card>;
  onStartDrag: (id: string) => void;
  onDelete: (cardId: string) => void;
  onUpdate: (cardId: string, description: string) => void;
  onCreateCard: (columnId: string, title: string, description?: string) => void;
}

export const Column = ({
  title,
  id,
  cardIds,
  cards,
  onStartDrag,
  onDelete,
  onUpdate,
  onCreateCard,
}: Column) => {
  const { isOver, setNodeRef, active } = useDroppable({ id });
  const [isCreating, setIsCreating] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const isInitialPosition = !!active && cardIds.includes(active.id.toString());
  const isOverNewColumn = isOver && !isInitialPosition;
  const isOverSourceColumn = isOver && isInitialPosition;

  useEffect(() => {
    if (isOverSourceColumn) {
      onStartDrag(id);
    }
  }, [isOverSourceColumn]);

  const handleCreate = () => {
    if (newCardTitle.trim()) {
      onCreateCard(id, newCardTitle.trim());
      setNewCardTitle("");
    }
    setIsCreating(false);
  };

  return (
    <div>
      <div className="text-center bg-amber-500 my-2 rounded-lg text-amber-900">
        {title}
      </div>
      <div
        className={`w-50 border border-dashed border-amber-600 rounded-xl py-1 h-[calc(100vh-200px)] flex flex-col ${
          isOverNewColumn ? "bg-green-100" : undefined
        }`}
        ref={setNodeRef}
      >
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className=" p-2 text-sm text-gray-600 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded m-2"
          >
            + Add Card
          </button>
        ) : (
          <div className="m-2 p-2 bg-white border border-gray-300 rounded">
            <input
              type="text"
              placeholder="Card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onBlur={handleCreate}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                } else if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewCardTitle("");
                }
              }}
              className="w-full p-1 border border-gray-300 rounded"
              autoFocus
            />
          </div>
        )}
        <div className="flex-1">
          <Virtuoso
            totalCount={cardIds.length}
            itemContent={(index) => (
              <Card
                id={cardIds[index]}
                title={cards[cardIds[index]].title}
                description={cards[cardIds[index]].description}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
