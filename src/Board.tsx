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
import { useState, useEffect } from "react";
import { useBoardStore, type Card as CardType } from "./store/useBoardStore";

export const Board = () => {
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [sourceColumn, setSourceColumn] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { cards, columns, searchTerm, setSearchTerm, moveCard } =
    useBoardStore();

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, setSearchTerm]);

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
    setLocalSearchTerm(event.target.value);
  };

  const filteredCards =
    searchTerm.length > 0
      ? Object.fromEntries(
          Object.entries(cards).filter(
            ([id, card]) =>
              card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              card.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-md p-2 pr-10"
          value={localSearchTerm}
          onChange={handleSearch}
        />
        {isTyping && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            loading...
          </span>
        )}
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
