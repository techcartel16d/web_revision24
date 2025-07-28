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
    const timer = setTimeout(() => setShowAd(true), 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, []);

  if (!imageUrl || !showAd) return null;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-[rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="relative max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] w-full p-4">
        {/* ❌ Close button */}
        <button
          onClick={() => setShowAd(false)}
          className="absolute -top-4 -right-4 bg-white text-black rounded-full shadow h-8 w-8 font-bold flex items-center justify-center hover:bg-red-500 hover:text-white transition"
        >
          ×
        </button>

        {/* 📷 Ad image */}
        <Link to={linkUrl} rel="noopener noreferrer">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-auto object-contain rounded-xl shadow-lg transition duration-300"
          />
        </Link>
      </div>
    </div>
  );
};

export default AdBanner;
