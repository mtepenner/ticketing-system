import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Ticket } from '@/types/ticket';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/tickets/');
      setTickets(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tickets.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, isLoading, error, refetch: fetchTickets };
}
