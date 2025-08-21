import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { helpAndSupportSlice } from "../../redux/HomeSlice";
import { showErrorToast, showSuccessToast } from "../../utils/ToastUtil";

const RaiseYourQuery = () => {
    const dispatch = useDispatch()
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [selectedQueryTypes, setSelectedQueryTypes] = useState([]);
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState("");
    const queryTypes = [
        "Course Related",
        "Test Series Issue",
        "Payment Problem",
        "App Not Working",
        "Other",
    ];


    const toggleQueryType = (type) => {
        setSelectedQueryTypes((prev) =>
            prev.includes(type)
                ? prev.filter((item) => item !== type)
                : [...prev, type]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const queryData = {
                "title": selectedQueryTypes,
                "mobile":'',
                "message": query
            }
            const res = await dispatch(helpAndSupportSlice(queryData)).unwrap()
            if (res.status_code == 200) {
                showSuccessToast(res.message)
                setSelectedQueryTypes([])
                setQuery('')
                // console.log("query data", res)
            } else {
                showErrorToast(res.message)
            }
        } catch (error) {
            console.log("error", error)

        } finally {
            setLoading(false)

        }
    };




    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            {/* <div className="flex items-center gap-2 p-4 border-b bg-white shadow-sm">
        <button className="text-xl">←</button>
        <h1 className="text-lg font-medium">Raise Your Query</h1>
      </div> */}

            {/* Content */}
            <div className="flex-1 p-4">
                {/* Select Query */}
                <h2 className="text-sm font-semibold mb-2">Select Query Type(s)</h2>
                <div className="flex flex-wrap gap-3 mb-6">
                    {queryTypes.map((type) => {
                        const isSelected = selectedQueryTypes.includes(type);
                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => toggleQueryType(type)}
                                className={`px-4 py-2 rounded-full border transition 
                            ${isSelected
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                    }`}
                            >
                                {type}
                            </button>
                        )
                    }

                    )}
                </div>

                {/* Query Input */}
                <h2 className="text-sm font-semibold mb-2">Write Your Query</h2>
                <textarea
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type here..."
                    value={query}
                    className="w-full h-28 p-3 border rounded-md text-sm outline-none focus:ring-2 focus:ring-teal-600"
                />

                {/* Submit */}
                <button
onClick={handleSubmit}
                    disabled={!selectedQueryTypes.length > 0 || !query}
                    className={`w-full py-3 rounded-lg text-white font-medium transition 
              ${!selectedQueryTypes.length > 0 || !query
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}

                >
                    {
                        loading ? "Please wait.." : "Submit"
                    }
                </button>
            </div>
        </div>
    );
};

export default RaiseYourQuery;
