import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Card } from "./Card";
import { Column } from "./Column";
import { useState } from "react";

export const Board = () => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

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
        <Column title="Todo" id="todo">
          <Card title="first" id="1" />
          <Card title="first" id="2" />
          <Card title="first" id="3" />
        </Column>
        <Column title="InProgress" id="inProgress"></Column>
        <Column title="Done" id="done"></Column>

        <DragOverlay>
          {activeCard ? (
            <Card id={activeCard.id} title={activeCard.title} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
