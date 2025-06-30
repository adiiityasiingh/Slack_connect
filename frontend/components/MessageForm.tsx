'use client';

import { useState } from 'react';

export default function MessageForm() {
  const [message, setMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ message?: string; time?: string }>({});
  const [successMsg, setSuccessMsg] = useState('');

  const validateForm = () => {
    const newErrors: { message?: string; time?: string } = {};
    
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }
    
    if (!scheduledTime) {
      newErrors.time = 'Schedule time is required';
    } else {
      const selectedDate = new Date(scheduledTime);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.time = 'Schedule time must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/message/schedule', {
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
      setIsLoading(false);
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
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Schedule Time Input */}
          <div className="space-y-3">
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
          </div>

          {/* Success Message */}
          {successMsg && (
            <p className="text-green-400 text-sm text-center bg-green-400/10 border border-green-400/20 rounded-lg p-3">
              {successMsg}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !message.trim() || !scheduledTime}
            className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group-hover:shadow-xl ${
              isLoading || !message.trim() || !scheduledTime ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
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
        </form>
      </div>
    </div>
  );
}
