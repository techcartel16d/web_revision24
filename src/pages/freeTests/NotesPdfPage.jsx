import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getMindMapSlice } from "../../redux/freeTestSlice";
import PdfViewerEditor from "../pdfView/PdfViewers";

const NotesPdfPage = () => {
    const dispatch = useDispatch();
    const [mindMapData, setMindMapData] = useState([]);
    const [pdfUri, setPdfUri] = useState('')
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

    useEffect(() => {
        fetchMindMapData(1);
    }, []);

    return (
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
                                            onClick={() => {
                                                setPdfUri(item.pdf)
                                            }}
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
        </div>
    );
};

export default NotesPdfPage;
