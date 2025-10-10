import React from 'react';

const CardSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Skeleton */}
          <div className="h-48 bg-gray-300 animate-pulse"></div>

          {/* Content Skeleton */}
          <div className="p-6">
            {/* Title */}
            <div className="space-y-2 mb-4">
              <div className="h-5 bg-gray-300 rounded animate-pulse w-full"></div>
              <div className="h-5 bg-gray-300 rounded animate-pulse w-2/3"></div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
            </div>

            {/* Button */}
            <div className="h-10 bg-gray-300 rounded-lg animate-pulse w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
