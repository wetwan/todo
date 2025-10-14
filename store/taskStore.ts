import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

export type TodoItem = {
    date: Date;
    title: string;
    id: string;
};

type TodoStore = {
    todos: TodoItem[];
    addTask: (product: TodoItem) => void;
    removeTask: (id: string) => void;
    resetTask: () => void;
};

// ✅ Persisted cart store
export const useTask = create<TodoStore>()(
    persist(
        (set) => ({
            todos: [],
            addTask: (todo) =>
                set((state) => {
                    return {
                        todos: [...state.todos, todo],
                    };
                }),
            removeTask: (id) =>
                set((state) => ({
                    todos: state.todos.filter((todo) => todo.id !== id),
                })),
            resetTask: () => set({ todos: [] }),
        }),
        {
            name: "todo-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
