import { useDroppable } from "@dnd-kit/core";
import type { PropsWithChildren } from "react";
import { Card } from "./Card";
import { List, type RowComponentProps } from "react-window";

export interface Column extends PropsWithChildren {
  id: string;
  title: string;
  cardIds: string[];
  cards: Record<string, Card>;
}

export const Column = ({ title, id, cardIds, cards }: Column) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div>
      <div className="text-center bg-amber-500 my-2 rounded-lg text-amber-900">
        {title}
      </div>
      <div
        className={`w-50 border border-dashed border-amber-600 rounded-xl py-1 h-[calc(100vh-100px)]  ${
          isOver ? "bg-green-100" : undefined
        }`}
        ref={setNodeRef}
      >
        <List
          rowHeight={50}
          rowCount={cardIds.length}
          rowComponent={RowComponent}
          rowProps={{ cards, cardIds }}
        />
      </div>
    </div>
  );
};

function RowComponent({
  index,
  cards,
  cardIds,
}: RowComponentProps<{ cards: Record<string, Card>; cardIds: string[] }>) {
  const filtered = cardIds.map((id) => cards[id]);
  return <Card id={cardIds[index]} title={filtered[index].title} />;
}
