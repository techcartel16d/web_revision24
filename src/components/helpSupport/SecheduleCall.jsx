import React, { useState } from "react";
import { helpAndSupportSlice } from "../../redux/HomeSlice";
import { showErrorToast, showSuccessToast } from "../../utils/ToastUtil";
import { useDispatch } from "react-redux";

const ScheduleCall = () => {
    const dispatch = useDispatch()
    const [mobile, setMobile] = useState("");
    const [query, setQuery] = useState("");
    const [selectedQueryTypes, setSelectedQueryTypes] = useState([]);
    const [loading, setLoading] = useState(false)
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
                "mobile": mobile,
                "message": query
            }
            const res = await dispatch(helpAndSupportSlice(queryData)).unwrap()
            if (res.status_code == 200) {
                showSuccessToast(res.message)
                setMobile('')
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
        <div className="min-h-screen bg-gray-50 flex justify-center items-start py-8 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Raise Your Query</h2>

                {/* Query Types */}
                <p className="font-medium mb-2">Select Query Type(s)</p>
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter mobile number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Write Your Query
                        </label>
                        <textarea
                            placeholder="Type here..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedQueryTypes.length > 0 || !mobile || !query}
                        className={`w-full py-3 rounded-lg text-white font-medium transition 
              ${!selectedQueryTypes.length > 0 || !mobile || !query
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {
                            loading ? 'please wait...' : 'Submit'
                        }

                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleCall;
