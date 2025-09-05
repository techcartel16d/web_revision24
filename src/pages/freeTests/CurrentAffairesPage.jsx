import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentAffairesSlice } from "../../redux/freeTestSlice";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { addUserCollectionSlice } from "../../redux/authSlice";
import { removeUserCollectionSlice, saveCollectionSlice } from "../../redux/HomeSlice";
import { toggleBookmark } from "../../helpers/Add_RemoveBookmark";

const CurrentAffairesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentAffairsData, setCurrentAffairsData] = useState([]);

    const [bookmarkedIds, setBookmarkedIds] = useState([]);

    const [language, setLanguage] = useState("Hindi");

    // Load bookmarks from localStorage
    useEffect(() => {
        const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        setBookmarkedIds(savedBookmarks);
    }, []);

    const fetchCurrentAffairs = async () => {
        const res = await dispatch(getCurrentAffairesSlice()).unwrap();
        setCurrentAffairsData(res.data.data || []);
    };

    useEffect(() => {
        fetchCurrentAffairs();
    }, []);

    // Save / Remove bookmark
    // const toggleBookmark = (id) => {
    //     let updated = [];
    //     if (bookmarkedIds.includes(id)) {
    //         updated = bookmarkedIds.filter((b) => b !== id);
    //     } else {
    //         updated = [...bookmarkedIds, id];
    //     }
    //     setBookmarkedIds(updated);
    //     localStorage.setItem("bookmarks", JSON.stringify(updated));
    // };

    // Share function
    const handleShare = (item) => {
        const url = `${window.location.origin}/current-affairs/${item.slug}`;
        if (navigator.share) {
            navigator
                .share({
                    title: item.title,
                    text: "Check this Current Affairs update",
                    url,
                })
                .catch((err) => console.log("Share failed:", err));
        } else {
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
    };

    // Navigate to details page
    const handleReadMore = (slug) => {
        navigate(`/current-affairs/${slug}`);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 px-4 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Current Affairs</h1>
                <div className="flex items-center gap-2">
                    <div className="p-4">
                        <LanguageToggle language={language} setLanguage={setLanguage} />

                        <h1 className="mt-6 text-xl font-bold">
                            {language === "Hindi" ? "करेंट अफेयर्स" : "Current Affairs"}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAffairsData.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between"
                    >
                        {/* Image */}
                        <img
                            src={
                                item.image ||
                                "https://via.placeholder.com/600x300?text=Current+Affairs"
                            }
                            alt={item.title}
                            className="rounded-xl mb-3 h-80 w-full object-cover"
                        />

                        {/* Date */}
                        <p className="text-sm text-gray-500 mb-1">
                            Date :{" "}
                            {item.created_at
                                ? new Date(item.created_at).toLocaleDateString("en-GB")
                                : "N/A"}
                        </p>

                        {/* Title */}
                        <h2 className="font-semibold text-lg mb-2">
                            {language === "Hindi"
                                ? item.title
                                : item.title_english || item.title}
                        </h2>

                        {/* Description */}
                        <p
                            className="text-gray-600 text-sm mb-3 line-clamp-3"
                            dangerouslySetInnerHTML={{
                                __html:
                                    language === "Hindi"
                                        ? item.short_description_hindi || "No description available"
                                        : item.short_description_english ||
                                        item.short_description_hindi ||
                                        "No description available",
                            }}
                        />

                        {/* Footer Actions */}
                        <div className="flex justify-between items-center mt-auto pt-3 border-t">
                            {/* <button onClick={() =>
                                toggleBookmark({
                                    type: 'news_id',
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


                            </button> */}
                            <button
                                className="text-sm text-green-600 hover:underline"
                                onClick={() => handleShare(item)}
                            >
                                Share
                            </button>
                            <button
                                className="text-sm text-white hover:underline bg-blue-500 py-2 px-6 rounded-md"
                                onClick={() => navigate("/current-affairs-details", { state: item })}
                            >
                                Read More →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrentAffairesPage;
