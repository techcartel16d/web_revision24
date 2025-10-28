// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { useDispatch } from "react-redux";
// import { getAllPreviouseYearDataSlice } from "../../redux/freeTestSlice";
// import Loading from "../../components/globle/Loading";
// import { getUserDataDecrypted } from "../../helpers/userStorage";
// import { secureGetTestData } from "../../helpers/testStorage";
// import { formatStartDateTime, isQuizStartAvailable } from "../../helpers/checkTestStartDate";
// import { useNavigate } from "react-router-dom";
// import { secureGet } from "../../helpers/storeValues";
// import ResumeTestModal from "../../components/ResumeTestModal";


// const PreviousYearTestSeries = () => {

//     const nav = useNavigate()
//     const dispatch = useDispatch()
//     const [years, setYears] = useState([])
//     const [userInfo, setUserInfo] = useState({});
//     const [activeYear, setActiveYear] = useState('');
//     const [activeCategory, setActiveCategory] = useState('');
//     const [loading, setLoading] = useState(false)
//     const [previous_year_exam, setPreviousYearExam] = useState(null)
//     const [subscribe, setSubscribe] = useState(false);
//     const [pauseStatusArray, setPauseStatusArray] = useState([]);
//     const loadUserData = async () => {
//         const user = await getUserDataDecrypted();
//         // console.log("user infon print ", user)
//         setSubscribe(user.subscription_status)

//     };
//     const [resumeData, setResumeData] = useState({})
//     const [showModal, setShowModal] = useState(false);

//     const getPreviouseDataFromLocal = async () => {
//         const previous = JSON.parse(await secureGet("previouseYearTest"))
//         console.log('Privious Exam Data', previous);
//         setPreviousYearExam(previous)
//     }

//     useEffect(() => {
//         getPreviouseDataFromLocal()
//         loadUserData();
//     }, []);



//     useEffect(() => {
//         const loadPauseStatus = async () => {
//             // await clearAllEncryptedTestData()
//             // return
//             try {
//                 const data = await secureGetTestData('pause_status', 'pause_status_array');
//                 // console.log("🔐 Encrypted pause_status_array:", data);
//                 setPauseStatusArray(data || []);
//             } catch (error) {
//                 // console.error("❌ Failed to load pause status:", error);
//                 setPauseStatusArray([]);
//             }
//         };

//         loadPauseStatus();
//     }, []);

//     const examCategory = [
//         "SSC CGL - Graduation Level",
//         "SSC CHSL - 12th Level"
//     ]



//     const getPreviouseExam = async (page = 1) => {
//         setLoading(true);
//         try {
//             const res = await dispatch(getAllPreviouseYearDataSlice(page)).unwrap();
//             // console.log(res)
//             if (res.status_code == 200) {
//                 let years = Object.keys(res.data);
//                 setYears(years);
//                 setActiveCategory(examCategory[0])
//                 setPreviousYearExam(res.data);
//                 // console.log("res.data", res.data)

//                 // Set first active year
//                 setActiveYear(years[0]);

//                 // Extract pagination info for all years
//                 const paginationByYear = {};
//                 years.forEach((year) => {
//                     const yearData = res.data[year];
//                     paginationByYear[year] = {
//                         currentPage: yearData.current_page,
//                         lastPage: yearData.last_page,
//                         nextPageUrl: yearData.next_page_url,
//                         prevPageUrl: yearData.prev_page_url,
//                         total: yearData.total
//                     };
//                 });

//                 // console.log("Pagination Info by Year:", paginationByYear);
//             }
//         } catch (error) {
//             console.log("ERROR IN FETCH PREVIOUSE EXAM", error);
//         } finally {
//             setLoading(false);
//         }
//     };


//     useEffect(() => {
//         getPreviouseExam()
//     }, [])


//     const getUserInfo = async () => {
//         const userData = await getUserDataDecrypted("user");
//         // console.log(userData)
//         // const parsedUser = JSON.parse(strUser) || {};
//         setUserInfo(userData);


//     };

//     useEffect(() => {
//         getUserInfo();
//     }, []);

//     const handleResume = async () => {
//         // console.log("hello")
//         nav('/previous-test', { state: { testInfo: resumeData } })

//     }





