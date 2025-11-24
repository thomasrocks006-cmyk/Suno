import React from 'react';

export const SkeletonLoader: React.FC<{ type?: 'dashboard' | 'card' | 'text' }> = ({ type = 'dashboard' }) => {
  if (type === 'dashboard') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-pulse">
          {/* Header */}
          <div className="border-b border-gray-700 p-6">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3"></div>
          </div>
          
          {/* Tab buttons */}
          <div className="border-b border-gray-700 p-4 flex gap-2">
            <div className="h-10 bg-gray-700 rounded w-24"></div>
            <div className="h-10 bg-gray-800 rounded w-24"></div>
            <div className="h-10 bg-gray-800 rounded w-24"></div>
            <div className="h-10 bg-gray-800 rounded w-24"></div>
          </div>
          
          {/* Content area */}
          <div className="flex-1 overflow-hidden p-6 space-y-4">
            <div className="h-32 bg-gray-800 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-gray-800 rounded"></div>
              <div className="h-24 bg-gray-800 rounded"></div>
              <div className="h-24 bg-gray-800 rounded"></div>
            </div>
            <div className="h-48 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
    </div>
  );
};
