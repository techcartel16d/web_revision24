// import React, { useEffect, useState } from 'react'
// import TestPackageCollection from '../components/savecollection/TestPackageCollection'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css'
// import 'swiper/css/free-mode'

// import { FreeMode } from 'swiper/modules'

// const MySavedCollectionPage = () => {
//   const [selectedItems, setSelectedItems] = useState('')
//   const [bookmarkedIds, setBookmarkedIds] = useState([]);

//   const SaveCollectionsItem = [
//     "Test Series",
//     "Question",
//     "News",
//     "Study",
//     "Video",
//     "Report"
//   ]

//   useEffect(() => {
//     setSelectedItems(SaveCollectionsItem[0])
//   }, [])

//   return (
//     <div>


//       <div className="p-4 border-b">
     
//         <Swiper
//           slidesPerView={1}
//           spaceBetween={1}
//           freeMode={true}
//           breakpoints={{
//             0: { slidesPerView: 1 },      // ✅ mobile & tablet
//             1024: { slidesPerView: 5 }    // ✅ desktop
//           }}
//           modules={[FreeMode]}
//         >
//           {SaveCollectionsItem.map((item, index) => (
//             <SwiperSlide className='py-2 px-2 ' onClick={() => setSelectedItems(item)} key={index}>
//               <div className={`text-center rounded-md py-2 px-2 shadow cursor-pointer ${selectedItems == item ? 'bg-blue-600 text-white' : 'bg-gray-100'} transition`}>
//                 <p className="text-xs sm:text-sm md:text-base lg:text-xs font-normal">
//                   {item}
//                 </p>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>

    
//       </div>

//       {
//         selectedItems === "Save-Packages" ? (

//           <TestPackageCollection />
//         ) : (
//           <div className="flex items-center justify-center h-screen">
//             <h3>You haven't saved anything yet!</h3>
//           </div>

//         )
//       }

//     </div>
//   )
// }

// export default MySavedCollectionPage

import React, { useEffect, useState } from 'react'
import { getUserCollectionDetailSlice } from '../redux/HomeSlice';
import { useDispatch } from 'react-redux';
import TestPackageCollection from '../components/savecollection/TestPackageCollection'
import NewsCollection from '../components/savecollection/NewsCollection'
import VideoCollection from '../components/savecollection/VideoCollection'
import QuestionCollection from '../components/savecollection/QuestionCollection'
import StudyCollection from '../components/savecollection/StudyCollection'
import ReportCollection from '../components/savecollection/ReportCollection' // ✅ NEW
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import { FreeMode } from 'swiper/modules'
import Loading from '../components/globle/Loading'
import { motion } from 'framer-motion'

const MySavedCollectionPage = () => {
  const dispatch = useDispatch()
  const [selectedItems, setSelectedItems] = useState('Test Series')
  const [collectionData, setCollectionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        setLoading(true)
        const res = await dispatch(getUserCollectionDetailSlice()).unwrap()
        if (res.status_code === 200) {
          setCollectionData(res.data)
        }
      } catch (error) {
        console.error('Error fetching collection:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollectionData()
  }, [dispatch])

  const SaveCollectionsItem = [
    { label: "Test Series", count: collectionData?.package_id?.count || 0, key: "package_id", icon: "🎯" },
    { label: "Question", count: collectionData?.question_id?.count || 0, key: "question_id", icon: "❓" },
    { label: "News", count: collectionData?.news_id?.count || 0, key: "news_id", icon: "📰" },
    { label: "Study", count: collectionData?.study_note_id?.count || 0, key: "study_note_id", icon: "📚" },
    { label: "Video", count: collectionData?.video_id?.count || 0, key: "video_id", icon: "🎬" },
    { label: "Report", count: 0, key: "report", icon: "🚩" }, // ✅ NEW - Report tab
  ]

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Tab Navigation */}
      <div className="bg-white border-b shadow-lg sticky top-0 z-20 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <Swiper
            slidesPerView={1}
            spaceBetween={12}
            freeMode={true}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 8 },
              640: { slidesPerView: 3, spaceBetween: 12 },
              768: { slidesPerView: 4, spaceBetween: 14 },
              1024: { slidesPerView: 6, spaceBetween: 16 } // ✅ Changed to 6 for Report tab
            }}
            modules={[FreeMode]}
            className="collection-tabs-enhanced"
          >
            {SaveCollectionsItem.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedItems(item.label)}
                  className={`
                    w-full text-center rounded-2xl py-4 px-5 font-bold transition-all duration-300 shadow-md relative overflow-hidden
                    ${selectedItems === item.label 
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl ring-4 ring-blue-300/50' 
                      : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 border-2 border-gray-200 hover:border-blue-300'
                    }
                  `}
                >
                  {/* Background Animation */}
                  {selectedItems === item.label && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  )}

                  {/* Icon */}
                  <div className="text-2xl mb-1">{item.icon}</div>

                  {/* Label */}
                  <p className={`text-base font-extrabold tracking-wide relative z-10 ${
                    selectedItems === item.label ? 'text-white' : 'text-gray-800'
                  }`}>
                    {item.label}
                  </p>

                  {/* Enhanced Count Badge */}
                  {item.count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className={`
                        absolute top-2 right-2 min-w-[28px] h-7 px-2 rounded-full flex items-center justify-center text-sm font-black shadow-lg
                        ${selectedItems === item.label 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 ring-4 ring-white/30 animate-pulse' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ring-2 ring-white'
                        }
                      `}
                    >
                      {item.count}
                    </motion.span>
                  )}

                  {/* Selection Indicator */}
                  {selectedItems === item.label && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        {selectedItems === "Test Series" && <TestPackageCollection />}
        {selectedItems === "News" && <NewsCollection />}
        {selectedItems === "Video" && <VideoCollection />}
        {selectedItems === "Question" && <QuestionCollection />}
        {selectedItems === "Study" && <StudyCollection />}
        {selectedItems === "Report" && <ReportCollection />} {/* ✅ NEW */}
      </div>

      {/* Enhanced CSS */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .collection-tabs-enhanced .swiper-slide {
          height: auto;
        }

        .collection-tabs-enhanced {
          padding: 4px 0;
        }
      `}</style>
    </div>
  )
}

export default MySavedCollectionPage

