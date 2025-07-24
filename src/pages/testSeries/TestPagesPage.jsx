import React, { useEffect, useState } from "react";
import { FaClock, FaFilePdf, FaShareAlt, FaRegBookmark } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getSingleCategoryPackageTestseriesDetailSlice, getSingleCategoryPackageTestseriesSlice } from "../../redux/HomeSlice";
import ResumeTestModal from "../../components/ResumeTestModal";
import { MdArrowBackIos } from "react-icons/md";

const tests = [
    {
        title: "General Intelligence & Reasoning Sectional Test - 01",
        time: "12 min",
        questions: 25,
        marks: 50,
        status: "Start",
    },
    {
        title: "English Comprehension Sectional Test - 01",
        time: "12 min",
        questions: 25,
        marks: 50,
        status: "Result",
    },
    {
        title: "Quantitative Aptitude Sectional Test - 01",
        time: "18 min",
        questions: 25,
        marks: 50,
        status: "Start",
    },
    {
        title: "General Awareness Sectional Test - 01",
        time: "8 min",
        questions: 25,
        marks: 50,
        status: "Start",
    },
    {
        title: "Current Affairs - 01",
        time: "10 min",
        questions: 20,
        marks: 40,
        status: "Start",
    },
];

const TestPagesPage = () => {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const { state } = useLocation()
    console.log("state=====>", state)
    const [testData, setTestData] = useState([])
    const [testId, setTestId] = useState(null)
    const [puaseStatus, setPuaseStatus] = useState(false)
    const [userInfo, setUserInfo] = useState({});
    const [isPuase, setIsPuase] = useState(false)
    const [resumeData, setResumeData] = useState({})
    const [showModal, setShowModal] = useState(false);
    // useEffect(() => {
    //     const getIsPuase = JSON(localStorage.getItem('isPuase')) || false;
    //     setPuaseStatus(getIsPuase)
    // }, [])





    const getSigleCategoryData = async (page = 1,) => {


        if (state) {
            try {
                const res = await dispatch(getSingleCategoryPackageTestseriesSlice({ testId: state.testId })).unwrap()
                console.log("single category test series data getSingleCategoryPackageTestseries", res)
                setTestData(res.data.test_series.data)
                console.log("res.data.package_detail.id", res.data.package_detail.id)
                setTestId(res.data.package_detail.id)

                // setTestPackageSeries(res.data)
                // setRefreshing(false);
                // setLoading(false)
                // setLastPage(res.data.test_series.last_page)
                // setCurrentPage(res.data.test_series.current_page)

            } catch (error) {
                // setRefreshing(false);
                // setLoading(false)
            } finally {
                // setRefreshing(false);
                // setLoading(false)
            }

        }


        // package_detail
    }


    const fetchTestSeriesDetails = async (item) => {
        console.log("item here====>", item)

        // console.log("testSeriesId", testSeriesId)
        // console.log("isResume", isResume)
        try {
            // setTestDetailLoading(true)

            const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(item.id)).unwrap()
            console.log("res details", res.data)

            nav('/system-info', { state: { testInfo: res.data.test_series_info, testId: state?.testId } })
            const data = {
                testInfo: res.data.test_series_info,
                testId: state?.testId
            }


        } catch (error) {
            // setTestDetailLoading(false)
            // setRefreshing(false);
            console.log("ERROR ", error)


        }
    }



    const handleResume = async () => {
        try {
            const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(resumeData?.id)).unwrap()
            console.log("res details", res.data)
            nav('/scc-mock-test', { state: { testInfo: res.data.test_series_info, testId: state?.testId } })
            setShowModal(false);

        } catch (error) {
            console.log("ERROR ===>", error)

        }

    }






    const getUserInfo = () => {
        const strUser = localStorage.getItem("user");
        const parsedUser = JSON.parse(strUser) || {};
        setUserInfo(parsedUser);


    };

    useEffect(() => {
        getUserInfo();
    }, []);




    useEffect(() => {
        getSigleCategoryData()
        // fetchTestSeriesDetails()
    }, [])
    return (
        <div className="p-4 bg-white min-h-screen">
            {/* <div className="my-4">
                <button onClick={() => nav(-1)} className="px-6 py-2 bg-blue-500 text-white rounded-md cursor-pointer"><MdArrowBackIos className="text-xl" /></button>
            </div> */}
            {/* <div className="flex gap-4 mb-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
                    SSC CGL - Graduation Level
                </button>
                <button className="border border-gray-300 text-black px-4 py-2 rounded-full font-semibold">
                    SSC CHSL - 12
                </button>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* {testData.map((test, index) => {
                    return (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                                <span className="bg-green-600 text-xs px-2 py-1 rounded text-white font-semibold">
                                    free
                                </span>
                                <span className="text-sm text-blue-500 font-medium">Hindi / English</span>
                            </div>

                            <div className="text-base font-semibold text-black mt-1">
                                {test.title}
                            </div>

                            <div className="text-sm text-gray-600 flex gap-6 mt-1">
                                <div className="flex items-center gap-1">
                                    <FaClock /> {test.time}
                                </div>
                                <div>Que.{test.questions}</div>
                                <div>Marks {test.marks}</div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t mt-4">
                                <div className="flex gap-4 text-xl text-black">
                                    <FaFilePdf className="cursor-pointer" />
                                    <FaShareAlt className="cursor-pointer" />
                                    <FaRegBookmark className="cursor-pointer" />
                                </div>

                                {
                                    test.attend_status === '' && isPuase ? (
                                        <button
                                            onClick={() => fetchTestSeriesDetails(test)}
                                            className={`px-6 py-1.5 cursor-pointer rounded font-semibold text-sm ${test.status === "done"
                                                ? "bg-yellow-400 text-black"
                                                : "bg-blue-500 text-white"
                                                }`}
                                        >
                                            Resume
                                        </button>
                                    ) : test.purchase_type === 'free' && !test.attend ? (
                                        <button
                                            onClick={() => fetchTestSeriesDetails(test)}
                                            className={`px-6 py-1.5 cursor-pointer rounded font-semibold text-sm ${test.status === "done"
                                                ? "bg-yellow-400 text-black"
                                                : "bg-blue-500 text-white"
                                                }`}
                                        >
                                            Start
                                        </button>
                                    ) : test.attend && test.attend_status === 'done' ? (
                                        <button
                                            onClick={() => nav('/screen6', { state: { testId: state?.testId, testInfo: test, userData: userInfo } })}
                                            className={`px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-yellow-500 text-white`}
                                        >
                                            Result
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                alert("need to purchase REVISION24 PLUS subscription")
                                            }}
                                            className={`px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-300`}
                                        >
                                            Locked
                                        </button>
                                    )
                                }

                            </div>
                        </div>
                    )
                }




                )} */}






                {testData.map((test, index) => {
                    // Pause Status Check
                    const pauseStatusRaw = localStorage.getItem('pause_status_array');
                    const pauseArray = pauseStatusRaw ? JSON.parse(pauseStatusRaw) : [];
                    console.log("pauseArray", pauseArray)


                    const isPaused = pauseArray.some(item => item.test_id === test.id && item.isPaused);

                    return (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                                <span className="bg-green-600 text-xs px-2 py-1 rounded text-white font-semibold">
                                    free
                                </span>
                                <span className="text-sm text-blue-500 font-medium">Hindi / English</span>
                            </div>

                            <div className="text-base font-semibold text-black mt-1">
                                {test.title}
                            </div>

                            <div className="text-sm text-gray-600 flex gap-6 mt-1">
                                <div className="flex items-center gap-1">
                                    <FaClock /> {test.time}
                                </div>
                                <div>Que.{test.questions}</div>
                                <div>Marks {test.marks}</div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t mt-4">
                                <div className="flex gap-4 text-xl text-black">
                                    {/* <FaFilePdf className="cursor-pointer" />
                                    <FaShareAlt className="cursor-pointer" />
                                    <FaRegBookmark className="cursor-pointer" /> */}
                                </div>

                                {
                                    test.attend_status === '' && isPaused ? (
                                        <button
                                            onClick={() => {
                                                setShowModal(true)
                                                setResumeData(test)
                                            }}
                                            className={`px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-500 text-white`}
                                        >
                                            Resume
                                        </button>
                                    ) : test.purchase_type === 'free' && !test.attend ? (
                                        <button
                                            onClick={() => {


                                                fetchTestSeriesDetails(test)


                                            }
                                            }
                                            className={`px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-blue-500 text-white`}
                                        >
                                            Start
                                        </button>
                                    ) : test.attend && test.attend_status === 'done' ? (
                                        <button
                                            onClick={() => nav('/analysis', {
                                                state: {
                                                    testId: test.id,
                                                    testInfo: test,
                                                    userData: userInfo
                                                }
                                            })}
                                            className={`px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-yellow-500 text-white`}
                                        >
                                            Result
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                alert("need to purchase REVISION24 PLUS subscription")
                                            }}
                                            className={`px-6 py-1.5 cursor-pointer rounded font-semibold text-sm bg-gray-300`}
                                        >
                                            Locked
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    )
                })}
            </div>

            <ResumeTestModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleResume}
            />
        </div>
    );
};

export default TestPagesPage;