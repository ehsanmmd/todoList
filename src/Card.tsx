import { useDraggable } from "@dnd-kit/core";
import { AiOutlineDelete } from "react-icons/ai";

export interface Card {
  id: string;
  title: string;
  onDelete?: (id: string) => void;
}

export const Card = ({ title, id, onDelete }: Card) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { id, title },
  });

  return (
    <div
      className={`flex flex-col h-32 m-2 bg-amber-600 rounded-lg p-2 text-lime-950 ${
        isDragging ? "opacity-30 border border-dashed" : "opacity-100"
      }`}
      ref={setNodeRef}
    >
      <div className="flex justify-between w-full">
        <span>{title}</span>
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => onDelete?.(id)}
        >
          <AiOutlineDelete />
        </button>
      </div>
      <div className="w-full flex-1" {...attributes} {...listeners}></div>
    </div>
  );
};
