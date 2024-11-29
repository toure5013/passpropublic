import create from "zustand";
import { persist } from "zustand/middleware";

interface promoterStatsStore {
  stats: [];
}

export const usePromoterStatsStore = create<promoterStatsStore>()(
  persist(
    (set, get) => ({
      stats: [],
    }),
    {
      name: "promoter-session",
    }
  )
);
