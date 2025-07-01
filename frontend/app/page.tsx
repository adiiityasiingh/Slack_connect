'use client';

import { useState } from 'react';
import MessageForm from '@/components/MessageForm';
import ScheduleList from '@/components/ScheduledList';

interface SentMessage {
  id: string;
  message: string;
  sentAt: string;
}

export default function Home() {
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);

  const handleSendNow = (message: string) => {
    const sentMessage: SentMessage = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      sentAt: new Date().toISOString(),
    };
    setSentMessages(prev => [sentMessage, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-8 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
                    <span className="text-white text-2xl">💬</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
                Slack Connect
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Send messages instantly or schedule them with precision. 
                Never miss an important communication again.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Message Form */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
                  <span className="text-white text-lg">✏️</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Create Message</h2>
              </div>
              <MessageForm onSendNow={handleSendNow} />
            </div>

            {/* Messages Display */}
            <div className="space-y-6">
              {/* Sent Messages Section */}
              {sentMessages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-2 rounded-lg">
                      <span className="text-white text-lg">⚡</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Recently Sent</h2>
                      <p className="text-sm text-slate-400">
                        {sentMessages.length} message{sentMessages.length !== 1 ? 's' : ''} sent
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {sentMessages.slice(0, 3).map((message, index) => (
                      <div 
                        key={message.id}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between space-x-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                              <span className="text-xs text-emerald-300 font-medium">Sent</span>
                              <span className="text-xs text-slate-400">
                                {new Date(message.sentAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-white text-sm leading-relaxed break-words bg-white/5 rounded p-2 border border-white/10">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scheduled Messages */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                  <span className="text-white text-lg">⏰</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Scheduled Messages</h2>
                  <p className="text-sm text-slate-400">
                    Your scheduled messages will appear here
                  </p>
                </div>
              </div>
              <ScheduleList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}