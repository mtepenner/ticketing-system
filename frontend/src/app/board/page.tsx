'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import KanbanColumn from '@/components/board/KanbanColumn';
import MagicInput from '@/components/forms/MagicInput';
import { useBoardStore } from '@/store/boardStore';
import { TicketStatus } from '@/types/ticket';

const COLUMNS = [
  TicketStatus.BACKLOG,
  TicketStatus.IN_PROGRESS,
  TicketStatus.REVIEW,
  TicketStatus.DONE,
];

export default function BoardPage() {
  const { tickets, fetchTickets, moveTicket, isLoading } = useBoardStore();
  
  // Strict mode workaround for react-beautiful-dnd / pangea-dnd
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchTickets();
  }, [fetchTickets]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid column
    if (!destination) return;

    // Dropped in the same exact position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move the ticket via Zustand store
    const newStatus = destination.droppableId as TicketStatus;
    moveTicket(draggableId, newStatus);
  };

  if (!isMounted) return null; // Prevent server-side rendering mismatch

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Magic Input */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprint Board</h1>
            <p className="text-gray-500">Describe what needs to be done, AI will handle the rest.</p>
          </div>
          <MagicInput />
        </div>

        {/* Board Area */}
        <div className="relative">
          {isLoading && tickets.length === 0 ? (
            <div className="absolute inset-0 flex justify-center items-center bg-white/50 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : null}

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {COLUMNS.map((status) => (
                <KanbanColumn 
                  key={status} 
                  status={status} 
                  tickets={tickets} 
                />
              ))}
            </div>
          </DragDropContext>
        </div>

      </div>
    </div>
  );
}
