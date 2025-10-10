import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Flag, Clock, CheckCircle, XCircle, Loader2, Calendar, Globe } from 'lucide-react'
import Loading from '../globle/Loading'
import NotFoundData from '../globle/NotFoundData'
import { reportedQuestionGetSlice } from '../../redux/authSlice'

const ReportCollection = () => {
  const dispatch = useDispatch()
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('hindi') // ✅ Language state

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        const res = await dispatch(reportedQuestionGetSlice()).unwrap()
        
        if (res.status_code === 200 && res.data) {
          setReportData(res.data || [])
        } else {
          setReportData([])
        }
      } catch (error) {
        console.error('Error fetching reports:', error)
        setReportData([])
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [dispatch])

  // ✅ Get question text based on language
  const getQuestionText = (item) => {
    return language === 'hindi' ? item.question_hindi : item.question_english
  }

  // ✅ Get explanation based on language
  const getExplanation = (item) => {
    return language === 'hindi' ? item.explanation : item.explanation_english
  }

  // ✅ Get correct answer
  const getCorrectAnswer = (item) => {
    return language === 'hindi' ? item.hindi_ans : item.english_ans
  }

  // ✅ Get option text
  const getOptionText = (item, optionKey) => {
    const optionMap = {
      'A': language === 'hindi' ? 'option_hindi_a' : 'option_english_a',
      'B': language === 'hindi' ? 'option_hindi_b' : 'option_english_b',
      'C': language === 'hindi' ? 'option_hindi_c' : 'option_english_c',
      'D': language === 'hindi' ? 'option_hindi_d' : 'option_english_d',
    }
    return item[optionMap[optionKey]] || ''
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock size={16} />,
        label: 'Pending'
      },
      resolved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle size={16} />,
        label: 'Resolved'
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle size={16} />,
        label: 'Rejected'
      },
      'in-progress': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Loader2 size={16} className="animate-spin" />,
        label: 'In Progress'
      }
    }

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending

    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
        {config.icon}
        <span className="text-sm font-semibold">{config.label}</span>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    // Handle YYYY-MM-DD format from API
    if (dateString.includes('T')) {
      dateString = dateString.split('T')[0]
    }
    
    const parts = dateString.split('-')
    if (parts[0].length === 4) {
      // YYYY-MM-DD format
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    
    return dateString
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {reportData.length > 0 ? (
        <div className="space-y-4 max-w-6xl mx-auto">
          {/* Header with Language Toggle */}
          <div className="mb-6 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Flag className="text-red-600" size={28} />
                  Your Reported Questions
                </h2>
                <p className="text-gray-600">
                  Track all your reported questions and their resolution status
                </p>
              </div>

              {/* ✅ Language Toggle */}
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

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-gray-100 rounded-full font-semibold">
                Total Reports: {reportData.length}
              </span>
            </div>
          </div>

          {/* Report Cards */}
          {reportData.map((item, index) => {
            const correctAns = getCorrectAnswer(item)
            
            return (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-200"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Flag className="text-red-600" size={24} />
                    </div>
                    <div className="flex-1">
                      {/* Question ID & Date */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-gray-500">
                          Question ID: #{item.id}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(item.created_at)}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {getQuestionText(item)}
                      </h3>

                      {/* Options */}
                      <div className="space-y-2 mb-3">
                        {['A', 'B', 'C', 'D'].map((optKey) => {
                          const isCorrect = correctAns?.toUpperCase() === optKey
                          
                          return (
                            <div
                              key={optKey}
                              className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                                isCorrect 
                                  ? 'bg-green-50 border-green-300' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 mt-0.5">
                                {isCorrect ? (
                                  <CheckCircle className="text-green-600" size={20} />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                    {optKey}
                                  </div>
                                )}
                              </div>
                              <span className={`flex-1 text-sm ${
                                isCorrect ? 'text-green-900 font-semibold' : 'text-gray-700'
                              }`}>
                                {getOptionText(item, optKey)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(item.report_status || 'pending')}
                </div>

                {/* Report Reason */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-4 mb-3">
                  <p className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <Flag size={14} className="text-red-600" />
                    Your Report:
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.reason || 'No reason provided'}
                  </p>
                </div>

                {/* Explanation */}
                {getExplanation(item) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4">
                    <p className="text-sm font-bold text-blue-900 mb-1">
                      {language === 'hindi' ? 'व्याख्या:' : 'Explanation:'}
                    </p>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {getExplanation(item)}
                    </p>
                  </div>
                )}

                {/* Admin Response (if available) */}
                {item.admin_response && (
                  <div className="mt-3 bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                    <p className="text-sm font-bold text-green-800 mb-1">Admin Response:</p>
                    <p className="text-sm text-green-700">{item.admin_response}</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🚩</div>
            <NotFoundData message="No reported questions yet" />
            <p className="text-gray-500 mt-2 text-sm">
              When you report questions during tests, they will appear here
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportCollection
