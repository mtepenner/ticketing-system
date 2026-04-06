import './globals.css';
import Link from 'next/link';
import { LayoutDashboard, KanbanSquare, ListTodo, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'AI Ticketing System',
  description: 'Smarter ticketing powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">Triage AI</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5 text-gray-400" />
              Dashboard
            </Link>
            <Link href="/board" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors">
              <KanbanSquare className="w-5 h-5 text-gray-400" />
              Sprint Board
            </Link>
            <Link href="/list" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors">
              <ListTodo className="w-5 h-5 text-gray-400" />
              All Tickets
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
            v1.0.0 • Connected to Engine
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}
