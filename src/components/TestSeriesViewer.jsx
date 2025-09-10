import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineGTranslate } from 'react-icons/md';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';
import { Bookmark, BookmarkCheck, PlusSquare } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { getUserCollectionDetailSlice, removeUserCollectionSlice, saveCollectionSlice } from '../redux/HomeSlice';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';
import { toggleBookmark } from '../helpers/Add_RemoveBookmark';

const TestSeriesViewer = ({ testSeriesData, category }) => {
  // console.log("testSeriesData", testSeriesData)

  const nav = useNavigate();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [packageIds, setPackageIds] = useState([])
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  // const addBookmarkedPackage = async () => {
  //   const collection = {
  //     video_id: [],
  //     lession_id: [],
  //     class_note_id: [],
  //     study_note_id: [],
  //     article_id: [],
  //     news_id: [],
  //     question_id: [],
  //     test_series_id: [],
  //     package_id: []
  //   };
  //   setLoading(true)
  //   try {
  //     const res = await dispatch(saveCollectionSlice(collection)).unwrap();
  //     if (res.status_code == 200) {
  //       showSuccessToast(res.message)
  //     } else {
  //       showErrorToast(res.message)
  //     }

  //   } catch (error) {
  //     showErrorToast(error.message)

  //   } finally {
  //     setLoading(false)
  //   }
  // }


  // const collectPackageIds = () => {

  // }


  const fetchBookMarkTestSeries = async () => {
    try {
      const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
      // console.log("book mark test series fetch", res);

      if (res.status_code == 200) {
        // showSuccessToast(res.message)
        // Toast.show({
        //     text1: res.message || "Bookmarks fetched",
        //     type: 'success',
        //     position: 'bottom'
        // });

        const dataArray = Array.isArray(res.data.package_id?.data)
          ? res.data.package_id.data
          : [];

        const ids = dataArray.map(item => item.id); // extract only IDs
        // console.log(ids)

        // console.log("Extracted IDs:", ids);
        setBookmarkedIds(ids);
      } else {
        //  showSuccessToast(res.message)
        // Toast.show({
        //     text1: "No bookmarks found",
        //     type: 'info',
        //     position: 'bottom'
        // });
      }
    } catch (error) {
      console.error("Bookmark fetch error", error);
    //  showErrorToast()
    }
  };


  useEffect(() => {
    fetchBookMarkTestSeries(); // just fetch bookmarks once on load
  }, []);



  if (!Array.isArray(category) || category.length === 0) {
    return <p className="text-gray-600 p-4">No categories available to show test series.</p>;
  }

  return (
    <div className="p-6 bg-gray-50" id="testseries">
      {category.map((cat) => {
        const series = testSeriesData?.[cat.title] || [];
        // console.log(cat)

        if (series.length === 0) return null; // Skip if no test series

        return (
          <div key={cat.id} className="mb-10">
            <div className='flex items-center flex-col justify-center mb-6 gap-0'>

              <div className='flex items-center justify-center gap-2'>
                <img className='h-8 w-8 rounded-sm' src={cat.icon} />
                <h2 className="text-xl font-semibold">{cat.title}</h2>
              </div>
              <div>
                <span className=' px-2  text-slate-800 text-xs border-r-2 '>Free {cat.free}</span>
                <span className=' px-2  text-slate-800 text-xs border-r-2 ' >Paid {cat.paid}</span>
                <span className=' px-2  text-slate-800 text-xs ' >Total {cat.totalSeries}</span>
              </div>
            </div>


            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}      // gap between slides
              slidesPerView={1}      // default for mobile
              navigation
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }, // matches your original lg:grid-cols-4
              }}
            >
              {series.map((item, index) => (
                <SwiperSlide key={index}>
                  <div

                    className="bg-white rounded-xl shadow hover:shadow-lg transition border cursor-pointer overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-white to-blue-100 px-4 py-3 relative">
                      <img
                        src={item.logo || '/logo.jpeg'}
                        alt="Logo"
                        className="w-16 h-16 object-contain"
                      />
                      <span className="absolute top-3 right-3 bg-white text-yellow-500 text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                        ⚡
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                        {item.title || 'Mock Test Series'}
                      </h3>

                      <p className="text-sm text-gray-600 mb-1">
                        {item.total_assign_test || 0} Total Tests
                      </p>

                      <p className="text-xs text-blue-600 flex items-center gap-2">
                        <MdOutlineGTranslate className="text-xl" />
                        {item.language || 'English, Hindi'}
                      </p>

                      <ul className="text-sm text-gray-700 space-y-1 mb-4 mt-2">
                        {item.live_tests && <li>• {item.live_tests} 🔴 AI-Generated Live Tests</li>}
                        {item.ai_tests && <li>• {item.ai_tests} AI Tests</li>}
                        {item.previous_papers && <li>• {item.previous_papers} SSC PYQs</li>}
                        {item.more_tests && (
                          <li className="text-green-600 font-medium">
                            +{item.more_tests} more tests
                          </li>
                        )}
                      </ul>
                      <div className='flex gap-1.5 items-center justify-center'>

                        <button onClick={() => nav('/testpakages', { state: { item, testId: item.id } })} className="w-[80%] bg-cyan-500 hover:bg-cyan-600 text-white py-2 text-sm rounded-sm font-semibold cursor-pointer">
                          View Test Series
                        </button>

                        <button onClick={() =>
                          toggleBookmark({
                            type: 'package_id',
                            id: item.id,
                            bookmarkedIds,
                            setBookmarkedIds,
                            dispatch,
                            saveCollectionSlice,
                            removeUserCollectionSlice
                          })
                        } className="w-[15%] border bg-cyan-500 border-white text-white py-1 text-sm rounded-sm flex items-center justify-center cursor-pointer">
                          {
                            bookmarkedIds.includes(item.id) ? <BookmarkCheck /> : <Bookmark className='text-xs' />
                          }
                         
                          
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        );
      })}
    </div>
  );
};

export default TestSeriesViewer;
