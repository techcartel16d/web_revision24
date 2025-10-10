import React from 'react';

const VideoPlayerSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Video Player Skeleton */}
      <div className="relative aspect-video bg-gray-300 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Video Info Skeleton */}
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="space-y-3 mb-4">
          <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded animate-pulse w-1/2"></div>
        </div>

        {/* Channel Info Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse mr-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
        </div>

        {/* Description Skeleton */}
        <div className="border-t pt-4">
          <div className="h-5 bg-gray-300 rounded animate-pulse w-32 mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
            <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
            <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerSkeleton;
