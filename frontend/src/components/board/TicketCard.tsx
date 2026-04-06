'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Ticket, TicketPriority, TicketType } from '@/types/ticket';
import { GripVertical } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  index: number;
}

const priorityColors = {
  [TicketPriority.LOW]: 'bg-gray-100 text-gray-700',
  [TicketPriority.MEDIUM]: 'bg-blue-100 text-blue-700',
  [TicketPriority.HIGH]: 'bg-orange-100 text-orange-800',
  [TicketPriority.CRITICAL]: 'bg-red-100 text-red-800',
};

const typeColors = {
  [TicketType.BUG]: 'border-red-200 bg-red-50',
  [TicketType.FEATURE]: 'border-green-200 bg-green-50',
  [TicketType.CHORE]: 'border-gray-200 bg-gray-50',
};

export default function TicketCard({ ticket, index }: TicketCardProps) {
  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative p-4 mb-3 bg-white border rounded-lg shadow-sm transition-shadow hover:shadow-md ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              {/* Badges */}
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${typeColors[ticket.type]}`}>
                  {ticket.type}
                </span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </span>
              </div>
              
              {/* Content */}
              <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                {ticket.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2">
                {ticket.description}
              </p>
            </div>

            {/* Drag Handle */}
            <div 
              {...provided.dragHandleProps}
              className="ml-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
