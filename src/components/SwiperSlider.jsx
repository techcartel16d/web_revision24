import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const SwiperSlider = ({ banner }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  // Generate unique component ID to scope styles
  const componentId = 'swiper-slider-component';

  // Force swiper to recalculate dimensions on mount
  useEffect(() => {
    if (swiperInstance) {
      setTimeout(() => {
        swiperInstance.updateSize();
        swiperInstance.updateSlides();
        swiperInstance.updateProgress();
        swiperInstance.updateSlidesClasses();
      }, 100);
    }
  }, [swiperInstance]);

  // Handle autoplay toggle
  const toggleAutoplay = () => {
    if (swiperInstance) {
      if (isPlaying) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle image load
  const handleImageLoad = (index) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  if (!banner || banner.length === 0) {
    return (
      <div className="w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/10] lg:aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full animate-pulse"></div>
          <p className="text-gray-500 font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        id={componentId}
        className={`relative w-full group ${
          isFullscreen 
            ? 'fixed inset-0 z-50 bg-black/95 p-4 flex items-center justify-center' 
            : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative w-full ${isFullscreen ? 'max-w-6xl max-h-full' : ''}`}>
          {/* Main Swiper Container with Fixed Aspect Ratio */}
          <div className={`
            relative w-full overflow-hidden rounded-2xl shadow-2xl
            ${isFullscreen 
              ? 'h-full' 
              : 'aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[16/9] xl:aspect-[16/9]'
            }
          `}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              spaceBetween={0}
              slidesPerView={1}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              navigation={{
                nextEl: '.custom-next',
                prevEl: '.custom-prev',
              }}
              pagination={{
                el: '.custom-pagination',
                clickable: true,
                bulletActiveClass: 'swiper-pagination-bullet-active',
                renderBullet: (index, className) => {
                  return `<span class="${className} custom-bullet" data-index="${index}"></span>`;
                },
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={banner.length > 1}
              speed={800}
              centeredSlides={true}
              watchSlidesProgress={true}
              onSwiper={(swiper) => {
                setSwiperInstance(swiper);
                // Force recalculation after initialization
                setTimeout(() => {
                  swiper.updateSize();
                  swiper.updateSlides();
                  swiper.updateProgress();
                }, 50);
              }}
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
              className="w-full h-full"
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              {banner.map((item, index) => (
                <SwiperSlide key={index} className="relative w-full h-full">
                  {/* Loading Skeleton */}
                  {!imageLoaded[index] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  )}
                  
                  {/* Main Image - Full Container Coverage */}
                  <img
                    src={item.image}
                    alt={item.title || `Slide ${index + 1}`}
                    onLoad={() => handleImageLoad(index)}
                    className={`
                      w-full h-full object-cover transition-all duration-700
                      ${imageLoaded[index] ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                    `}
                    style={{
                      objectPosition: 'center center',
                      display: 'block'
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Content Overlay */}
                  {(item.title || item.description) && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white pointer-events-none"
                    >
                      {item.title && (
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-sm sm:text-base lg:text-lg opacity-90 line-clamp-2 drop-shadow-lg">
                          {item.description}
                        </p>
                      )}
                    </motion.div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <AnimatePresence>
              {(isHovered || isFullscreen) && banner.length > 1 && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="custom-prev absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group/btn border border-white/20"
                  >
                    <ChevronLeft size={20} className="text-gray-700 group-hover/btn:text-gray-900 group-hover/btn:scale-110 transition-all" />
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="custom-next absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group/btn border border-white/20"
                  >
                    <ChevronRight size={20} className="text-gray-700 group-hover/btn:text-gray-900 group-hover/btn:scale-110 transition-all" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* Control Panel */}
            <AnimatePresence>
              {(isHovered || isFullscreen) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30 flex items-center gap-2"
                >
                  {/* Autoplay Toggle */}
                  {banner.length > 1 && (
                    <button
                      onClick={toggleAutoplay}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all duration-300 flex items-center justify-center border border-white/20"
                    >
                      {isPlaying ? (
                        <Pause size={16} className="text-white" />
                      ) : (
                        <Play size={16} className="text-white ml-0.5" />
                      )}
                    </button>
                  )}
                  
                  {/* Fullscreen Toggle */}
                  <button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all duration-300 flex items-center justify-center border border-white/20"
                  >
                    <Maximize2 size={16} className="text-white" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Slide Counter */}
            {banner.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered || isFullscreen ? 1 : 0 }}
                className="absolute top-3 sm:top-4 left-3 sm:left-4 z-30 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20"
              >
                {currentSlide + 1} / {banner.length}
              </motion.div>
            )}

            {/* Custom Pagination */}
            {banner.length > 1 && (
              <div className="custom-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"></div>
            )}

            {/* Progress Bar */}
            {banner.length > 1 && isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                <motion.div
                  key={currentSlide}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                />
              </div>
            )}
          </div>
        </div>

        {/* Fullscreen Close Button */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-40 w-12 h-12 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full transition-all duration-300 flex items-center justify-center border border-white/20"
          >
            <ChevronLeft size={24} className="text-white rotate-45" />
          </button>
        )}
      </div>

      {/* Scoped Custom Styles - Only for this component */}
      <style jsx>{`
        /* Scoped to this component only using component ID */
        #${componentId} .swiper {
          width: 100% !important;
          height: 100% !important;
        }
        
        #${componentId} .swiper-wrapper {
          width: 100% !important;
          height: 100% !important;
        }
        
        #${componentId} .swiper-slide {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        /* Custom Pagination Bullets - Scoped */
        #${componentId} .custom-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        #${componentId} .custom-bullet:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.2);
        }
        
        #${componentId} .swiper-pagination-bullet-active.custom-bullet {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          width: 28px;
          border-radius: 5px;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        
        /* Loading Animation - Scoped */
        #${componentId} .animate-shimmer {
          animation: shimmer-${componentId} 2s infinite;
        }
        
        @keyframes shimmer-${componentId} {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Responsive Improvements - Scoped */
        @media (max-width: 640px) {
          #${componentId} .custom-bullet {
            width: 8px;
            height: 8px;
          }
          
          #${componentId} .swiper-pagination-bullet-active.custom-bullet {
            width: 24px;
          }
        }
        
        /* Fix for iOS Safari - Scoped */
        #${componentId} .swiper-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </>
  );
};

export default SwiperSlider;
