import React from 'react';
import VideoPlayerSkeleton from './VideoPlayerSkeleton';
import VideoPlaylistSkeleton from './VideoPlaylistSkeleton';

const BatchVideosSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Back Button Skeleton */}
              <div className="mr-4 w-10 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
              
              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="h-7 bg-gray-300 rounded animate-pulse w-64"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-48"></div>
              </div>
            </div>

            {/* Badge Skeleton */}
            <div className="h-8 bg-gray-300 rounded-full animate-pulse w-32"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player Skeleton */}
          <div className="lg:col-span-2">
            <VideoPlayerSkeleton />
          </div>

          {/* Playlist Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <VideoPlaylistSkeleton count={8} />

            {/* Batch Info Skeleton */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4">
                <div className="h-5 bg-gray-300 rounded animate-pulse w-32 mb-3"></div>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
                      <div className="h-4 bg-gray-300 rounded animate-pulse w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchVideosSkeleton;
