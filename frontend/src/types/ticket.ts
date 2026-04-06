export enum TicketType {
  BUG = 'Bug',
  FEATURE = 'Feature',
  CHORE = 'Chore',
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum TicketStatus {
  BACKLOG = 'Backlog',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done',
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  assignee_id?: string | null;
}

export interface TicketCreateRequest {
  raw_text: string;
}
