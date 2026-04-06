'use client';

import { useState } from 'react';
import { useBoardStore } from '@/store/boardStore';
import { Sparkles, Loader2 } from 'lucide-react';

export default function MagicInput() {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTicket = useBoardStore((state) => state.addTicket);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || input.length < 10) return;

    setIsSubmitting(true);
    try {
      await addTicket(input);
      setInput(''); // Clear input on success
    } catch (error) {
      console.error('Failed to create ticket', error);
      // In a real app, trigger a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd+Enter or Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the bug or feature in plain English... (e.g., 'Users are getting a 500 error when trying to checkout with Stripe')"
          className="w-full p-4 min-h-[120px] text-gray-800 placeholder-gray-400 bg-transparent border-none resize-none focus:ring-0 sm:text-sm"
          disabled={isSubmitting}
        />
        
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>AI will automatically categorize, prioritize, and format this.</span>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || input.length < 10}
            className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Parsing...
              </>
            ) : (
              'Create Ticket'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
