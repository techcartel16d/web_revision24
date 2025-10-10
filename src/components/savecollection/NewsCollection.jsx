import React, { useEffect, useState } from 'react'
import { getUserCollectionDetailSlice, removeUserCollectionSlice } from '../../redux/HomeSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookmarkCheck, Loader2, ArrowRight } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '../../utils/ToastUtil'
import Loading from '../globle/Loading'
import NotFoundData from '../globle/NotFoundData'
import GlobleAlert from '../globle/GlobleAlert'

const NewsCollection = () => {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(false)
  const [btnLoadingId, setBtnLoadingId] = useState(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [markedData, setMarkedData] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const res = await dispatch(getUserCollectionDetailSlice()).unwrap()
        if (res.status_code === 200) {
          setNewsData(res.data.news_id.data || [])
        }
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [dispatch])

  const handleRemoveBookmark = async () => {
    setBtnLoadingId(markedData.id)
    try {
      const res = await dispatch(removeUserCollectionSlice({
        video_id: [],
        lession_id: [],
        class_note_id: [],
        study_note_id: [],
        article_id: [],
        news_id: [markedData.id],
        question_id: [],
        test_series_id: [],
        package_id: []
      })).unwrap()

      if (res.status_code === 200) {
        showSuccessToast('News removed from bookmarks')
        setNewsData(prev => prev.filter(n => n.id !== markedData.id))
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

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return dateString.split('-').reverse().join('-')
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {newsData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newsData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border group"
            >
              {/* Image with Bookmark */}
              <div className="relative">
                <img
                  src={item?.image || "https://via.placeholder.com/300x200"}
                  alt={item.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMarkedData(item)
                    setShowDeleteAlert(true)
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-yellow-500 hover:text-white transition-all shadow-md"
                >
                  {btnLoadingId === item.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <BookmarkCheck size={18} className="text-yellow-600" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 min-h-[3rem]">
                  {item.title}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500 font-medium">
                    📅 {formatDate(item.date)}
                  </p>
                  {item.category && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Read More Button */}
                <button
                  onClick={() => nav("/current-affairs-details", { state: item })}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  Read More
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Delete Alert */}
              {showDeleteAlert && markedData?.id === item.id && (
                <GlobleAlert
                  type="confirm"
                  message="Remove this news from bookmarks?"
                  onConfirm={handleRemoveBookmark}
                  onCancel={() => setShowDeleteAlert(false)}
                />
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh]">
          <NotFoundData message="No news saved yet" />
        </div>
      )}
    </div>
  )
}

export default NewsCollection
