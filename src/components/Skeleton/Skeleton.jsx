import React from 'react';

const Skeleton = ({ 
  width = 'w-full', 
  height = 'h-4', 
  rounded = 'rounded', 
  className = '' 
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-300 ${width} ${height} ${rounded} ${className}`}
    />
  );
};

export default Skeleton;
