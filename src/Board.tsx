import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Card from "./Card";
import { Column } from "./Column";
import { useState } from "react";
import { useBoardStore, type Card as CardType } from "./store/useBoardStore";

export const Board = () => {
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [sourceColumn, setSourceColumn] = useState<string | null>(null);

  const {
    cards,
    columns,
    searchTerm,
    setSearchTerm,
    moveCard,
  } = useBoardStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    console.log(event);
    const { active } = event;
    if (active.data.current) {
      setActiveCard(active.data.current as CardType);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);

    if (!over || !sourceColumn || over.id === sourceColumn) return;

    const activeId = active.id.toString();
    moveCard(activeId, sourceColumn, over.id.toString());
    setSourceColumn(null);
  }

  const onStartDrag = (columnId: string) => {
    setSourceColumn(columnId);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCards =
    searchTerm.length > 0
      ? Object.fromEntries(
          Object.entries(cards).filter(([id, card]) =>
            card.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : cards;

  const filteredColumns =
    searchTerm.length > 0
      ? Object.fromEntries(
          Object.entries(columns).map(([key, column]) => [
            key,
            {
              ...column,
              cardIds: column.cardIds.filter(
                (cardId) => cardId in filteredCards
              ),
            },
          ])
        )
      : columns;

  return (
    <div className="h-screen w-screen flex flex-col items-center gap-4 p-4">
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-md p-2"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="flex gap-2">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {Object.values(filteredColumns).map((column) => (
            <Column
              key={column.id}
              title={column.title}
              id={column.id}
              cardIds={column.cardIds}
              cards={filteredCards}
              onStartDrag={onStartDrag}
            />
          ))}

          <DragOverlay>
            {activeCard ? (
              <Card
                id={activeCard.id}
                title={activeCard.title}
                description={activeCard.description}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
