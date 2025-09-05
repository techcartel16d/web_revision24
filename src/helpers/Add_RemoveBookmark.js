import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';

const allCollectionKeys = {
    video_id: [],
    lession_id: [],
    class_note_id: [],
    study_note_id: [],
    article_id: [],
    news_id: [],
    question_id: [],
    test_series_id: [],
    package_id: []
};

export const toggleBookmark = async ({
    type, // e.g. 'test_series_id'
    id,
    bookmarkedIds,
    setBookmarkedIds,
    dispatch,
    saveCollectionSlice,
    removeUserCollectionSlice,
    cb
}) => {
    const isAlreadyBookmarked = bookmarkedIds.includes(id);
    let newBookmarkedIds = [...bookmarkedIds];

    if (isAlreadyBookmarked) {
        newBookmarkedIds = bookmarkedIds.filter(itemId => itemId !== id);
        setBookmarkedIds(newBookmarkedIds);

        const collection = {
            ...allCollectionKeys,
            [type]: [id]
        };

        try {
            const res = await dispatch(removeUserCollectionSlice(collection)).unwrap(); // ✅ FIXED
            cb()
            showSuccessToast(res.message)
        } catch (error) {
            showErrorToast('Bookmark remove error')

            setBookmarkedIds(bookmarkedIds);
        }
    } else {
        newBookmarkedIds.push(id);
        setBookmarkedIds(newBookmarkedIds);

        const collection = {
            ...allCollectionKeys,
            [type]: newBookmarkedIds
        };

        try {
            const res = await dispatch(saveCollectionSlice(collection)).unwrap(); // ✅ FIXED
            showSuccessToast(res.message || "Bookmarked")
        } catch (error) {
            console.error("Bookmark add error", error);

            showErrorToast("Failed to add bookmark")
            setBookmarkedIds(bookmarkedIds);
        }
    }
};
