import { create } from "zustand";
import { faker } from "@faker-js/faker";

export interface Card {
  id: string;
  title: string;
  description?: string;
}

interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

interface BoardState {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  createCard: (columnId: string, title: string, description?: string) => void;
  updateCard: (cardId: string, description: string) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string) => void;

  setColumns: (columns: Record<string, Column>) => void;
}

function generateInitialState(cardCount: number) {
  const cards: Record<string, Card> = {};
  const todoCardIds: string[] = [];

  for (let i = 1; i <= cardCount; i++) {
    const id = `card-${i}`;
    const description = faker.lorem.words(5);
    cards[id] = { id, title: `Task ${i}`, description };
    todoCardIds.push(id);
  }

  const columns: Record<string, Column> = {
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

export const useBoardStore = create<BoardState>((set) => ({
  cards: initialCards,
  columns: initialColumns,
  searchTerm: "",

  setSearchTerm: (term) => set({ searchTerm: term }),

  createCard: (columnId, title, description) => {
    const newId = `card-${Date.now()}`;
    const newCard: Card = { id: newId, title, description };

    set((state) => ({
      cards: {
        [newId]: newCard,
        ...state.cards,
      },
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId],
          cardIds: [newId, ...state.columns[columnId].cardIds],
        },
      },
    }));
  },

  updateCard: (cardId, description) => {
    set((state) => ({
      cards: {
        ...state.cards,
        [cardId]: {
          ...state.cards[cardId],
          description,
        },
      },
    }));
  },

  deleteCard: (cardId) => {
    set((state) => {
      const newCards = { ...state.cards };
      delete newCards[cardId];

      const newColumns = { ...state.columns };
      Object.keys(newColumns).forEach((columnKey) => {
        newColumns[columnKey] = {
          ...newColumns[columnKey],
          cardIds: newColumns[columnKey].cardIds.filter((id) => id !== cardId),
        };
      });

      return { cards: newCards, columns: newColumns };
    });
  },

  moveCard: (cardId, fromColumnId, toColumnId) => {
    set((state) => ({
      columns: {
        ...state.columns,
        [fromColumnId]: {
          ...state.columns[fromColumnId],
          cardIds: state.columns[fromColumnId].cardIds.filter(
            (id) => id !== cardId
          ),
        },
        [toColumnId]: {
          ...state.columns[toColumnId],
          cardIds: [...state.columns[toColumnId].cardIds, cardId],
        },
      },
    }));
  },

  setColumns: (columns) => set({ columns }),
}));
