'use client';

import { Droppable } from '@hello-pangea/dnd';
import TicketCard from './TicketCard';
import { Ticket, TicketStatus } from '@/types/ticket';

interface KanbanColumnProps {
  status: TicketStatus;
  tickets: Ticket[];
}

export default function KanbanColumn({ status, tickets }: KanbanColumnProps) {
  // Filter tickets that belong to this column
  const columnTickets = tickets.filter((t) => t.status === status);

  return (
    <div className="flex flex-col w-80 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
          {status}
        </h3>
        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
          {columnTickets.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 min-h-[500px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
            }`}
          >
            {columnTickets.map((ticket, index) => (
              <TicketCard key={ticket.id} ticket={ticket} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
