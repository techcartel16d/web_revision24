import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getMindMapSlice } from "../../redux/freeTestSlice";
import { motion, AnimatePresence } from "framer-motion";

const NotesPdfPage = () => {
    const dispatch = useDispatch();
    const [mindMapData, setMindMapData] = useState([]);
   const [selectedPdf, setSelectedPdf] = useState(null);
       const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [loading, setLoading] = useState(false);

    const fetchMindMapData = async (page = 1) => {
        setLoading(true);
        try {
            const res = await dispatch(getMindMapSlice({ page })).unwrap();
            console.log("mind data response", res.data);
            setMindMapData(res.data.data || []);
            setPagination({
                current_page: res.data.current_page,
                last_page: res.data.last_page,
            });
        } catch (error) {
            console.error("Error fetching mind maps:", error);
        } finally {
            setLoading(false);
        }
    };
     const handleViewPdf = (pdfUrl, title) => {
        console.log('pdfUrl', pdfUrl)
        setSelectedPdf({ url: pdfUrl, title });
        setIsModalOpen(true);
    };

    // ✅ Close PDF Viewer
    const closePdfViewer = () => {
        setSelectedPdf(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchMindMapData(1);
    }, []);

    return (
        <>
         <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">📚 Notes / Mind Maps</h1>

            {loading ? (
                <p className="text-center text-lg font-semibold">Loading...</p>
            ) : (
                <>
                    {/* ✅ Cards Grid */}
                    {mindMapData.length > 0 ? (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {mindMapData.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white shadow-md rounded-lg overflow-hidden border hover:shadow-lg transition"
                                >
                                    <div className="aspect-video bg-gray-200">
                                        <img
                                            src={item.pdf}
                                            alt={item.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {item.subject?.title} • {item.chapter?.title}
                                        </p>
                                        <button
                                            onClick={() =>
                                            handleViewPdf(
                                                item.pdf,
                                                item.title
                                            )
                                        }
                                            className="mt-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">No Mind Maps found</p>
                    )}

                    {/* ✅ Pagination */}
                    <div className="flex justify-center items-center gap-3 mt-8">
                        <button
                            disabled={pagination.current_page === 1}
                            onClick={() => fetchMindMapData(pagination.current_page - 1)}
                            className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span>
                            Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <button
                            disabled={pagination.current_page === pagination.last_page}
                            onClick={() => fetchMindMapData(pagination.current_page + 1)}
                            className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                </>
            )}
            <AnimatePresence>
                {isModalOpen && selectedPdf && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 sm:p-4"
                        onClick={closePdfViewer}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-lg overflow-hidden w-full max-w-6xl h-full max-h-[95vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                                <h3 className="text-lg font-semibold text-gray-800 truncate flex-1 mr-4">
                                    {selectedPdf.title}
                                </h3>

                                <div className="flex items-center gap-2">
                                    {/* Download Button */}
                                    <button
                                        onClick={() =>
                                            window.open(selectedPdf.url, "_blank")
                                        }
                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                    >
                                        📥 Download
                                    </button>

                                    {/* Open in New Tab */}
                                    <button
                                        onClick={() =>
                                            window.open(selectedPdf.url, "_blank")
                                        }
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        🔗 New Tab
                                    </button>

                                    {/* Close Button */}
                                    <button
                                        onClick={closePdfViewer}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                                    >
                                        ✕ Close
                                    </button>
                                </div>
                            </div>

                            {/* PDF Viewer */}
                            <div className="flex-1 bg-gray-100">
                                <iframe
                                    src={selectedPdf.url}
                                    className="w-full h-full border-0"
                                    title={selectedPdf.title}
                                    loading="lazy"
                                    onError={(e) => {
                                        console.log(
                                            "Native iframe failed, trying Google Docs viewer"
                                        );
                                        e.target.src = `https://docs.google.com/viewer?url=${encodeURIComponent(
                                            selectedPdf.url
                                        )}&embedded=true`;
                                    }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </>
       
    );
};

export default NotesPdfPage;
