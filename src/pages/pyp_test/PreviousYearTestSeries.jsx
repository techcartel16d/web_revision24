import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useDispatch } from "react-redux";
import { getAllPreviouseYearDataSlice } from "../../redux/freeTestSlice";
import Loading from "../../components/globle/Loading";
import { getUserDataDecrypted } from "../../helpers/userStorage";
import { secureGetTestData } from "../../helpers/testStorage";
import { isQuizStartAvailable } from "../../helpers/checkTestStartDate";
import { useNavigate } from "react-router-dom";
import { secureGet } from "../../helpers/storeValues";
import ResumeTestModal from "../../components/ResumeTestModal";


const PreviousYearTestSeries = () => {

    const nav = useNavigate()
    const dispatch = useDispatch()
    const [years, setYears] = useState([])
    const [userInfo, setUserInfo] = useState({});
    const [activeYear, setActiveYear] = useState('');
    const [loading, setLoading] = useState(false)
    const [previous_year_exam, setPreviousYearExam] = useState(null)
    const [subscribe, setSubscribe] = useState(null);
    const [pauseStatusArray, setPauseStatusArray] = useState([]);
    const loadUserData = async () => {
        const user = await getUserDataDecrypted();
        // console.log("user infon print ", user)
        setSubscribe(user.subscription_status)

    };
    const [resumeData, setResumeData] = useState({})
    const [showModal, setShowModal] = useState(false);

    const getPreviouseDataFromLocal = async () => {
        const previous = JSON.parse(await secureGet("previouseYearTest"))
        // console.log(previous)
        setPreviousYearExam(previous)
    }

    useEffect(() => {
        getPreviouseDataFromLocal()
        loadUserData();
    }, []);



    useEffect(() => {
        const loadPauseStatus = async () => {
            // await clearAllEncryptedTestData()
            // return
            try {
                const data = await secureGetTestData('pause_status', 'pause_status_array');
                // console.log("🔐 Encrypted pause_status_array:", data);
                setPauseStatusArray(data || []);
            } catch (error) {
                // console.error("❌ Failed to load pause status:", error);
                setPauseStatusArray([]);
            }
        };

        loadPauseStatus();
    }, []);



    const getPreviouseExam = async (page = 1) => {
        setLoading(true);
        try {
            const res = await dispatch(getAllPreviouseYearDataSlice(page)).unwrap();
            // console.log(res)
            if (res.status_code == 200) {
                let years = Object.keys(res.data);
                setYears(years);
                setPreviousYearExam(res.data);
                console.log("res.data", res.data)

                // Set first active year
                setActiveYear(years[0]);

                // Extract pagination info for all years
                const paginationByYear = {};
                years.forEach((year) => {
                    const yearData = res.data[year];
                    paginationByYear[year] = {
                        currentPage: yearData.current_page,
                        lastPage: yearData.last_page,
                        nextPageUrl: yearData.next_page_url,
                        prevPageUrl: yearData.prev_page_url,
                        total: yearData.total
                    };
                });

                // console.log("Pagination Info by Year:", paginationByYear);
            }
        } catch (error) {
            console.log("ERROR IN FETCH PREVIOUSE EXAM", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getPreviouseExam()
    }, [])


    const getUserInfo = async () => {
        const userData = await getUserDataDecrypted("user");
        // console.log(userData)
        // const parsedUser = JSON.parse(strUser) || {};
        setUserInfo(userData);


    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const handleResume = async () => {
        console.log("hello")
        nav('/previous-test', { state: { testInfo: resumeData } })

    }





    return (
        <div className="p-4">
            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="sticky top-0 z-20 bg-white py-4">
                            <Swiper slidesPerView="auto" spaceBetween={12} className="mb-4">
                                {years.map((year) => (
                                    <SwiperSlide key={year} style={{ width: "auto" }}>
                                        <button
                                            onClick={() => setActiveYear(year)}
                                            className={`px-6 py-2 rounded-lg font-semibold transition ${activeYear === year
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {year}
                                        </button>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        {/* Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                            {previous_year_exam && previous_year_exam[activeYear]?.map((exam) => {
                                // console.log(exam)
                                const isPaused = pauseStatusArray.some(item => item.test_id === exam.id && item.isPaused);
                                return (
                                    <div key={exam.id} className="p-4 rounded-xl relative border overflow-hidden border-gray-200 shadow-sm bg-white hover:shadow-md transition">
                                        {
                                            exam.status == "inactive" && (
                                                <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.6)] w-full h-full">  </div>

                                            )

                                        }

                                        <p className="text-sm font-bold text-green-600 uppercase mb-1">
                                            {exam.exam_type}
                                        </p>
                                        <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>⏱ Duration: {exam.duration} min</p>
                                            <p>❓ Total Questions: {exam.total_question}</p>
                                            <p>📝 Total Marks: {exam.total_question * exam.marks_per_question}</p>
                                        </div>

                                        {
                                            subscribe ? (
                                                exam.attend_status === '' && isPaused ? (
                                                    // ✅ Show Resume if paused and not started yet
                                                    <button
                                                        onClick={() => {
                                                            setShowModal(true);
                                                            setResumeData(exam);
                                                        }}
                                                        className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-500 text-white"
                                                    >
                                                        Resume
                                                    </button>
                                                ) : (
                                                    // ✅ Show Start if test is available and not attempted
                                                    isQuizStartAvailable(exam.start_date_time) &&
                                                        !exam.attend &&
                                                        !isPaused &&
                                                        exam.attend_status === '' ? (
                                                        <button
                                                            onClick={() => nav('/previous-instruction', { state: { testInfo: exam } })}
                                                            className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-blue-500 text-white"
                                                        >
                                                            Start
                                                        </button>
                                                    ) : (
                                                        // ✅ Show Result if test is completed
                                                        exam.attend && exam.attend_status === 'done' ? (
                                                            <button
                                                                onClick={() =>
                                                                    nav('/previous-analysis', {
                                                                        state: {
                                                                            testId: exam.id,
                                                                            testInfo: exam,
                                                                            userData: userInfo,
                                                                        },
                                                                    })
                                                                }
                                                                className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-yellow-500 text-white"
                                                            >
                                                                Result
                                                            </button>
                                                        ) : (
                                                            // ✅ Show Available On button if not available yet
                                                            <button
                                                                onClick={() => setShowAlert(true)}
                                                                className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-300"
                                                            >
                                                                Available on {formatStartDateTime(exam.start_date_time)}
                                                            </button>
                                                        )
                                                    )
                                                )
                                            ) : !subscribe && exam.purchase_type === 'free' ? (
                                                exam.attend_status === '' && isPaused ? (
                                                    // ✅ Show Resume if paused and not started yet
                                                    <button
                                                        onClick={() => {
                                                            setShowModal(true);
                                                            setResumeData(test);
                                                        }}
                                                        className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-500 text-white"
                                                    >
                                                        Resume
                                                    </button>
                                                ) : (
                                                    // ✅ Show Start if test is available and not attempted
                                                    isQuizStartAvailable(exam.start_date_time) &&
                                                        !exam.attend &&
                                                        !isPaused &&
                                                        test.attend_status === '' ? (
                                                        <button
                                                            onClick={() => nav('/system-info', { state: { testInfo: res.data.test_series_info, testId: state?.testId, testDetail: res.data.details } })}
                                                            className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-blue-500 text-white"
                                                        >
                                                            Start
                                                        </button>
                                                    ) : (
                                                        // ✅ Show Result if test is completed
                                                        test.attend && test.attend_status === 'done' ? (
                                                            <button
                                                                onClick={() =>
                                                                    nav('/analysis', {
                                                                        state: {
                                                                            testId: test.id,
                                                                            testInfo: test,
                                                                            userData: userInfo,
                                                                        },
                                                                    })
                                                                }
                                                                className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-yellow-500 text-white"
                                                            >
                                                                Result
                                                            </button>
                                                        ) : (
                                                            // ✅ Show Available On button if not available yet
                                                            <button
                                                                onClick={() => {

                                                                    setShowAlert(true)
                                                                    setMessage("Not Available at this time")
                                                                }

                                                                }
                                                                className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-300"
                                                            >
                                                                Available on {formatStartDateTime(test.start_date_time)}
                                                            </button>
                                                        )
                                                    )
                                                )
                                            ) : (
                                                // ✅ Show Buy Now if not subscribed
                                                <button
                                                    onClick={() => {
                                                        setShowAlert(true)
                                                        setMessage("Purches")
                                                    }}
                                                    className="px-6 py-1.5 cursor-pointer text-white rounded font-semibold text-sm bg-blue-600"
                                                >
                                                    Buy Now
                                                </button>
                                            )
                                        }

                                    </div>
                                )
                            }

                            )}
                        </div>
                    </>
                )
            }
            {/* Horizontal Year Tabs */}
            <ResumeTestModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleResume}
            />

        </div>
    );
};

export default PreviousYearTestSeries;
