import { create } from "zustand";
import { alarms } from "../services/mockData";
import type { AlarmEvent } from "../types";

interface PlatformStore {
  isAIChatOpen: boolean;
  unreadCount: number;
  activeEvents: AlarmEvent[];
  toggleAIChat: () => void;
  closeAIChat: () => void;
  addEvent: (event: AlarmEvent) => void;
  markRead: (eventId: string) => void;
}

export const usePlatformStore = create<PlatformStore>((set) => ({
  isAIChatOpen: false,
  unreadCount: alarms.filter((event) => event.status !== "closed").length,
  activeEvents: alarms,
  toggleAIChat: () => set((state) => ({ isAIChatOpen: !state.isAIChatOpen })),
  closeAIChat: () => set({ isAIChatOpen: false }),
  addEvent: (event) =>
    set((state) => ({
      activeEvents: [event, ...state.activeEvents],
      unreadCount: state.unreadCount + 1
    })),
  markRead: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) }))
}));
