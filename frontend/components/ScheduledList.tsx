'use client';
import { useEffect, useState } from 'react';

interface ScheduledMessage {
  _id: string;
  message: string;
  scheduled_for: string;
}

export default function ScheduledList() {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/scheduled/T093PJ6SRN1`);
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
    setLoading(false);
  };

  const cancelMessage = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/cancel/${id}`, {
        method: 'DELETE',
      });
      fetchMessages();
    } catch (error) {
      console.error('Failed to cancel message:', error);
    }
    setDeletingId(null);
  };

  useEffect(() => {
    fetchMessages();
    const handler = () => fetchMessages();
    window.addEventListener('reloadScheduled', handler);
    return () => window.removeEventListener('reloadScheduled', handler);
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })
    };
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl">
        <div className="p-12 text-center">
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full">
                <div className="h-8 w-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Messages</h3>
          <p className="text-slate-400">Fetching your scheduled messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl">
        <div className="p-12 text-center">
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-slate-500 to-slate-600 p-4 rounded-full">
                <span className="text-white text-2xl">💬</span>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Messages Scheduled</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Create your first scheduled message to get started. Your messages will appear here once scheduled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      {messages.map((message, index) => {
        const { date, time } = formatDateTime(message.scheduled_for);
        
        return (
          <div 
            key={message._id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] group rounded-xl"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1 min-w-0">
                  {/* Status Badge */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-1.5 px-3 py-1 text-xs font-medium bg-amber-500/20 text-amber-200 rounded-full">
                      <span className="h-3 w-3">⏰</span>
                      <span>Pending</span>
                    </div>
                    
                    {/* Schedule Info */}
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="h-3 w-3">📅</span>
                      <span>{date}</span>
                      <span className="h-3 w-3 ml-2">🕐</span>
                      <span>{time}</span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="bg-white/5 rounded-lg p-4 mb-3 border border-white/10">
                    <p className="text-white text-sm leading-relaxed break-words">
                      {message.message}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-slate-500">
                    Scheduled for {new Date(message.scheduled_for).toLocaleString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => cancelMessage(message._id)}
                    disabled={deletingId === message._id}
                    className={`bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 hover:border-red-400 transition-all duration-200 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      deletingId === message._id ? 'opacity-100' : ''
                    }`}
                  >
                    {deletingId === message._id ? (
                      <div className="h-4 w-4 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin"></div>
                    ) : (
                      <span className="h-4 w-4">🗑️</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
