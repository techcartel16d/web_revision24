import React, { useCallback, useEffect, useState } from "react";
import { FaClock, FaFilePdf, FaShareAlt, FaRegBookmark, FaSearch, FaTrophy, FaQuestionCircle, FaStar, FaGraduationCap } from "react-icons/fa";
import { MdArrowBackIos, MdAccessTime, MdPlayArrow, MdAssignment, MdTrendingUp } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { AiOutlineReload } from "react-icons/ai";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getSingleCategoryPackageTestseriesDetailSlice, getSingleCategoryPackageTestseriesSlice } from "../../redux/HomeSlice";
import ResumeTestModal from "../../components/ResumeTestModal";
import { clearAllEncryptedTestData, secureGetTestData } from "../../helpers/testStorage";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { clearUserData, getUserDataDecrypted } from "../../helpers/userStorage";
import SuccessModal from "../../components/SuccessModal";
import ConfirmModal from "../../components/ConfirmModal";
import AlertModal from "../../components/AlertModal";
import { formatStartDateTime, isQuizStartAvailable, isQuizUpcoming } from "../../helpers/checkTestStartDate";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { IoSparklesOutline } from "react-icons/io5";

const TestPagesPage = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    console.log("STATE ===>", state);

    const [testData, setTestData] = useState([]);
    const [testId, setTestId] = useState(null);
    const [puaseStatus, setPuaseStatus] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [isPuase, setIsPuase] = useState(false);
    const [resumeData, setResumeData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [pageLoading, setPageLoading] = useState(false);
    const [pauseStatusArray, setPauseStatusArray] = useState([]);
    const [subscribe, setSubscribe] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    const loadUserData = async () => {
        const user = await getUserDataDecrypted();
        setSubscribe(user.subscription_status);
    };

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        const loadPauseStatus = async () => {
            try {
                const data = await secureGetTestData('pause_status', 'pause_status_array');
                setPauseStatusArray(data || []);
            } catch (error) {
                setPauseStatusArray([]);
            }
        };
        loadPauseStatus();
    }, []);

    const getSigleCategoryData = async (page = 1, query = '') => {
        if (state) {
            try {
                setPageLoading(true);
                const res = await dispatch(
                    getSingleCategoryPackageTestseriesSlice({
                        testId: state.testId,
                        page,
                        search: query
                    })
                ).unwrap();

                if (res.status_code == 200) {
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
        try {
            const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(item.id)).unwrap();

            if(state?.category==='RRB Group D'){
            nav('/online-exam-general-instruction', {
                state: {
                    testInfo: res.data.test_series_info,
                    testId: state?.testId,
                    testDetail: res.data.details
                }
            });
            }else{
            nav('/system-info', {
                state: {
                    testInfo: res.data.test_series_info,
                    testId: state?.testId,
                    testDetail: res.data.details
                }
            });
          }
        } catch (error) {
            console.log("ERROR ", error);
        }
    };

    const handleResume = async () => {
        try {
            const res = await dispatch(getSingleCategoryPackageTestseriesDetailSlice(resumeData?.id)).unwrap();
            nav('/scc-mock-test', {
                state: {
                    testInfo: res.data.test_series_info,
                    testId: state?.testId,
                    testDetail: res.data.details
                }
            });
            setShowModal(false);
        } catch (error) {
            console.log("ERROR ===>", error);
        }
    };

    const getUserInfo = async () => {
        const userData = await getUserDataDecrypted("user");
        setUserInfo(userData);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        getSigleCategoryData(1);
    }, []);

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
        await getSigleCategoryData(1, query);
    };

    // Get button configuration based on test status
    const getButtonConfig = (test) => {
        const isPaused = pauseStatusArray.some(item => item.test_id === test.id && item.isPaused);

        if (subscribe || (!subscribe && test.purchase_type === 'free')) {
            if (test.attend_status === '' && isPaused) {
                return {
                    text: "Resume Test",
                    className: "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25",
                    icon: <AiOutlineReload size={18} />,
                    onClick: () => {
                        setShowModal(true);
                        setResumeData(test);
                    }
                };
            } else if (isQuizStartAvailable(test.start_date_time) && !test.attend && !isPaused && test.attend_status === '') {
                return {
                    text: "Start Now",
                    className: "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/25",
                    icon: <HiOutlineLightningBolt size={18} />,
                    onClick: () => fetchTestSeriesDetails(test)
                };
            } else if (test.attend && test.attend_status === 'done') {
                return {
                    text: "View Results",
                    className: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white shadow-lg hover:shadow-green-500/25",
                    icon: <FaTrophy size={18} />,
                    onClick: () => nav('/analysis', {
                        state: {
                            testId: test.id,
                            testInfo: test,
                            userData: userInfo,
                        },
                    })
                };
            } else {
                return {
                    text: `Available ${formatStartDateTime(test.start_date_time)}`,
                    className: "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-70",
                    icon: <MdAccessTime size={18} />,
                    onClick: () => {
                        setShowAlert(true);
                        setMessage("Test not available at this time");
                    }
                };
            }
        } else {
            return {
                text: "Upgrade Now",
                className: "bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white shadow-lg hover:shadow-purple-500/25",
                icon: <FaGraduationCap size={18} />,
                onClick: () => {
                    setShowAlert(true);
                    setMessage("Upgrade to premium to access this test");
                }
            };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Enhanced Header Section with Better Overflow */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    {/* Back Button and Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6">
                        <motion.button
                            whileHover={{ scale: 1.05, x: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => nav(-1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 w-fit group"
                        >
                            <MdArrowBackIos size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                            <span className="font-medium text-gray-700">Back</span>
                        </motion.button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Test Series</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base truncate">Choose your test and start practicing</p>
                        </div>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tests..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
                        />
                        {searchTerm && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => {
                                    setSearchTerm('');
                                    getSigleCategoryData(1);
                                }}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <div className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                                    <span className="text-xs font-bold text-gray-600">×</span>
                                </div>
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content with Improved Overflow */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Test Cards Grid with Enhanced Hover Effects */}
                <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        {testData.map((test, index) => {
                            const isPaused = pauseStatusArray.some(item => item.test_id === test.id && item.isPaused);
                            const buttonConfig = getButtonConfig(test);
                            const isHovered = hoveredCard === test.id;

                            return (
                                <motion.div
                                    key={test.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onMouseEnter={() => setHoveredCard(test.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
                                >
                                    {/* Enhanced Glow Effect */}
                                    <div className={`absolute -inset-1 bg-gradient-to-r from-blue-400/0 via-purple-500/0 to-pink-500/0 ${isHovered ? 'from-blue-400/20 via-purple-500/20 to-pink-500/20' : ''} rounded-2xl transition-all duration-500 blur-sm -z-10`}></div>

                                    {/* Floating Elements on Hover */}
                                    <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transform transition-all duration-500 ${isHovered ? 'scale-100 rotate-12' : 'scale-0 rotate-0'}`}>
                                        <IoSparklesOutline className="text-white text-sm" />
                                    </div>

                                    {/* Card Header */}
                                    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 overflow-hidden">
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-50"></div>
                                        <div className={`absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full blur-xl transition-all duration-500 ${isHovered ? 'scale-150 opacity-70' : 'scale-100 opacity-30'}`}></div>

                                        {/* Status Badges */}
                                        <div className="relative z-10 flex items-start justify-between mb-4">
                                            <div className="flex flex-wrap gap-2 max-w-[70%]">
                                                {test.purchase_type === 'free' && (
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg"
                                                    >
                                                        FREE
                                                    </motion.span>
                                                )}
                                                {isPaused && (
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg animate-pulse"
                                                    >
                                                        PAUSED
                                                    </motion.span>
                                                )}
                                                {test.attend_status === 'done' && (
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg flex items-center gap-1"
                                                    >
                                                        <IoMdCheckmarkCircle size={12} />
                                                        COMPLETED
                                                    </motion.span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full whitespace-nowrap">
                                                <span>Hi/En</span>
                                            </div>
                                        </div>

                                        {/* Test Title with Better Overflow */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight overflow-hidden">
                                            {test.title}
                                        </h3>

                                        {/* Enhanced Test Stats */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <motion.div
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-white/60 rounded-lg backdrop-blur-sm"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                                    <MdAccessTime className="text-white" size={14} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-gray-900 truncate">{test.time}</div>
                                                    <div className="text-xs text-gray-500">Duration</div>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-white/60 rounded-lg backdrop-blur-sm"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                                                    <FaQuestionCircle className="text-white" size={14} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-gray-900 truncate">{test.no_of_question}</div>
                                                    <div className="text-xs text-gray-500">Questions</div>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-white/60 rounded-lg backdrop-blur-sm"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                                                    <FaStar className="text-white" size={14} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-gray-900 truncate">{test.marks}</div>
                                                    <div className="text-xs text-gray-500">Marks</div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Enhanced Card Footer */}
                                    <div className="p-6 bg-white relative overflow-hidden">
                                        <motion.button
                                            whileHover={{ scale: 1.03, y: -2 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={buttonConfig.onClick}
                                            disabled={buttonConfig.className.includes('cursor-not-allowed')}
                                            className={`relative w-full py-4 px-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group overflow-hidden transform hover:scale-105 ${buttonConfig.className}`}
                                        >
                                            {/* Enhanced Shimmer Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                            <motion.span
                                                className="relative z-10"
                                                whileHover={{ rotate: 15, scale: 1.1 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                {buttonConfig.icon}
                                            </motion.span>
                                            <span className="relative z-10 truncate">{buttonConfig.text}</span>

                                            {/* Button glow effect */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl bg-gradient-to-r from-current/20 to-current/20"></div>
                                        </motion.button>
                                    </div>

                                    {/* Enhanced Floating Action on Hover */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                        animate={{
                                            opacity: isHovered ? 1 : 0,
                                            scale: isHovered ? 1 : 0.8,
                                            y: isHovered ? 0 : 10
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute top-4 left-4 flex gap-2"
                                    >
                                        <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                                            <FaRegBookmark size={14} className="text-gray-600" />
                                        </div>
                                        <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                                            <FaShareAlt size={14} className="text-gray-600" />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>

                {/* Enhanced Load More Button */}
                {pagination.current_page < pagination.last_page && (
                    <div className="flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => getSigleCategoryData(pagination.current_page + 1)}
                            disabled={pageLoading}
                            className="relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 overflow-hidden group"
                        >
                            {/* Button shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                            {pageLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="relative z-10">Loading More Tests...</span>
                                </>
                            ) : (
                                <>
                                    <MdTrendingUp size={20} className="relative z-10" />
                                    <span className="relative z-10">Load More Tests</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                )}

                {/* Enhanced Empty State */}
                {testData.length === 0 && !pageLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg mx-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <MdAssignment size={48} className="text-gray-400" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Tests Found</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any tests matching your search criteria. Try adjusting your search terms.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setSearchTerm('');
                                getSigleCategoryData(1);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Clear Search & Reload
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Modals */}
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
                    setShowAlert(false);
                    if (message.includes('expired')) {
                        nav('/login');
                    }
                }}
                message={message}
            />
        </div>
    );
};

export default TestPagesPage;
