import React, { useEffect, useState } from "react";
import { FaClock, FaFilePdf, FaShareAlt, FaRegBookmark } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getSingleCategoryPackageTestseriesSlice } from "../../redux/HomeSlice";

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



    const fetchTestSeriesDetails = async (testSeriesId, isResume = false) => {
        console.log("testSeriesId", testSeriesId)
        console.log("isResume", isResume)
        try {
            setTestDetailLoading(true)

            const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(testSeriesId)).unwrap()
            console.log("res details", res.data)

            if (res.status_code == 200) {
                // console.log("response", res.data)
                setTestSeriesDetail(res.data)
                if (isResume) {
                    handleResumeStart(res.data, testSeriesId)

                }
                setRefreshing(false);
                setTestDetailLoading(false)

            }

        } catch (error) {
            setTestDetailLoading(false)
            setRefreshing(false);
            console.log()


        }
    }


    const getSigleCategoryData = async (page = 1,) => {


        if (state) {
            try {
                const res = await dispatch(getSingleCategoryPackageTestseriesSlice({ testId: state.id })).unwrap()
                console.log("single category test series data getSingleCategoryPackageTestseries", res)
                setTestData(res.data.test_series.data)
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

    useEffect(() => {
        getSigleCategoryData()
    }, [])
    return (
        <div className="p-4 bg-white min-h-screen">
            <div className="flex gap-4 mb-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
                    SSC CGL - Graduation Level
                </button>
                <button className="border border-gray-300 text-black px-4 py-2 rounded-full font-semibold">
                    SSC CHSL - 12
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {testData.map((test, index) => (
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
                            <button
                                onClick={() => nav('/screen1', {state:test})}
                                className={`px-6 py-1.5 rounded font-semibold text-sm ${test.status === "Result"
                                    ? "bg-yellow-400 text-black"
                                    : "bg-blue-500 text-white"
                                    }`}
                            >
                                start
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestPagesPage;