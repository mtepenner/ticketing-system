import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes safely, resolving conflicts.
 * Example: cn('px-2 py-1', isError ? 'bg-red-500' : 'bg-blue-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a UUID into a short, readable ticket ID (e.g., TKT-A1B2)
 */
export function formatTicketId(uuid: string): string {
  if (!uuid) return '';
  const shortId = uuid.split('-')[0].substring(0, 4).toUpperCase();
  return `TKT-${shortId}`;
}
