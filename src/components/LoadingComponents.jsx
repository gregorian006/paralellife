// =============================================
// LOADING COMPONENTS - Skeleton screens & animations
// =============================================

import React from 'react';
import { Loader2 } from 'lucide-react';

// Typing animation component
export const TypingAnimation = () => (
  <div className="flex gap-1">
    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-100"></div>
    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-200"></div>
  </div>
);

// Message skeleton loader
export const MessageSkeleton = ({ isUser = false }) => (
  <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
    {!isUser && (
      <div className="w-8 h-8 rounded-lg bg-purple-900/40 flex-shrink-0 animate-pulse"></div>
    )}
    <div className={`max-w-xl ${isUser ? 'bg-purple-600/40' : 'bg-purple-900/40'} rounded-2xl p-4 space-y-2`}>
      <div className="h-4 bg-purple-700/50 rounded w-32 animate-pulse"></div>
      <div className="h-4 bg-purple-700/50 rounded w-24 animate-pulse"></div>
    </div>
    {isUser && (
      <div className="w-8 h-8 rounded-lg bg-purple-600/40 flex-shrink-0 animate-pulse"></div>
    )}
  </div>
);

// Chat session skeleton loader
export const SessionSkeleton = () => (
  <div className="p-3 rounded-lg bg-purple-900/20 space-y-2 animate-pulse">
    <div className="h-4 bg-purple-700/50 rounded w-3/4"></div>
    <div className="h-3 bg-purple-700/30 rounded w-1/2"></div>
  </div>
);

// Dashboard card skeleton
export const CardSkeleton = () => (
  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/20 animate-pulse">
    <div className="h-10 bg-purple-700/50 rounded w-1/2 mb-4"></div>
    <div className="space-y-3">
      <div className="h-6 bg-purple-700/40 rounded w-2/3"></div>
      <div className="h-4 bg-purple-700/30 rounded w-1/2"></div>
    </div>
  </div>
);

// Full page loading spinner
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <Loader2 size={48} className="text-purple-400 animate-spin" />
    <p className="text-gray-400 text-lg">{message}</p>
  </div>
);

// Inline loading indicator
export const InlineLoader = ({ size = 'sm', text = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center gap-2">
      <Loader2 size={sizeClasses[size]} className="text-purple-400 animate-spin" />
      {text && <span className="text-sm text-gray-400">{text}</span>}
    </div>
  );
};

// Pulse animation wrapper
export const PulseLoader = () => (
  <div className="flex gap-2 justify-center items-center">
    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse delay-100"></div>
    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse delay-200"></div>
  </div>
);
