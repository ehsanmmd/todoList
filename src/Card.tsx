import { useDraggable } from "@dnd-kit/core";

export interface Card {
  id: string;
  title: string;
}

export const Card = ({ title, id }: Card) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { id, title },
  });

  return (
    <div
      className={`h-32 m-2 bg-amber-600 rounded-lg p-2 text-lime-950 ${
        isDragging ? "opacity-30 border border-dashed" : "opacity-100"
      }`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {title}
    </div>
  );
};
