import { useDroppable } from "@dnd-kit/core";
import type { PropsWithChildren } from "react";
import { Card } from "./Card";
import { useEffect } from "react";
import { Virtuoso } from "react-virtuoso";

export interface Column extends PropsWithChildren {
  id: string;
  title: string;
  cardIds: string[];
  cards: Record<string, Card>;
  onStartDrag: (id: string) => void;
  onDelete: (cardId: string) => void;
}

export const Column = ({
  title,
  id,
  cardIds,
  cards,
  onStartDrag,
  onDelete,
}: Column) => {
  const { isOver, setNodeRef, active } = useDroppable({ id });

  const isInitialPosition = !!active && cardIds.includes(active.id.toString());
  const isOverNewColumn = isOver && !isInitialPosition;
  const isOverSourceColumn = isOver && isInitialPosition;

  useEffect(() => {
    if (isOverSourceColumn) {
      onStartDrag(id);
    }
  }, [isOverSourceColumn]);

  return (
    <div>
      <div className="text-center bg-amber-500 my-2 rounded-lg text-amber-900">
        {title}
      </div>
      <div
        className={`w-50 border border-dashed border-amber-600 rounded-xl py-1 h-[calc(100vh-200px)]  ${
          isOverNewColumn ? "bg-green-100" : undefined
        }`}
        ref={setNodeRef}
      >
        <Virtuoso
          totalCount={cardIds.length}
          itemContent={(index) => (
            <Card
              id={cardIds[index]}
              title={cards[cardIds[index]].title}
              description={cards[cardIds[index]].description}
              onDelete={onDelete}
            />
          )}
        />
      </div>
    </div>
  );
};
