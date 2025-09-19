import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getfreeQuizesData } from "../../redux/freeQuizeSlice";
import { Swiper, SwiperSlide } from "swiper/react";

const Allfreequizs = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [quizData, setQuizData] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // PDF modal state
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleFetchFreeQuiz = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getfreeQuizesData()).unwrap();
      console.log("FreeTopicswisePaper Data", res);

      if (res && typeof res === "object" && Object.keys(res).length > 0) {
        const keys = Object.keys(res); // e.g. ["SSC CGL - Graduation Level", "SSC CHSL - 12th Level"]
        setQuizData(res);
        setCategories(keys);
        setSelectedCategory(keys[0]); // default select first category
      } else {
        setQuizData({});
        setCategories([]);
        setSelectedCategory("");
      }
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

  const currentTests = quizData[selectedCategory] || [];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Free Quizes</h2>



      {/* Filter for Categories */}
      {categories.length > 0 && (
        <div className="mb-4">
          <Swiper
            spaceBetween={10}
            slidesPerView="auto"
            className="!overflow-visible"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat} style={{ width: "auto" }}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded ${selectedCategory === cat
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                    }`}
                >
                  {cat}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {loading && <p className="text-center text-lg">Loading...</p>}

      {!loading && currentTests.length === 0 && (
        <p className="text-center text-gray-500">No free topic tests found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentTests.map((test) => (
          <div
            key={test.test_id}
            className="bg-white shadow-md rounded-lg border overflow-hidden hover:shadow-xl transition-all h-40 flex flex-col"
          >
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-sm font-semibold mb-2 line-clamp-2">
                {test.title}
              </h3>

              <p className="text-gray-700 text-sm">
                Questions: {test.total_questions} | Marks: {test.total_marks} | Time: {test.time} mins
              </p>

              {/* {test.syllabus && (
                <button
                  onClick={() => openPdfModal(test.syllabus)}
                  className="mt-2 inline-block text-blue-600 text-sm hover:underline"
                >
                  View Syllabus
                </button>
              )} */}

              {/* Push button/span to bottom */}
              <div className="mt-auto">
                {!test.attend ? (
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={() =>
                      nav("/free-quizes-instruction", {
                        state: { testInfo: test },
                      })
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

export default Allfreequizs;
