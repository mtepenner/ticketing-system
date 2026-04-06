import { create } from 'zustand';
import api from '../lib/api';
import { Ticket, TicketStatus } from '../types/ticket';

interface BoardState {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  addTicket: (rawText: string) => Promise<void>;
  moveTicket: (ticketId: string, newStatus: TicketStatus) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  tickets: [],
  isLoading: false,
  error: null,

  fetchTickets: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/tickets/');
      set({ tickets: response.data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch tickets' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTicket: async (rawText: string) => {
    set({ isLoading: true });
    try {
      // Send the messy text to the AI backend
      const response = await api.post('/tickets/', { raw_text: rawText });
      const newTicket = response.data;
      
      // Update local state with the beautifully parsed ticket
      set((state) => ({
        tickets: [...state.tickets, newTicket],
        error: null,
      }));
    } catch (error) {
      set({ error: 'Failed to parse and create ticket' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  moveTicket: async (ticketId: string, newStatus: TicketStatus) => {
    const originalTickets = get().tickets;

    // 1. Optimistic Update: Change the UI immediately
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus } : t
      ),
    }));

    // 2. Send the update to the backend
    try {
      await api.patch(`/tickets/${ticketId}`, { status: newStatus });
    } catch (error) {
      // 3. Rollback if the backend fails
      set({ tickets: originalTickets, error: 'Failed to move ticket' });
    }
  },
}));
