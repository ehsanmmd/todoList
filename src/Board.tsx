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
import { Card } from "./Card";
import { Column } from "./Column";
import { useState } from "react";
import { faker } from "@faker-js/faker";

function generateInitialState(cardCount: number) {
  const cards: Record<string, Card> = {};
  const todoCardIds: string[] = [];

  for (let i = 1; i <= cardCount; i++) {
    const id = `card-${i}`;
    const description = faker.lorem.words(5);
    cards[id] = { id, title: `Task ${i}`, description };
    todoCardIds.push(id);
  }

  const columns: Record<
    string,
    {
      id: string;
      title: string;
      cardIds: string[];
    }
  > = {
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
  const [sourceColumn, setSourceColumn] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      setActiveCard(active.data.current as Card);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);

    if (!over || !sourceColumn || over.id === sourceColumn) return;

    const activeId = active.id.toString();
    const targetColumnId = over.id.toString();

    setColumns((prev) => ({
      ...prev,
      [sourceColumn]: {
        ...prev[sourceColumn],
        cardIds: prev[sourceColumn].cardIds.filter((id) => id !== activeId),
      },
      [targetColumnId]: {
        ...prev[targetColumnId],
        cardIds: [...prev[targetColumnId].cardIds, activeId],
      },
    }));
    setSourceColumn(null);
  }

  const onStartDrag = (columnId: string) => {
    setSourceColumn(columnId);
  };

  const handleCardDelete = (id: string) => {
    setCards((prev) => {
      const newCards = { ...prev };
      delete newCards[id];
      return newCards;
    });

    setColumns((prev) => {
      const newColumns = { ...prev };
      Object.keys(newColumns).forEach((columnKey) => {
        newColumns[columnKey] = {
          ...newColumns[columnKey],
          cardIds: newColumns[columnKey].cardIds.filter(
            (cardId) => cardId !== id
          ),
        };
      });
      return newColumns;
    });
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

  const handleCardUpdate = (cardId: string, description: string) => {
    setCards((prev) => {
      const newCards = { ...prev };
      newCards[cardId].description = description;
      return newCards;
    });
  };

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
              onDelete={handleCardDelete}
              onUpdate={handleCardUpdate}
            />
          ))}

          <DragOverlay>
            {activeCard ? (
              <Card id={activeCard.id} title={activeCard.title} description={activeCard.description} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
