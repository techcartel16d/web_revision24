import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdBanner = ({
  imageUrl,
  linkUrl = '#',
  alt = 'Advertisement',
  className = '',
}) => {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAd(true), 1000); // 5 seconds delay
    return () => clearTimeout(timer); // cleanup
  }, []);

  if (!imageUrl || !showAd) return null;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-50 ${className}`}
    >
      <div className="relative">
        {/* ❌ Close button */}
        <button
          onClick={() => setShowAd(false)}
          className="absolute -top-10 -right-6 bg-white text-black rounded-full shadow h-8 w-8 font-bold hover:bg-red-500 hover:text-white transition"
        >
          ×
        </button>

        {/* 📷 Ad image */}
        <Link to={linkUrl} rel="noopener noreferrer">
          <img
            src={imageUrl}
            alt={alt}
            className="w-[800px] max-w-full h-auto object-contain rounded-lg shadow-lg  transition duration-300"
          />
        </Link>
      </div>
    </div>
  );
};

export default AdBanner;
