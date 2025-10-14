import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TodoItem = {
    id: string;
    title: string;
    date: Date;
    completed: boolean;
};

type TodoStore = {
    todos: TodoItem[];
    addTask: (todo: Omit<TodoItem, "completed"> & { completed?: boolean }) => void;
    toggleTodo: (id: string) => void;
    removeTask: (id: string) => void;
    clearTodos: () => void;
};

export const useTask = create<TodoStore>()(
    persist(
        (set) => ({
            todos: [],

            addTask: (todo) =>
                set((state) => ({
                    todos: [
                        ...state.todos,
                        {
                            ...todo,
                            completed: todo.completed ?? false,
                        },
                    ],
                })),
            toggleTodo: (id) =>
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === id ? { ...todo, completed: !todo.completed } : todo
                    ),
                })),

            removeTask: (id) =>
                set((state) => ({
                    todos: state.todos.filter((todo) => todo.id !== id),
                })),

            clearTodos: () => set({ todos: [] }),

        }),
        {
            name: "todo-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
