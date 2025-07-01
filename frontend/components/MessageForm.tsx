'use client';

import { useState } from 'react';

interface MessageFormProps {
  onSendNow?: (message: string) => void;
}

export default function MessageForm({ onSendNow }: MessageFormProps) {
  const [message, setMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [errors, setErrors] = useState<{ message?: string; time?: string }>({});
  const [successMsg, setSuccessMsg] = useState('');

  const validateMessage = () => {
    if (!message.trim()) {
      setErrors(prev => ({ ...prev, message: 'Message is required' }));
      return false;
    } else if (message.length > 1000) {
      setErrors(prev => ({ ...prev, message: 'Message must be less than 1000 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, message: undefined }));
    return true;
  };

  const validateScheduleTime = () => {
    if (!scheduledTime) {
      setErrors(prev => ({ ...prev, time: 'Schedule time is required' }));
      return false;
    }
    
    const selectedDate = new Date(scheduledTime);
    const now = new Date();
    if (selectedDate <= now) {
      setErrors(prev => ({ ...prev, time: 'Schedule time must be in the future' }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, time: undefined }));
    return true;
  };

  const handleSendNow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMessage()) return;
    
    setIsSending(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: 'T093PJ6SRN1',
          channel: 'C093PJ75ZQD',
          message,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setMessage('');
        setErrors({});
        setJustSent(true);
        setTimeout(() => setJustSent(false), 2000);
        
        // Call the callback if provided
        if (onSendNow) {
          onSendNow(message);
        }
      } else {
        setErrors({ message: data.error || 'Failed to send message' });
      }
    } catch {
      setErrors({ message: 'Network error. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleScheduleMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMessage() || !validateScheduleTime()) return;
    
    setIsScheduling(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: 'T093PJ6SRN1',
          channel: 'C093PJ75ZQD',
          message,
          scheduled_for: new Date(scheduledTime).toISOString(),
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setMessage('');
        setScheduledTime('');
        setErrors({});
        setSuccessMsg('✅ Message scheduled successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);

        // trigger reload if you pass down reload function as prop
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('reloadScheduled'));
      } else {
        setErrors({ message: data.error || 'Failed to schedule message' });
      }
    } catch {
      setErrors({ message: 'Network error. Please try again.' });
    } finally {
      setIsScheduling(false);
    }
  };

  // Get current datetime for min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // Minimum 1 minute from now
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] group rounded-xl">
      <div className="p-8">
        <form className="space-y-6">
          {/* Message Input */}
          <div className="space-y-3">
            <label 
              htmlFor="message" 
              className="text-white font-medium flex items-center space-x-2"
            >
              <span className="h-4 w-4 text-purple-400">✨</span>
              <span>Your Message</span>
            </label>
            <div className="relative">
              <textarea
                id="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors(prev => ({ ...prev, message: undefined }));
                }}
                placeholder="Type your Slack message here... ✨"
                className={`min-h-[120px] w-full bg-white/5 border border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-vertical transition-all duration-200 rounded-lg p-3 hover:bg-white/10 focus:bg-white/10 focus:outline-none ${
                  errors.message ? "border-red-400 focus:border-red-400 focus:ring-red-400/50" : ""
                }`}
                maxLength={1000}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                {message.length}/1000
              </div>
            </div>
            {errors.message && (
              <p className="text-red-400 text-sm flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Send Now Button */}
            <div className="flex-1">
              <button
                type="button"
                onClick={handleSendNow}
                disabled={isSending || !message.trim() || isScheduling}
                className={`w-full relative overflow-hidden transition-all duration-500 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group-hover:shadow-xl ${
                  justSent ? "bg-gradient-to-r from-green-500 to-emerald-500" : ""
                } ${isSending || !message.trim() || isScheduling ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* Background Animation */}
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-20`} />
                
                {/* Success Ripple Effect */}
                {justSent && (
                  <div className="absolute inset-0 bg-white/30 rounded-xl animate-ping" />
                )}
                
                <div className="relative flex items-center justify-center space-x-2">
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : justSent ? (
                    <>
                      <span className="h-4 w-4">✅</span>
                      <span>Sent!</span>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <span className="h-4 w-4 transition-transform duration-200 group-hover:scale-110">⚡</span>
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      <span>Send Now</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center sm:px-2">
              <div className="w-full h-px sm:w-px sm:h-8 bg-gradient-to-r sm:bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <span className="absolute bg-slate-900 px-2 text-xs text-slate-400 font-medium">OR</span>
            </div>

            {/* Schedule Section */}
            <div className="flex-1 space-y-3">
              <label 
                htmlFor="scheduledTime" 
                className="text-white font-medium flex items-center space-x-2"
              >
                <span className="h-4 w-4 text-blue-400">📅</span>
                <span>Schedule Time</span>
              </label>
              <div className="relative">
                <input
                  id="scheduledTime"
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => {
                    setScheduledTime(e.target.value);
                    if (errors.time) setErrors(prev => ({ ...prev, time: undefined }));
                  }}
                  min={getCurrentDateTime()}
                  className={`w-full bg-white/5 border border-white/20 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 rounded-lg p-3 hover:bg-white/10 focus:bg-white/10 focus:outline-none ${
                    errors.time ? "border-red-400 focus:border-red-400 focus:ring-red-400/50" : ""
                  }`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">🕐</span>
              </div>
              {errors.time && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  <span>{errors.time}</span>
                </p>
              )}
              
              {/* Schedule Button */}
              <button
                type="button"
                onClick={handleScheduleMessage}
                disabled={isScheduling || !message.trim() || !scheduledTime || isSending}
                className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group-hover:shadow-xl ${
                  isScheduling || !message.trim() || !scheduledTime || isSending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isScheduling ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Scheduling...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>📤</span>
                    <span>Schedule Message</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {successMsg && (
            <p className="text-green-400 text-sm text-center bg-green-400/10 border border-green-400/20 rounded-lg p-3">
              {successMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
