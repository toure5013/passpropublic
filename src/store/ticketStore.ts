import create from 'zustand';
import { persist } from 'zustand/middleware';



interface ticketStore {
  allTickets: any[],
  updateAllTickets: (tickets: any[]) => void
  updateTicket : (ticket: any) => void
  getTicketById: (id: number) => any
  getAllTickets: () => any
  currentTicket: any,
}

export const useTicketStore = create<ticketStore>()(
  persist(
    (set, get) => ({
      allTickets: [],//localStorage.getItem('allTickets') ? JSON.parse(localStorage.getItem('allTickets') as string) : [],
      updateAllTickets: (tickets: any[]) => {
        set({ allTickets: tickets });
      },
      currentTicket : null,
      updateTicket: (ticket: any) => {
        const allTickets = get().allTickets;
        const updatedTickets = allTickets.map((e: any) => {
          if (e.id === ticket.id) {
            return ticket;
          }
          return e;
        });
        set({ allTickets: updatedTickets });
      },
      getTicketById: (id: any) => {
        return get().allTickets.find((e: any) => e.id == id);
      },
      getAllTickets: () => {
        return get().allTickets;
      }

    }),
    {
      name: 'ticket-storage',
    }
  )
);