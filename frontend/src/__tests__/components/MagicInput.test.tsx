import { render, screen, fireEvent } from '@testing-library/react';
import MagicInput from '@/components/forms/MagicInput';
import { useBoardStore } from '@/store/boardStore';

// Mock the Zustand store
jest.mock('@/store/boardStore', () => ({
  useBoardStore: jest.fn(),
}));

describe('MagicInput Component', () => {
  let mockAddTicket: jest.Mock;

  beforeEach(() => {
    mockAddTicket = jest.fn().mockResolvedValue(undefined);
    (useBoardStore as unknown as jest.Mock).mockReturnValue(mockAddTicket);
  });

  it('renders the input correctly', () => {
    render(<MagicInput />);
    expect(screen.getByPlaceholderText(/Describe the bug or feature/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Ticket/i })).toBeInTheDocument();
  });

  it('disables the submit button if input is too short', () => {
    render(<MagicInput />);
    const input = screen.getByPlaceholderText(/Describe the bug or feature/i);
    const button = screen.getByRole('button', { name: /Create Ticket/i });

    // Less than 10 characters
    fireEvent.change(input, { target: { value: 'Too short' } });
    expect(button).toBeDisabled();
  });

  it('calls addTicket when a valid form is submitted', async () => {
    render(<MagicInput />);
    const input = screen.getByPlaceholderText(/Describe the bug or feature/i);
    const button = screen.getByRole('button', { name: /Create Ticket/i });

    // Valid input
    fireEvent.change(input, { target: { value: 'This is a sufficiently long ticket description.' } });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(mockAddTicket).toHaveBeenCalledWith('This is a sufficiently long ticket description.');
  });
});
