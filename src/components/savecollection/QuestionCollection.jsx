import React, { useEffect, useState } from 'react'
import { getUserCollectionDetailSlice, removeUserCollectionSlice } from '../../redux/HomeSlice'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { BookmarkCheck, Loader2, CheckCircle, XCircle, Globe } from 'lucide-react'
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtil'
import Loading from '../globle/Loading'
import NotFoundData from '../globle/NotFoundData'
import GlobleAlert from '../globle/GlobleAlert'

const QuestionCollection = () => {
  const dispatch = useDispatch()
  const [questionData, setQuestionData] = useState([])
  const [loading, setLoading] = useState(false)
  const [btnLoadingId, setBtnLoadingId] = useState(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [markedData, setMarkedData] = useState(null)
  const [language, setLanguage] = useState('hindi') // ✅ NEW: Language state

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const res = await dispatch(getUserCollectionDetailSlice()).unwrap()
      if (res.status_code === 200) {
        setQuestionData(res.data.question_id.data || [])
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleRemoveBookmark = async () => {
    setBtnLoadingId(markedData.id)
    try {
      const res = await dispatch(removeUserCollectionSlice({
        video_id: [],
        lession_id: [],
        class_note_id: [],
        study_note_id: [],
        article_id: [],
        news_id: [],
        question_id: [markedData.id],
        test_series_id: [],
        package_id: []
      })).unwrap()

      if (res.status_code === 200) {
        showSuccessToast('Question removed from bookmarks')
        setQuestionData(prev => prev.filter(q => q.id !== markedData.id))
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

  // ✅ NEW: Get question text based on language
  const getQuestionText = (item) => {
    return language === 'hindi' ? item.question_hindi : item.question_english
  }

  // ✅ NEW: Get option text based on language
  const getOptionText = (item, optionKey) => {
    const optionMap = {
      'option_1': language === 'hindi' ? 'option_hindi_a' : 'option_english_a',
      'option_2': language === 'hindi' ? 'option_hindi_b' : 'option_english_b',
      'option_3': language === 'hindi' ? 'option_hindi_c' : 'option_english_c',
      'option_4': language === 'hindi' ? 'option_hindi_d' : 'option_english_d',
    }
    return item[optionMap[optionKey]] || ''
  }

  // ✅ NEW: Get explanation based on language
  const getExplanation = (item) => {
    return language === 'hindi' ? item.explanation : item.explanation_english
  }

  // ✅ NEW: Get correct answer based on language
  const getCorrectAnswer = (item) => {
    return language === 'hindi' ? item.hindi_ans : item.english_ans
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {questionData.length > 0 ? (
        <div className="space-y-4 max-w-6xl mx-auto">
          {/* ✅ NEW: Language Toggle Header */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xl font-bold text-gray-900">Bookmarked Questions</h2>
            <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setLanguage('hindi')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                  language === 'hindi'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Globe size={16} />
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                  language === 'english'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Globe size={16} />
                English
              </button>
            </div>
          </div>

          {questionData.map((item, index) => {
            const correctAnswer = getCorrectAnswer(item)
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border"
              >
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        Question {index + 1}
                      </span>
                      {item.test_category_title && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                          {item.test_category_title}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getQuestionText(item)}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setMarkedData(item)
                      setShowDeleteAlert(true)
                    }}
                    className="ml-4 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex-shrink-0"
                  >
                    {btnLoadingId === item.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <BookmarkCheck size={18} />
                    )}
                  </button>
                </div>

                {/* Options */}
                <div className="space-y-2 mb-4">
                  {['option_1', 'option_2', 'option_3', 'option_4'].map((opt, idx) => {
                    const optionLabel = String.fromCharCode(65 + idx) // A, B, C, D
                    const isCorrect = correctAnswer.toUpperCase() === optionLabel
                    
                    return (
                      <div
                        key={opt}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                          isCorrect 
                            ? 'bg-green-50 border-green-300 ring-2 ring-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 mt-0.5">
                          {isCorrect ? (
                            <CheckCircle className="text-green-600" size={24} />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                              {optionLabel}
                            </div>
                          )}
                        </div>
                        <span 
                          className={`flex-1 ${
                            isCorrect ? 'text-green-900 font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {getOptionText(item, opt)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                {getExplanation(item) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 bg-blue-500 rounded-full">
                        <CheckCircle className="text-white" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900 mb-1">
                          {language === 'hindi' ? 'व्याख्या:' : 'Explanation:'}
                        </p>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          {getExplanation(item)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {showDeleteAlert && markedData?.id === item.id && (
                  <GlobleAlert
                    type="confirm"
                    message="Remove this question from bookmarks?"
                    onConfirm={handleRemoveBookmark}
                    onCancel={() => setShowDeleteAlert(false)}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh]">
          <NotFoundData message="No questions saved yet" />
        </div>
      )}
    </div>
  )
}

export default QuestionCollection
