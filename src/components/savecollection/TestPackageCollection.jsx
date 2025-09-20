import React, { useEffect, useState } from 'react'
import { getUserCollectionDetailSlice, removeUserCollectionSlice, saveCollectionSlice } from '../../redux/HomeSlice';
import { useDispatch } from 'react-redux';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtil';
import { MdOutlineGTranslate } from 'react-icons/md';
import { toggleBookmark } from '../../helpers/Add_RemoveBookmark';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loading from '../globle/Loading';
import GlobleAlert from '../globle/GlobleAlert';
import NotFoundData from '../globle/NotFoundData';

const TestPackageCollection = () => {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const [packageData, setPackageData] = useState([])
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [loading, setLoading] = useState(false)
    const [btnLoadingId, setBtnLoadingId] = useState(null); // ✅ Track button loading for each card
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [markedData, setMarkedData] = useState(null)

    const fetchBookMarkTestSeries = async () => {
        try {
            setLoading(true)
            const res = await dispatch(getUserCollectionDetailSlice()).unwrap();
            // console.log("res",res)
            if (res.status_code == 200) {
                console.log('res.data.', res)
                setPackageData(res.data.package_id.data || []);
                const ids = (res.data.package_id?.data || []).map(item => item.id);
                setBookmarkedIds(ids);
            } else {
                // showErrorToast(res.message)
            }
        } catch (error) {
            // console.error("Bookmark fetch error", error);
        } finally {
            setLoading(false)
            setShowDeleteAlert(false)
        }
    };

    useEffect(() => {
        fetchBookMarkTestSeries();
    }, []);

    const handleToggleBookmark = async (item) => {
        setBtnLoadingId(markedData.id); // ✅ show spinner for that card
        try {
            await toggleBookmark({
                type: "package_id",
                id: markedData.id,
                bookmarkedIds,
                setBookmarkedIds,
                dispatch,
                saveCollectionSlice,
                removeUserCollectionSlice,
                cb: fetchBookMarkTestSeries
            });

            // ✅ Optimistic removal from UI
            if (bookmarkedIds.includes(markedData.id)) {
                setPackageData(prev => prev.filter(pkg => pkg.id !== markedData.id));
            }

        } catch (error) {
            showErrorToast("Something went wrong!");
        } finally {
            setBtnLoadingId(null);
        }
    };

    if (loading) return <Loading />;

    // Group packageData by category_id
    const groupedData = packageData.reduce((acc, item) => {
        const key = item.test_category_title
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(item)
        return acc
    }, {})
    // console.log('first', first)

    return (
        <>
            {Object.keys(groupedData).length > 0 ? (
                Object.entries(groupedData)
                    .sort(([a], [b]) => a - b) // Sort groups by category_id ascending
                    .map(([categoryId, items]) => (
                        <div key={categoryId} className="mb-8">
                            <h2 className="text-lg font-bold mb-4 px-4">{categoryId}</h2>
                            <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {items
                                    .sort((a, b) => a.sequence - b.sequence) // Sort items within group by sequence
                                    .map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-xl shadow hover:shadow-lg transition border cursor-pointer flex flex-col overflow-hidden"
                                        >
                                            {/* Header */}
                                            <div className="bg-gradient-to-r from-white to-blue-100 px-4 py-3 relative flex justify-center">
                                                <img
                                                    src={item.logo || "/logo.jpeg"}
                                                    alt="Logo"
                                                    className="w-16 h-16 object-contain"
                                                />
                                                <span className="absolute top-3 right-3 bg-white text-yellow-500 text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                                                    ⚡
                                                </span>
                                            </div>

                                            {/* Body */}
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                                                    {item.title || "Mock Test Series"}
                                                </h3>

                                                <p className="text-sm text-gray-600 mb-1">
                                                    {item.total_tests || 0} Total Tests
                                                </p>

                                                <p className="text-xs text-blue-600 flex items-center gap-2">
                                                    <MdOutlineGTranslate className="text-xl" />
                                                    {item.language || "English, Hindi"}
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

                                                {/* Buttons */}
                                                <div className="flex gap-2 items-center justify-center mt-auto">
                                                    <button
                                                        onClick={() => nav("/testpakages", { state: { item, testId: item.id } })}
                                                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 text-sm rounded-md font-semibold"
                                                    >
                                                        View Test Series
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setMarkedData(item)
                                                            setShowDeleteAlert(true)
                                                        }}
                                                        className="w-10 h-10 border bg-cyan-500 border-white text-white rounded-md flex items-center justify-center"
                                                    >
                                                        {btnLoadingId === item.id ? (
                                                            <Loader2 className="animate-spin" />
                                                        ) : bookmarkedIds.includes(item.id) ? (
                                                            <BookmarkCheck />
                                                        ) : (
                                                            <Bookmark className="text-xs" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {showDeleteAlert && markedData?.id === item.id && (
                                                <GlobleAlert
                                                    type="confirm"
                                                    message="Are you sure you want to remove this?"
                                                    onConfirm={handleToggleBookmark}
                                                    onCancel={() => setShowDeleteAlert(false)}
                                                />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))
            ) : (
                <div className='w-full h-screen flex items-center justify-center'>
                    <NotFoundData message='Add Test Series & Start Practicing' />
                </div>
            )}
        </>
    )
}

export default TestPackageCollection;