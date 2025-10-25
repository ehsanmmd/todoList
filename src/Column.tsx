import { useDroppable } from "@dnd-kit/core";
import type { PropsWithChildren } from "react";

export interface Column extends PropsWithChildren {
  id: string;
  title: string;
}

export const Column = ({ title, children, id }: Column) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div>
      <div className="text-center bg-amber-500 my-2 rounded-lg text-amber-900">
        {title}
      </div>
      <div
        className={`w-50 border border-dashed border-amber-600 rounded-xl py-1 h-[calc(100vh-100px)] overflow-y-auto ${
          isOver ? "bg-green-100" : undefined
        }`}
        ref={setNodeRef}
      >
        {children}
      </div>
    </div>
  );
};