//     return (
//         <div className="p-4">
//             {
//                 loading ? (
//                     <Loading />
//                 ) : (
//                     <>
//                         <div className="sticky top-0 z-20 bg-white py-4">
//                             <Swiper slidesPerView="auto" spaceBetween={12} className="mb-4">
//                                 {examCategory.map((cat) => (
//                                     <SwiperSlide key={cat} style={{ width: "auto" }}>
//                                         <button
//                                             onClick={() => setActiveCategory(cat)}
//                                             className={`px-6 py-2 rounded-lg font-semibold transition ${activeCategory == cat
//                                                 ? "bg-blue-600 text-white"
//                                                 : "bg-gray-100 text-gray-700"
//                                                 }`}
//                                         >
//                                             {cat}
//                                         </button>
//                                     </SwiperSlide>
//                                 ))}
//                             </Swiper>
//                         </div>
//                         <div className="sticky top-0 z-20 bg-white py-4">
//                             <Swiper slidesPerView="auto" spaceBetween={12} className="mb-4">
//                                 {years.map((year) => (
//                                     <SwiperSlide key={year} style={{ width: "auto" }}>
//                                         <button
//                                             onClick={() => setActiveYear(year)}
//                                             className={`px-6 py-2 rounded-lg font-semibold transition ${activeYear === year
//                                                 ? "bg-blue-600 text-white"
//                                                 : "bg-gray-100 text-gray-700"
//                                                 }`}
//                                         >
//                                             {year}
//                                         </button>
//                                     </SwiperSlide>
//                                 ))}
//                             </Swiper>
//                         </div>
//                         {/* Cards */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

//                             {previous_year_exam && previous_year_exam[activeYear]?.map((exam) => {
//                                 // console.log(exam)
//                                 const isPaused = pauseStatusArray.some(item => item.test_id === exam.id && item.isPaused);
//                                 const bg = exam.exam_type === 'free' ? "#" : '#fff'
//                                 const text = exam.exam_type === 'free' ? "#fff" : '#000'
//                                 return (
//                                     <div key={exam.id} className={exam.exam_type === 'free' ? `bg-gradient-to-b from-[#00C950] via-[#4dff88] to-[#b3ffcc] p-4 rounded-xl relative border overflow-hidden  border-gray-200 shadow-sm hover:shadow-md transition` : `p-4 rounded-xl relative border overflow-hidden bg-white border-gray-200 shadow-sm hover:shadow-md transition`}>
//                                         {
//                                             exam.status == "inactive" && (
//                                                 <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.6)] w-full h-full">  </div>

//                                             )

//                                         }
//                                         <p style={{
//                                             color: text
//                                         }} className="text-sm font-bold uppercase mb-1">
//                                             {exam.exam_type}
//                                         </p>
//                                         <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>

//                                         <div className="space-y-1 text-sm text-gray-600">
//                                             <p>⏱ Duration: {exam.duration} min</p>
//                                             <p>❓ Total Questions: {exam.total_question}</p>
//                                             <p>📝 Total Marks: {exam.total_question * exam.marks_per_question}</p>
//                                         </div>

