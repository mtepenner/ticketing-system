'use client';

import MagicInput from '@/components/forms/MagicInput';
import { useTickets } from '@/hooks/useTickets';
import { TicketStatus } from '@/types/ticket';

export default function Dashboard() {
  const { tickets, isLoading } = useTickets();

  const stats = [
    { label: 'Total Tickets', value: tickets.length },
    { label: 'In Progress', value: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length },
    { label: 'Awaiting Review', value: tickets.filter(t => t.status === TicketStatus.REVIEW).length },
  ];

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Good Morning.</h1>
        <p className="text-gray-500">Here is what is happening across your projects today.</p>
      </header>

      {/* Quick Input */}
      <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          Create New Request
        </h2>
        <MagicInput />
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
            {isLoading ? (
              <div className="mt-2 h-10 w-16 bg-gray-100 animate-pulse rounded-md"></div>
            ) : (
              <span className="text-4xl font-bold mt-2 text-black">{stat.value}</span>
            )}
          </div>
        ))}
      </section>

    </div>
  );
}
