'use client';

import { useTickets } from '@/hooks/useTickets';
import { formatTicketId } from '@/lib/utils';
import { TicketPriority, TicketType } from '@/types/ticket';

export default function ListView() {
  const { tickets, isLoading } = useTickets();

  if (isLoading) {
    return <div className="p-10 text-gray-500">Loading tickets...</div>;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Tickets</h1>
        <p className="text-gray-500">A dense view of every request in the system.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono">
                  {formatTicketId(ticket.id)}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{ticket.title}</div>
                  <div className="text-gray-500 truncate max-w-md">{ticket.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium text-xs">
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-semibold text-xs ${
                    ticket.priority === TicketPriority.CRITICAL ? 'text-red-600' :
                    ticket.priority === TicketPriority.HIGH ? 'text-orange-600' :
                    ticket.priority === TicketPriority.MEDIUM ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {ticket.type}
                </td>
              </tr>
            ))}
            
            {tickets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No tickets found. Head to the dashboard to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
