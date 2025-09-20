import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getFreeTopicWisePaperSlice } from "../../../redux/freeTestSlice";
import { useNavigate } from "react-router-dom";
import { getAllGkSlice } from "../../../redux/HomeSlice";

const GkCapage = () => {
    const dispatch = useDispatch();
    const [freeQuizData, setFreeQuizData] = useState([]);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const [openPdf, setOpenPdf] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");

    const handleFetchFreeQuiz = async () => {
        try {
            setLoading(true);
            const res = await dispatch(getAllGkSlice()).unwrap();
            console.log("FreeTopicswisePaper Data", res);
            setFreeQuizData(res.data.data || []);
        } catch (error) {
            console.log("Error fetching topic wise test:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchFreeQuiz();
    }, []);

    const openPdfModal = (url) => {
        setPdfUrl(url);
        setOpenPdf(true);
    };

    const closePdfModal = () => {
        setPdfUrl("");
        setOpenPdf(false);
    };

    return (
        <div className="p-4">
            <div className="flex center justify-center">
                <div></div>
                <h2 className="text-2xl font-bold mb-4">GK & Current Affairs Practice Test</h2>
                <div></div>
            </div>


            {loading && <p className="text-center text-lg">Loading...</p>}

            {!loading && freeQuizData.length === 0 && (
                <p className="text-center text-gray-500">No GK  tests found.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {freeQuizData.map((test) => (
                    <div
                        key={test.test_id}
                        className="relative shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all h-40 flex flex-col
             border border-black/30"
                        style={{
                            backgroundImage: `url('/bg.webp')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",

                        }}
                    >
                        {/* Optional gradient overlay */}
                        {/* <div className="absolute inset-0 bg-gradient-to-tr from-sky-300 via-sky-400 to-teal-400 opacity-60"></div> */}

                        {/* Inner content */}
                        <div className="relative p-4 flex flex-col flex-grow bg-white/70 backdrop-blur-sm h-full">
                            <h3 className="text-sm font-semibold mb-2 line-clamp-2">
                                {test.title}
                            </h3>

                            <p className="text-gray-700 text-sm">
                                Questions: {test.total_questions} | Marks: {test.total_marks} | Time: {test.time} mins
                            </p>

                            <div className="mt-auto">
                                {!test.attend ? (
                                    <button
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                        onClick={() =>
                                            nav("/free-quizes-instruction", { state: { testInfo: test } })
                                        }
                                    >
                                        Start Test
                                    </button>
                                ) : (
                                    <span className="inline-block text-green-600 font-semibold">
                                        Already Attended
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PDF Modal */}
            {openPdf && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-4/5 rounded-lg relative">
                        <button
                            onClick={closePdfModal}
                            className="absolute top-3 right-3 text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full rounded-lg"
                            title="PDF Viewer"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GkCapage;
