import React, { useEffect, useState } from 'react'
import { getUserCollectionDetailSlice, removeUserCollectionSlice } from '../../redux/HomeSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookmarkCheck, Loader2, FileText, Download } from 'lucide-react'
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtil'
import Loading from '../globle/Loading'
import NotFoundData from '../globle/NotFoundData'
import GlobleAlert from '../globle/GlobleAlert'

const StudyCollection = () => {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [studyData, setStudyData] = useState([])
  const [loading, setLoading] = useState(false)
  const [btnLoadingId, setBtnLoadingId] = useState(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [markedData, setMarkedData] = useState(null)

  const fetchStudyMaterial = async () => {
    try {
      setLoading(true)
      const res = await dispatch(getUserCollectionDetailSlice()).unwrap()
      if (res.status_code === 200) {
        setStudyData(res.data.study_note_id.data || [])
      }
    } catch (error) {
      console.error('Error fetching study material:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudyMaterial()
  }, [])

  const handleRemoveBookmark = async () => {
    setBtnLoadingId(markedData.id)
    try {
      const res = await dispatch(removeUserCollectionSlice({
        video_id: [],
        lession_id: [],
        class_note_id: [],
        study_note_id: [markedData.id],
        article_id: [],
        news_id: [],
        question_id: [],
        test_series_id: [],
        package_id: []
      })).unwrap()

      if (res.status_code === 200) {
        showSuccessToast('Study material removed from bookmarks')
        setStudyData(prev => prev.filter(s => s.id !== markedData.id))
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
      {studyData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border cursor-pointer"
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={28} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMarkedData(item)
                    setShowDeleteAlert(true)
                  }}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {btnLoadingId === item.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <BookmarkCheck size={18} />
                  )}
                </button>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {item.description || 'No description available'}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  View PDF
                </button>
                {item.pdf_url && (
                  <a
                    href={item.pdf_url}
                    download
                    className="p-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                  >
                    <Download size={20} />
                  </a>
                )}
              </div>

              {showDeleteAlert && markedData?.id === item.id && (
                <GlobleAlert
                  type="confirm"
                  message="Remove this study material from bookmarks?"
                  onConfirm={handleRemoveBookmark}
                  onCancel={() => setShowDeleteAlert(false)}
                />
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh]">
          <NotFoundData message="No study materials saved yet" />
        </div>
      )}
    </div>
  )
}

export default StudyCollection
