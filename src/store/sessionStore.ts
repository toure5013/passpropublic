import create from 'zustand';
import { persist } from 'zustand/middleware';

interface ViewedEvent {
  id: string;
  timestamp: number;
}

interface UserSession {
  lastVisit: number;
  viewedEvents: ViewedEvent[];
  searchHistory: string[];
}

interface SessionStore {
  session: UserSession;
  updateLastVisit: () => void;
  addViewedEvent: (eventId: string) => void;
  addSearchTerm: (term: string) => void;
  getRecentlyViewed: () => string[];
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      session: {
        lastVisit: Date.now(),
        viewedEvents: [],
        searchHistory: []
      },

      updateLastVisit: () => {
        set((state) => ({
          session: {
            ...state.session,
            lastVisit: Date.now()
          }
        }));
      },

      addViewedEvent: (eventId) => {
        set((state) => {
          const newViewedEvents = [
            { id: eventId, timestamp: Date.now() },
            ...state.session.viewedEvents.filter(e => e.id !== eventId)
          ].slice(0, 10); // Keep only last 10 viewed events

          return {
            session: {
              ...state.session,
              viewedEvents: newViewedEvents
            }
          };
        });
      },

      addSearchTerm: (term) => {
        set((state) => {
          const newSearchHistory = [
            term,
            ...state.session.searchHistory.filter(t => t !== term)
          ].slice(0, 5); // Keep only last 5 search terms

          return {
            session: {
              ...state.session,
              searchHistory: newSearchHistory
            }
          };
        });
      },

      getRecentlyViewed: () => {
        const { viewedEvents } = get().session;
        return viewedEvents
          .sort((a, b) => b.timestamp - a.timestamp)
          .map(e => e.id);
      }
    }),
    {
      name: 'user-session'
    }
  )
);