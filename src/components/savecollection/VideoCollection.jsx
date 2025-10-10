import React, { useEffect, useState } from 'react'
import { getUserCollectionDetailSlice, removeUserCollectionSlice, saveCollectionSlice } from '../../redux/HomeSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookmarkCheck, Loader2, Play, Clock, Eye } from 'lucide-react'
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtil'
import Loading from '../globle/Loading'
import NotFoundData from '../globle/NotFoundData'
import GlobleAlert from '../globle/GlobleAlert'

const VideoCollection = () => {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [videoData, setVideoData] = useState([])
  const [bookmarkedIds, setBookmarkedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [btnLoadingId, setBtnLoadingId] = useState(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [markedData, setMarkedData] = useState(null)

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const res = await dispatch(getUserCollectionDetailSlice()).unwrap()
      if (res.status_code === 200) {
        setVideoData(res.data.video_id.data || [])
        const ids = (res.data.video_id?.data || []).map(item => item.id)
        setBookmarkedIds(ids)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleRemoveBookmark = async () => {
    setBtnLoadingId(markedData.id)
    try {
      const res = await dispatch(removeUserCollectionSlice({
        video_id: [markedData.id],
        lession_id: [],
        class_note_id: [],
        study_note_id: [],
        article_id: [],
        news_id: [],
        question_id: [],
        test_series_id: [],
        package_id: []
      })).unwrap()

      if (res.status_code === 200) {
        showSuccessToast('Video removed from bookmarks')
        setVideoData(prev => prev.filter(v => v.id !== markedData.id))
        setBookmarkedIds(prev => prev.filter(id => id !== markedData.id))
      } else {
        showErrorToast('Failed to remove bookmark')
      }
    } catch (error) {
      showErrorToast('Something went wrong!')
    } finally {
      setBtnLoadingId(null)
      setShowDeleteAlert(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {videoData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videoData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={item.thumbnail || "https://via.placeholder.com/300x200"}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-16 h-16 text-white" fill="white" />
                </div>
                {item.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Clock size={12} />
                    {item.duration}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                  {item.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between">
                  {item.views && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye size={14} />
                      {item.views} views
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMarkedData(item)
                      setShowDeleteAlert(true)
                    }}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    {btnLoadingId === item.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <BookmarkCheck size={16} />
                    )}
                  </button>
                </div>
              </div>

              {showDeleteAlert && markedData?.id === item.id && (
                <GlobleAlert
                  type="confirm"
                  message="Remove this video from bookmarks?"
                  onConfirm={handleRemoveBookmark}
                  onCancel={() => setShowDeleteAlert(false)}
                />
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh]">
          <NotFoundData message="No videos saved yet" />
        </div>
      )}
    </div>
  )
}

export default VideoCollection
