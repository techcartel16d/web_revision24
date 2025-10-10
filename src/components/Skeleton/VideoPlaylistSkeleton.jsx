import React from 'react';

const VideoPlaylistSkeleton = ({ count = 10 }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="h-5 bg-gray-300 rounded animate-pulse w-40"></div>
      </div>

      {/* Video List */}
      <div className="max-h-[600px] overflow-y-auto">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="p-4 border-b border-gray-100">
            <div className="flex">
              {/* Thumbnail Skeleton */}
              <div className="relative mr-3 flex-shrink-0">
                <div className="w-20 h-12 bg-gray-300 rounded animate-pulse"></div>
              </div>

              {/* Info Skeleton */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlaylistSkeleton;
