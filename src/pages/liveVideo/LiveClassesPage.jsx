import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getLiveVideoSlice } from "../../redux/HomeSlice";

const LiveClassesPage = () => {
  const dispatch = useDispatch();
  const [liveVideo, setLiveVideo] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLiveClassVideo = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getLiveVideoSlice()).unwrap();
      if (res.status_code === 200) {
        // console.log(res);
        setLiveVideo(res.live?.length ? res.live[0] : null);
        setRecentVideos(res.videos || []);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLiveClassVideo();
  }, [dispatch]);

  return (
    <div className="p-4">
      {loading ? (
        <p className="text-center text-lg font-semibold">Loading...</p>
      ) : (
        <>
          {/* ✅ LIVE Video Section */}
          {liveVideo && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-red-600">🔴 Live Now</h2>
              <div className="bg-white shadow rounded-lg overflow-hidden border">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${liveVideo.id}?rel=0&modestbranding=1&autoplay=1&playsinline=1&enablejsapi=1`}
                    title={liveVideo.snippet.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>


                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {liveVideo.snippet.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {liveVideo.snippet.channelTitle}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Recent Videos Section */}
          <h2 className="text-xl font-bold mb-3">Recent Videos</h2>
          {recentVideos.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentVideos.map((item, index) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-lg overflow-hidden border"
                >
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`}
                      title={item.snippet.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>

                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold line-clamp-2">
                      {item.snippet.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.snippet.channelTitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No videos found</p>
          )}
        </>
      )}
    </div>
  );
};

export default LiveClassesPage;
