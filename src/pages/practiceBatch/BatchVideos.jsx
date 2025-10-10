import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getBatchVideosSlice } from '../../redux/practiceBatchDataSlice';
import BatchVideosSkeleton from '../../components/Skeleton/BatchVideosSkeleton';

const BatchVideos = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();
  
  // ✅ Get data from Redux store
  const {
    batchVideos,
    videosLoading,
    videosError
  } = useSelector((state) => {
    console.log('BatchVideos Redux State:', state.practiceBatch);
    return state.practiceBatch || {};
  });
  
  // ✅ Extract live and regular videos from API response
  const liveVideos = batchVideos?.live || [];
  const playlistVideos = batchVideos?.videos || [];
  const allVideos = [...liveVideos, ...playlistVideos];
  const debug = batchVideos?.debug || {};
  
  // ✅ State for current playing video
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // ✅ ADDED: State for description expand/collapse
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // ✅ Fetch batch videos from API on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!slug) {
          alert('Batch not found');
          navigate(-1);
          return;
        }
        
        console.log('Fetching videos for slug:', slug);
        await dispatch(getBatchVideosSlice(slug)).unwrap();
      } catch (error) {
        console.error('Error fetching batch videos:', error);
      }
    };
    
    fetchVideos();
  }, [slug, dispatch, navigate]);
  
  // ✅ Set current video: PRIORITY to live videos, otherwise first regular video
  useEffect(() => {
    if (liveVideos.length > 0) {
      console.log('Setting live video as current:', liveVideos[0]);
      setCurrentVideo(liveVideos[0]);
      setIsPlaying(true);
      setShowFullDescription(false); // ✅ Reset description when video changes
    } else if (playlistVideos.length > 0) {
      console.log('Setting first playlist video as current:', playlistVideos[0]);
      setCurrentVideo(playlistVideos[0]);
      setShowFullDescription(false); // ✅ Reset description when video changes
    } else {
      console.log('No videos available');
      setCurrentVideo(null);
    }
  }, [liveVideos, playlistVideos]);

  // ✅ Handle video selection from playlist
  const handleVideoSelect = (video) => {
    console.log('Video selected:', video.snippet.title);
    setCurrentVideo(video);
    setIsPlaying(true);
    setShowFullDescription(false); // ✅ Reset description when video changes
  };

  // ✅ ADDED: Toggle description expand/collapse
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // ✅ Helper functions
  const formatDuration = (publishedAt) => {
    if (!publishedAt) return '';
    const date = new Date(publishedAt);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateTitle = (title, maxLength = 60) => {
    if (!title) return '';
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const truncateDescription = (description, maxLength = 150) => {
    if (!description) return '';
    return description.length > maxLength ? `${description.substring(0, maxLength)}...` : description;
  };

  const isLiveVideo = (video) => {
    return liveVideos.some(lv => lv.id === video.id);
  };

  // ✅ Loading state with Skeleton
  if (videosLoading) {
    return <BatchVideosSkeleton />;
  }

  // ✅ Error state
  if (videosError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Videos</h2>
          <p className="text-red-600 mb-4">{videosError}</p>
          <button 
            onClick={() => dispatch(getBatchVideosSlice(slug))}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ No videos available state
  if (!currentVideo || allVideos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">🎥</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Videos Available</h2>
          <p className="text-gray-600 mb-4">
            This batch doesn't have any videos yet. Please check back later.
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {state?.batch?.title || 'Practice Batch Videos'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {allVideos.length} videos • {currentVideo?.snippet?.channelTitle || 'Revision24'} Channel
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {liveVideos.length > 0 && (
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    {liveVideos.length} Live
                  </div>
                </div>
              )}
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube Playlist
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            {currentVideo && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Video Player */}
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.snippet.resourceId.videoId}?autoplay=${isPlaying ? 1 : 0}&rel=0&modestbranding=1`}
                    title={currentVideo.snippet.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>

                {/* Video Info */}
                <div className="p-6">
                  {isLiveVideo(currentVideo) && (
                    <div className="mb-3">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                        🔴 Live Stream
                      </span>
                    </div>
                  )}
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {currentVideo.snippet.title}
                  </h2>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{currentVideo.snippet.channelTitle}</p>
                        <p className="text-sm text-gray-600">
                          Published on {formatDuration(currentVideo.snippet.publishedAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {!isLiveVideo(currentVideo) && `Class ${currentVideo.snippet.position + 1}`}
                    </div>
                  </div>

                  {/* ✅ UPDATED: Description with working Show More/Less button */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">About this video</h3>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {showFullDescription 
                        ? currentVideo.snippet.description 
                        : truncateDescription(currentVideo.snippet.description, 300)
                      }
                    </p>
                    {currentVideo.snippet.description && currentVideo.snippet.description.length > 300 && (
                      <button 
                        onClick={toggleDescription}
                        className="text-blue-600 text-sm font-medium mt-2 hover:underline focus:outline-none"
                      >
                        {showFullDescription ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video Playlist */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Course Videos ({allVideos.length})
                </h3>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {allVideos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoSelect(video)}
                    className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      currentVideo?.id === video.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex">
                      <div className="relative mr-3 flex-shrink-0">
                        <img
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`${isLiveVideo(video) ? 'bg-red-600' : 'bg-black'} bg-opacity-70 rounded-full p-1`}>
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        {isLiveVideo(video) && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded font-semibold">
                            LIVE
                          </div>
                        )}
                        {currentVideo?.id === video.id && (
                          <div className="absolute -top-1 -left-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                          {truncateTitle(video.snippet.title, 50)}
                        </h4>
                        {isLiveVideo(video) ? (
                          <p className="text-xs text-red-600 font-medium mb-1">
                            🔴 Live Stream
                          </p>
                        ) : (
                          <p className="text-xs text-gray-600 mb-1">
                            Class {video.snippet.position + 1}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDuration(video.snippet.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Info */}
            {state?.batch && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Batch Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{state.batch.duration} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Videos:</span>
                      <span className="font-medium">{allVideos.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Live Videos:</span>
                      <span className="font-medium text-red-600">{liveVideos.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Regular Videos:</span>
                      <span className="font-medium text-blue-600">{playlistVideos.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        state.batch.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {state.batch.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
               
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchVideos;
