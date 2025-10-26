import { DndContext, DragOverlay, type DragStartEvent } from "@dnd-kit/core";
import { Card } from "./Card";
import { Column } from "./Column";
import { useState } from "react";
import { List, type RowComponentProps } from "react-window";

function generateInitialState(cardCount: number) {
  const cards: Record<string, Card> = {};
  const todoCardIds: string[] = [];

  for (let i = 1; i <= cardCount; i++) {
    const id = `card-${i}`;
    cards[id] = { id, title: `Task ${i}` };
    todoCardIds.push(id);
  }

  const columns = {
    todo: {
      id: "todo",
      title: "Todo",
      cardIds: todoCardIds,
    },
    inProgress: {
      id: "inProgress",
      title: "InProgress",
      cardIds: [],
    },
    done: {
      id: "done",
      title: "Done",
      cardIds: [],
    },
  };

  return { cards, columns };
}

const { cards: initialCards, columns: initialColumns } =
  generateInitialState(5000);

export const Board = () => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [columns, setColumns] = useState(initialColumns);
  const [cards, setCards] = useState(initialCards);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    if (active.data.current) {
      setActiveCard(active.data.current as Card);
    }
  }

  function handleDragEnd() {
    setActiveCard(null);
  }

  return (
    <div className="flex gap-2">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {Object.values(columns).map((column) => (
          <Column
            key={column.id}
            title={column.title}
            id={column.id}
            cardIds={column.cardIds}
            cards={cards}
          />
        ))}

        <DragOverlay>
          {activeCard ? (
            <Card id={activeCard.id} title={activeCard.title} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