//                                         {
//                                             subscribe ? (
//                                                 exam.attend_status === '' && isPaused ? (
//                                                     // ✅ Show Resume if paused and not started yet
//                                                     <button
//                                                         onClick={() => {
//                                                             setShowModal(true);
//                                                             setResumeData(exam);
//                                                         }}
//                                                         className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-500 text-white"
//                                                     >
//                                                         Resume
//                                                     </button>
//                                                 ) : (
//                                                     // ✅ Show Start if test is available and not attempted
//                                                     isQuizStartAvailable(exam.start_date_time) &&
//                                                         !exam.attend &&
//                                                         !isPaused &&
//                                                         exam.attend_status === '' ? (
//                                                         <button
//                                                             onClick={() => nav('/previous-instruction', { state: { testInfo: exam } })}
//                                                             className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-blue-500 text-white"
//                                                         >
//                                                             Start
//                                                         </button>
//                                                     ) : (
//                                                         // ✅ Show Result if test is completed
//                                                         exam.attend && exam.attend_status === 'done' ? (
//                                                             <button
//                                                                 onClick={() =>
//                                                                     nav('/previous-analysis', {
//                                                                         state: {
//                                                                             testId: exam.id,
//                                                                             testInfo: exam,
//                                                                             userData: userInfo,
//                                                                         },
//                                                                     })
//                                                                 }
//                                                                 className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-yellow-500 text-white"
//                                                             >
//                                                                 Result
//                                                             </button>
//                                                         ) : (
//                                                             // ✅ Show Available On button if not available yet
//                                                             <button
//                                                                 onClick={() => setShowAlert(true)}
//                                                                 className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-300"
//                                                             >
//                                                                 Available on {formatStartDateTime(exam.start_date_time)}
//                                                             </button>
//                                                         )
//                                                     )
//                                                 )
//                                             ) : !subscribe && exam.exam_type === 'free' ? (
//                                                 exam.attend_status === '' && isPaused ? (
//                                                     // ✅ Show Resume if paused and not started yet
//                                                     <button
//                                                         onClick={() => {
//                                                             setShowModal(true);
//                                                             setResumeData(test);
//                                                         }}
//                                                         className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-500 text-white"
//                                                     >
//                                                         Resume
//                                                     </button>
//                                                 ) : (
//                                                     // ✅ Show Start if test is available and not attempted
//                                                     isQuizStartAvailable(exam.start_date_time) &&
//                                                         !exam.attend &&
//                                                         !isPaused &&
//                                                         exam.attend_status === '' ? (
//                                                         <button
//                                                             onClick={() => nav('/previous-instruction', { state: { testInfo: exam } })}
//                                                             className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-blue-500 text-white"
//                                                         >
//                                                             Start
//                                                         </button>
//                                                     ) : (
//                                                         // ✅ Show Result if test is completed
//                                                         exam.attend && exam.attend_status === 'done' ? (
//                                                             <button
//                                                                 onClick={() =>
//                                                                     nav('/analysis', {
//                                                                         state: {
//                                                                             testId: exam.id,
//                                                                             testInfo: exam,
//                                                                             userData: userInfo,
//                                                                         },
//                                                                     })
//                                                                 }
//                                                                 className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-yellow-500 text-white"
//                                                             >
//                                                                 Result
//                                                             </button>
//                                                         ) : (
//                                                             // ✅ Show Available On button if not available yet
//                                                             <button
//                                                                 onClick={() => {

//                                                                     setShowAlert(true)
//                                                                     setMessage("Not Available at this time")
//                                                                 }

//                                                                 }
//                                                                 className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-300"
//                                                             >
//                                                                 Available on {formatStartDateTime(exam.start_date_time)}
//                                                             </button>
//                                                         )
//                                                     )
//                                                 )
//                                             ) : (
//                                                 // ✅ Show Buy Now if not subscribed
//                                                 <button
//                                                     onClick={() => {
//                                                         nav("/subscription")
//                                                     }}
//                                                     className="px-6 py-1.5 cursor-pointer text-white rounded font-semibold text-sm bg-blue-600"
//                                                 >
//                                                     Attempt Now
//                                                 </button>
//                                             )
//                                         }

//                                     </div>
//                                 )
//                             }

//                             )}
//                         </div>
//                     </>
//                 )
//             }
//             {/* Horizontal Year Tabs */}
//             <ResumeTestModal
//                 show={showModal}
//                 onClose={() => setShowModal(false)}
//                 onConfirm={handleResume}
//             />

//         </div>
//     );
// };

// export default PreviousYearTestSeries;


import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useDispatch } from "react-redux";
import { getAllPreviouseYearDataSlice } from "../../redux/freeTestSlice";
import Loading from "../../components/globle/Loading";
import { getUserDataDecrypted } from "../../helpers/userStorage";
import { secureGetTestData } from "../../helpers/testStorage";
import { formatStartDateTime, isQuizStartAvailable } from "../../helpers/checkTestStartDate";
import { useNavigate } from "react-router-dom";
import { secureGet } from "../../helpers/storeValues";
import ResumeTestModal from "../../components/ResumeTestModal";

