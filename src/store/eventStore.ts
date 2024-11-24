import create from 'zustand';
import { persist } from 'zustand/middleware';



interface eventStore {
  allEvents: any[],
  updateEvent : (event: any) => void
  getEventById: (id: number) => any
  getAllEvents: () => any
  currentEvent: any,
}

export const useEventStore = create<eventStore>()(
  persist(
    (set, get) => ({
      allEvents: localStorage.getItem('allEvents') ? JSON.parse(localStorage.getItem('allEvents') as string) : [],
      currentEvent : null,
      updateEvent: (event: any) => {
        const allEvents = get().allEvents;
        const updatedEvents = allEvents.map((e: any) => {
          if (e.id === event.id) {
            return event;
          }
          return e;
        });
        set({ allEvents: updatedEvents });
      },
      getEventById: (id: any) => {
        let allEvents = JSON.parse(localStorage.getItem('allEvents') as string);
        return allEvents.find((e: any) => e.id == id);
      },
      getAllEvents: () => {
        return get().allEvents;
      }

    }),
    {
      name: 'event-storage',
    }
  )
);