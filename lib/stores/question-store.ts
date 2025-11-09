"use client";

import { create } from "zustand";

type QuestionState = {
  selectedIndex: number | null;
  isRevealed: boolean;
  setSelectedIndex: (index: number) => void;
  revealAnswer: () => void;
  reset: () => void;
};

type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

export const useQuestionStore = create<QuestionState>((set: SetState<QuestionState>) => ({
  selectedIndex: null,
  isRevealed: false,
  setSelectedIndex: (index: number) => set({ selectedIndex: index }),
  revealAnswer: () => set({ isRevealed: true }),
  reset: () => set({ selectedIndex: null, isRevealed: false })
}));
