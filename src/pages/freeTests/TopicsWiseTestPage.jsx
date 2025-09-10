import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getFreeTopicWisePaperSlice } from "../../redux/freeTestSlice";
import { useNavigate } from "react-router-dom";

const TopicsWiseTestPage = () => {
  const dispatch = useDispatch();
  const [freeQuizData, setFreeQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate()
  // PDF modal state
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleFetchFreeQuiz = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getFreeTopicWisePaperSlice()).unwrap();
      // console.log("FreeTopicswisePaper Data", res);
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
    console.log(url)
    setPdfUrl(url);
    setOpenPdf(true);
  };

  const closePdfModal = () => {
    setPdfUrl("");
    setOpenPdf(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Topics Wise Test Series</h2>

      {loading && <p className="text-center text-lg">Loading...</p>}

      {!loading && freeQuizData.length === 0 && (
        <p className="text-center text-gray-500">No free topic tests found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {freeQuizData.map((test) => (
          <div
            key={test.id}
            className="bg-white shadow-md rounded-lg border overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{test.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{test.short_desc}</p>
              <p className="text-gray-700 text-sm">
                Questions: {test.no_of_question} | Marks: {test.marks} | Time: {test.time} mins
              </p>
              <p className="text-gray-700 text-sm">
                Type: {test.test_series_type} | Status: {test.status}
              </p>

              {test.syllabus && (
                <button
                  onClick={() => openPdfModal(test.syllabus)}
                  className="mt-2 inline-block text-blue-600 text-sm hover:underline"
                >
                  View Syllabus
                </button>
              )}

              {test.is_start && !test.attend && (
                <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" onClick={() => nav("/practice-test-instruction")}>
                  Start Test
                </button>
              )}

              {test.attend && (
                <span className="mt-3 inline-block text-green-600 font-semibold">
                  Already Attended
                </span>
              )}
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

export default TopicsWiseTestPage;
