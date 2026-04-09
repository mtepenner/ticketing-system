import { useBoardStore } from '@/store/boardStore';
import api from '@/lib/api';
import { TicketStatus, TicketType, TicketPriority } from '@/types/ticket';

// Mock the axios instance
jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('boardStore', () => {
  // Reset the store before each test
  beforeEach(() => {
    useBoardStore.setState({ tickets: [], isLoading: false, error: null });
    jest.clearAllMocks();
  });

  it('fetchTickets successfully populates state', async () => {
    const mockTickets = [
      {
        id: '1',
        title: 'Fix button',
        description: 'Button is broken',
        type: TicketType.BUG,
        priority: TicketPriority.HIGH,
        status: TicketStatus.BACKLOG,
      }
    ];
    
    mockedApi.get.mockResolvedValueOnce({ data: mockTickets });

    const { fetchTickets } = useBoardStore.getState();
    await fetchTickets();

    const state = useBoardStore.getState();
    expect(state.tickets).toEqual(mockTickets);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('addTicket updates the store with the new ticket', async () => {
    const newTicket = {
      id: '2',
      title: 'New Feature',
      description: 'Add a new feature',
      type: TicketType.FEATURE,
      priority: TicketPriority.MEDIUM,
      status: TicketStatus.BACKLOG,
    };

    mockedApi.post.mockResolvedValueOnce({ data: newTicket });

    const { addTicket } = useBoardStore.getState();
    await addTicket('Make a new feature');

    const state = useBoardStore.getState();
    expect(state.tickets).toHaveLength(1);
    expect(state.tickets[0]).toEqual(newTicket);
  });
});
