import React, { useCallback, useEffect, useState } from "react";
import { FaClock, FaFilePdf, FaShareAlt, FaRegBookmark } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getSingleCategoryPackageTestseriesDetailSlice, getSingleCategoryPackageTestseriesSlice } from "../../redux/HomeSlice";
import ResumeTestModal from "../../components/ResumeTestModal";
import { MdArrowBackIos } from "react-icons/md";
import { clearAllEncryptedTestData, secureGetTestData } from "../../helpers/testStorage";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { clearUserData, getUserDataDecrypted } from "../../helpers/userStorage";
import SuccessModal from "../../components/SuccessModal";
import ConfirmModal from "../../components/ConfirmModal";
import AlertModal from "../../components/AlertModal";
import { formatStartDateTime, isQuizStartAvailable, isQuizUpcoming } from "../../helpers/checkTestStartDate";
import { debounce } from "lodash";



const TestPagesPage = () => {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const { state } = useLocation()
    // // console.log("state=====>", state)
    const [testData, setTestData] = useState([])
    const [testId, setTestId] = useState(null)
    const [puaseStatus, setPuaseStatus] = useState(false)
    const [userInfo, setUserInfo] = useState({});
    const [isPuase, setIsPuase] = useState(false)
    const [resumeData, setResumeData] = useState({})
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [pageLoading, setPageLoading] = useState(false)

    const [pauseStatusArray, setPauseStatusArray] = useState([]);

    const [subscribe, setSubscribe] = useState(null);

    const loadUserData = async () => {
        const user = await getUserDataDecrypted();
        // console.log("user infon print ", user)
        setSubscribe(user.subscription_status)

    };

    const [showSuccess, setShowSuccess] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);



    useEffect(() => {
        loadUserData();
    }, []);
    // 🔐 Load pause status from secure storage on mount
    useEffect(() => {
        const loadPauseStatus = async () => {
            // await clearAllEncryptedTestData()
            // return
            try {
                const data = await secureGetTestData('pause_status', 'pause_status_array');
                console.log("🔐 Encrypted pause_status_array:", data);
                setPauseStatusArray(data || []);
            } catch (error) {
                // console.error("❌ Failed to load pause status:", error);
                setPauseStatusArray([]);
            }
        };

        loadPauseStatus();
    }, []);








    // const getSigleCategoryData = async (page = 1, query = '') => {
    //     if (state) {
    //         try {
    //             setPageLoading(true);
    //             const res = await dispatch(
    //                 getSingleCategoryPackageTestseriesSlice({
    //                     testId: state.testId,
    //                     page,
    //                     search: query // make sure your API accepts this param
    //                 })
    //             ).unwrap();

    //             if (res.status_code === 200) {
    //                 setTestData(res.data.test_series.data); // Replace (not append)
    //                 setPagination({
    //                     current_page: res.data.test_series.current_page,
    //                     last_page: res.data.test_series.last_page,
    //                 });
    //                 setTestId(res.data.package_detail.id);
    //             } else if (res.status_code === 401) {
    //                 await clearUserData();
    //             }
    //         } catch (error) {
    //             setShowAlert(true);
    //             setMessage('Login token has expired. Please sign in again to continue.');
    //             await clearUserData();
    //         } finally {
    //             setPageLoading(false);
    //         }
    //     }
    // };


    const getSigleCategoryData = async (page = 1, query = '') => {
        if (state) {
            try {
                setPageLoading(true);
                const res = await dispatch(
                    getSingleCategoryPackageTestseriesSlice({
                        testId: state.testId,
                        page,
                        search: query // make sure your API accepts this param
                    })
                ).unwrap();

                if (res.status_code == 200) {
                    // console.log()
                    setTestData(prev =>
                        page === 1 ? res.data.test_series.data : [...prev, ...res.data.test_series.data]
                    );
                    setPagination({
                        current_page: res.data.test_series.current_page,
                        last_page: res.data.test_series.last_page,
                    });
                    setTestId(res.data.package_detail.id);
                } else if (res.status_code === 401) {
                    await clearUserData();
                }
            } catch (error) {
                setShowAlert(true);
                setMessage('Login token has expired. Please sign in again to continue.');
                await clearUserData();
            } finally {
                setPageLoading(false);
            }
        }
    };


    const fetchTestSeriesDetails = async (item) => {
        // // console.log("item here====>", item)

        // // console.log("testSeriesId", testSeriesId)
        // // console.log("isResume", isResume)
        try {
            // setTestDetailLoading(true)

            const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(item.id)).unwrap()
            // console.log("res details", res.data)

            nav('/system-info', { state: { testInfo: res.data.test_series_info, testId: state?.testId, testDetail: res.data.details } })
            const data = {
                testInfo: res.data.test_series_info,
                testId: state?.testId
            }


        } catch (error) {
            // setTestDetailLoading(false)
            // setRefreshing(false);
            // console.log("ERROR ", error)


        }
    }



    const handleResume = async () => {
        try {
            const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(resumeData?.id)).unwrap()
            // // console.log("res details", res.data)
            nav('/scc-mock-test', { state: { testInfo: res.data.test_series_info, testId: state?.testId, testDetail: res.data.details } })
            setShowModal(false);

        } catch (error) {
            // console.log("ERROR ===>", error)

        }

    }






    const getUserInfo = async () => {
        const userData = await getUserDataDecrypted("user");
        setUserInfo(userData);


    };

    useEffect(() => {
        getUserInfo();
    }, []);




    useEffect(() => {
        getSigleCategoryData(1)
        // fetchTestSeriesDetails()
    }, [])




    // Debounced function (called after 500ms of no typing)
    const debouncedSearch = useCallback(
        debounce((query) => {
            onSearch(query);
        }, 200),
        []
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const onSearch = async (query) => {
        await getSigleCategoryData(1, query); // Call with search input
    };





    return (
        <>
            {/* <Header /> */}

            <div className="p-4 h-screen bg-white ">

                <div className="flex items-center justify-end w-full p-3">
                    <input className="border-2 border-blue-700 bg-gray-50 rounded-md px-4 py-1" type="text" placeholder="search.."
                        value={searchTerm}
                        onChange={handleSearchChange}


                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {testData.map((test, index) => {
                        // Pause Status Check
                        // const pauseStatusRaw = localStorage.getItem('pause_status_array');
                        // const pauseArray = pauseStatusRaw ? JSON.parse(pauseStatusRaw) : [];
                        // // console.log("pauseArray", pauseArray)


                        const isPaused = pauseStatusArray.some(item => item.test_id === test.id && item.isPaused);

                        return (


                            <div
                                key={index}
                                className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    {
                                        test.purchase_type === 'free' && (
                                            <span className="bg-green-600 text-xs px-2 py-1 rounded text-white font-semibold">
                                                {test.purchase_type}
                                            </span>
                                        )
                                    }

                                    <span className="text-sm text-blue-500 font-medium">Hindi / English</span>
                                </div>

                                <div className="text-base font-semibold text-black mt-1">
                                    {test.title}
                                </div>

                                <div className="text-sm text-gray-600 flex gap-6 mt-1">
                                    <div className="flex items-center gap-1">
                                        <FaClock /> {test.time}
                                    </div>
                                    <div>Que.{test.no_of_question}</div>
                                    <div>Marks {test.marks}</div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t mt-4">
                                    <div className="flex gap-4 text-xl text-black">
                                        {/* <FaFilePdf className="cursor-pointer" />
                                    <FaShareAlt className="cursor-pointer" />
                                    <FaRegBookmark className="cursor-pointer" /> */}
                                    </div>

                                    {
                                        subscribe ? (
                                            test.attend_status === '' && isPaused ? (
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
                                                isQuizStartAvailable(test.start_date_time) &&
                                                    !test.attend &&
                                                    !isPaused &&
                                                    test.attend_status === '' ? (
                                                    <button
                                                        onClick={() => fetchTestSeriesDetails(test)}
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
                                                            onClick={() => setShowAlert(true)}
                                                            className="px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-300"
                                                        >
                                                            Available on {formatStartDateTime(test.start_date_time)}
                                                        </button>
                                                    )
                                                )
                                            )
                                        ) : !subscribe && test.purchase_type === 'free' ? (
                                            test.attend_status === '' && isPaused ? (
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
                                                isQuizStartAvailable(test.start_date_time) &&
                                                    !test.attend &&
                                                    !isPaused &&
                                                    test.attend_status === '' ? (
                                                    <button
                                                        onClick={() => fetchTestSeriesDetails(test)}
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
                            </div>



                        )
                    })}
                </div>

                {pagination.current_page < pagination.last_page && (
                    <div className="text-center mt-4">
                        <button
                            onClick={() => getSigleCategoryData(pagination.current_page + 1)}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center mx-auto"
                            disabled={pageLoading}
                        >
                            {pageLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        ></path>
                                    </svg>
                                    Loading...
                                </span>
                            ) : (
                                'Load More'
                            )}
                        </button>
                    </div>
                )}

                {/* <div className="flex justify-center w-full ite mt-10 gap-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer"
                        disabled={pagination.current_page === 1 || pageLoading}
                        onClick={() => getSigleCategoryData(pagination.current_page - 1)}
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 mt-2">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer"
                        disabled={pagination.current_page === pagination.last_page || pageLoading}
                        onClick={() => getSigleCategoryData(pagination.current_page + 1)}
                    >
                        Next
                    </button>
                </div> */}



                <ResumeTestModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleResume}
                />

                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => setShowSuccess(false)}
                    message="Your action was completed successfully!"
                />

                <ConfirmModal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={() => {
                        setShowConfirm(false);
                        setShowSuccess(true);
                    }}
                    title="Confirm Deletion"
                    message="Do you really want to delete this item?"
                />

                <AlertModal
                    isOpen={showAlert}
                    onClose={() => {
                        setShowAlert(false)
                        nav('/login')
                    }}
                    // title="Commin"
                    message={message}
                />
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default TestPagesPage;