const PreviousYearTestSeries = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();

    // States
    const [allData, setAllData] = useState([]); // Complete API response
    const [categories, setCategories] = useState([]); // Categories array
    const [activeCategory, setActiveCategory] = useState(null); // Selected category object
    const [years, setYears] = useState([]); // Years for active category
    const [activeYear, setActiveYear] = useState(null); // Selected year object
    const [tests, setTests] = useState([]); // Tests for active year

    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [subscribe, setSubscribe] = useState(false);
    const [pauseStatusArray, setPauseStatusArray] = useState([]);
    const [resumeData, setResumeData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");

    // Load user data
    const loadUserData = async () => {
        const user = await getUserDataDecrypted();
        setUserInfo(user);
        setSubscribe(user?.subscription_status || false);
    };

    // Load pause status
    useEffect(() => {
        const loadPauseStatus = async () => {
            try {
                const data = await secureGetTestData('pause_status', 'pause_status_array');
                setPauseStatusArray(data || []);
            } catch (error) {
                console.error("❌ Failed to load pause status:", error);
                setPauseStatusArray([]);
            }
        };
        loadPauseStatus();
    }, []);

    // Fetch previous year exams
    const getPreviousExam = async (page = 1) => {
        setLoading(true);
        try {
            const res = await dispatch(getAllPreviouseYearDataSlice(page)).unwrap();
            console.log('📊 API Response:', res);

            if (res.status_code === 200 && res.data) {
                const apiData = res.data;
                setAllData(apiData);

                // ✅ Set categories
                setCategories(apiData);

                // ✅ Set first category as active
                if (apiData.length > 0) {
                    const firstCategory = apiData[0];
                    setActiveCategory(firstCategory);

                    // ✅ Set years for first category
                    if (firstCategory.years && firstCategory.years.length > 0) {
                        setYears(firstCategory.years);

                        // ✅ Set first year as active
                        const firstYear = firstCategory.years[0];
                        setActiveYear(firstYear);

                        // ✅ Set tests for first year
                        setTests(firstYear.tests || []);
                    }
                }

                console.log('✅ Data loaded successfully');
            }
        } catch (error) {
            console.error("❌ ERROR IN FETCH PREVIOUS EXAM:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
        getPreviousExam();
    }, []);

    // ✅ Handle category change
    const handleCategoryChange = (category) => {
        console.log('📂 Category changed to:', category.category_title);
        setActiveCategory(category);

        // Update years for selected category
        if (category.years && category.years.length > 0) {
            setYears(category.years);

            // Set first year of this category as active
            const firstYear = category.years[0];
            setActiveYear(firstYear);
            setTests(firstYear.tests || []);
        } else {
            setYears([]);
            setActiveYear(null);
            setTests([]);
        }
    };

    // ✅ Handle year change
    const handleYearChange = (yearObj) => {
        console.log('📅 Year changed to:', yearObj.year);
        setActiveYear(yearObj);
        setTests(yearObj.tests || []);
    };

    const handleResume = async () => {
        nav('/previous-test', { state: { testInfo: resumeData } });
    };

    return (
        <div className="p-4">
            {loading ? (
                <Loading />
            ) : (
                <>
                    {/* ✅ Category Tabs */}
                    <div className="sticky top-0 z-20 bg-white py-4">
                        <Swiper slidesPerView="auto" spaceBetween={12} className="mb-4">
                            {categories.map((category) => (
                                <SwiperSlide key={category.category_id} style={{ width: "auto" }}>
                                    <button
                                        onClick={() => handleCategoryChange(category)}
                                        className={`px-6 py-2 rounded-lg font-semibold transition ${activeCategory?.category_id === category.category_id
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {category.category_title}
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* ✅ Year Tabs */}
                    <div className="sticky top-16 z-20 bg-white py-4">
                        <Swiper slidesPerView="auto" spaceBetween={12} className="mb-4">
                            {years.map((yearObj) => (
                                <SwiperSlide key={yearObj.year} style={{ width: "auto" }}>
                                    <button
                                        onClick={() => handleYearChange(yearObj)}
                                        className={`px-6 py-2 rounded-lg font-semibold transition ${activeYear?.year === yearObj.year
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {yearObj.year}
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* ✅ Test Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {tests.length > 0 ? (
                            tests.map((exam) => {
                                const isPaused = pauseStatusArray.some(
                                    (item) => item.test_id === exam.id && item.isPaused
                                );

                                return (
                                    <div
                                        key={exam.id}
                                        className={`${exam.exam_type === "free"
                                                ? "bg-gradient-to-b from-[#00C950] via-[#4dff88] to-[#b3ffcc]"
                                                : "bg-white"
                                            } p-4 rounded-xl relative border overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition`}
                                    >
                                        {exam.status === "inactive" && (
                                            <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.6)] w-full h-full"></div>
                                        )}

                                        <p
                                            className={`text-sm font-bold uppercase mb-1 ${exam.exam_type === "free" ? "text-white" : "text-gray-700"
                                                }`}
                                        >
                                            {exam.exam_type}
                                        </p>
                                        <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>⏱ Duration: {exam.duration} min</p>
                                            <p>❓ Total Questions: {exam.total_question}</p>
                                            <p>📝 Total Marks: {exam.total_question * exam.marks_per_question}</p>
                                        </div>

                                        {/* ✅ Button Logic */}
                                        {subscribe ? (
                                            exam.attend_status === "" && isPaused ? (
                                                <button
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setResumeData(exam);
                                                    }}
                                                    className="mt-3 w-full px-6 py-2 cursor-pointer rounded font-semibold text-sm bg-gray-500 text-white hover:bg-gray-600"
                                                >
                                                    Resume
                                                </button>
                                            ) : isQuizStartAvailable(exam.start_date_time) &&
                                                !exam.attend &&
                                                !isPaused &&
                                                exam.attend_status === "" ? (
                                                <button
                                                    onClick={() =>
                                                        nav("/previous-instruction", { state: { testInfo: exam } })
                                                    }
                                                    className="mt-3 w-full px-6 py-2 cursor-pointer rounded font-semibold text-sm bg-blue-500 text-white hover:bg-blue-600"
                                                >
                                                    Start
                                                </button>
                                            ) : exam.attend && exam.attend_status === "done" ? (
                                                <button
                                                    onClick={() =>
                                                        nav("/previous-analysis", {
                                                            state: {
                                                                testId: exam.id,
                                                                testInfo: exam,
                                                                userData: userInfo,
                                                            },
                                                        })
                                                    }
                                                    className="mt-3 w-full px-6 py-2 cursor-pointer rounded font-semibold text-sm bg-yellow-500 text-white hover:bg-yellow-600"
                                                >
                                                    Result
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="mt-3 w-full px-6 py-2 cursor-not-allowed rounded font-semibold text-sm bg-gray-300 text-gray-600"
                                                >
                                                    Available on {formatStartDateTime(exam.start_date_time)}
                                                </button>
                                            )
                                        ) : !subscribe && exam.exam_type === "free" ? (
                                            exam.attend_status === "" && isPaused ? (
                                                <button
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setResumeData(exam);
                                                    }}
                                                    className="mt-3 w-full px-6 py-2 cursor-pointer rounded font-semibold text-sm bg-gray-500 text-white hover:bg-gray-600"
                                                >
                                                    Resume
                                                </button>
                                            ) : isQuizStartAvailable(exam.start_date_time) &&
                                                !exam.attend &&
                                                !isPaused &&
                                                exam.attend_status === "" ? (
                                                <button
                                                    onClick={() =>
                                                        nav("/previous-instruction", { state: { testInfo: exam } })
                                                    }
                                                    className="mt-3 w-full px-6 py-2 cursor-pointer rounded font-semibold text-sm bg-blue-500 text-white hover:bg-blue-600"
                                                >
                                                    Start
                                                </button>
                                            ) : exam.attend && exam.attend_status === "done" ? (
                                                <button
                                                    onClick={() =>
                                                        nav("/previous-analysis", {
                                                            state: {
                                                                testId: exam.id,
                                                                testInfo: exam,
                                                                userData: userInfo,
                                                            },
                                                        })
                                                    }
                                                    className="mt-3 w-full px-6 py-2 cursor-pointer rounded font-semibold text-sm bg-yellow-500 text-white hover:bg-yellow-600"
                                                >
                                                    Result
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setShowAlert(true);
                                                        setMessage("Not Available at this time");
                                                    }}
                                                    disabled
                                                    className="mt-3 w-full px-6 py-2 cursor-not-allowed rounded font-semibold text-sm bg-gray-300 text-gray-600"
                                                >
                                                    Available on {formatStartDateTime(exam.start_date_time)}
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                onClick={() => nav("/subscription")}
                                                className="mt-3 w-full px-6 py-2 cursor-pointer text-white rounded font-semibold text-sm bg-blue-600 hover:bg-blue-700"
                                            >
                                                Buy Subscription
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No tests available for this year
                            </div>
                        )}
                    </div>
                </>
            )}

            <ResumeTestModal show={showModal} onClose={() => setShowModal(false)} onConfirm={handleResume} />
        </div>
    );
};

export default PreviousYearTestSeries;
