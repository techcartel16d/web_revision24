import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { helpAndSupportSlice } from "../../redux/HomeSlice";
import { showErrorToast, showSuccessToast } from "../../utils/ToastUtil";

const RaiseYourQuery = () => {
    const dispatch = useDispatch();
    const [selectedQueryTypes, setSelectedQueryTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    
    const queryTypes = [
        { label: "Course Related", icon: "📚", color: "blue" },
        { label: "Test Series Issue", icon: "📝", color: "green" },
        { label: "Payment Problem", icon: "💳", color: "red" },
        { label: "App Not Working", icon: "⚙️", color: "purple" },
        { label: "Other", icon: "💬", color: "gray" }
    ];

    const getColorClasses = (color, isSelected) => {
        const colorMap = {
            blue: isSelected 
                ? "bg-blue-500 text-white border-blue-500 shadow-blue-200" 
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
            green: isSelected 
                ? "bg-green-500 text-white border-green-500 shadow-green-200" 
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
            red: isSelected 
                ? "bg-red-500 text-white border-red-500 shadow-red-200" 
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
            purple: isSelected 
                ? "bg-purple-500 text-white border-purple-500 shadow-purple-200" 
                : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
            gray: isSelected 
                ? "bg-gray-500 text-white border-gray-500 shadow-gray-200" 
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
        };
        return colorMap[color];
    };

    const toggleQueryType = (type) => {
        setSelectedQueryTypes((prev) =>
            prev.includes(type)
                ? prev.filter((item) => item !== type)
                : [...prev, type]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const queryData = {
                "title": selectedQueryTypes,
                "mobile": '',
                "message": query
            };
            const res = await dispatch(helpAndSupportSlice(queryData)).unwrap();
            if (res.status_code == 200) {
                showSuccessToast(res.message);
                setSelectedQueryTypes([]);
                setQuery('');
            } else {
                showErrorToast(res.message);
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-xl">💬</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Raise Your Query
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                                We're here to help you with any questions or concerns
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Query Type Selection */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                Select Query Type(s)
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Choose one or more categories that best describe your issue
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {queryTypes.map((type) => {
                                const isSelected = selectedQueryTypes.includes(type.label);
                                return (
                                    <button
                                        key={type.label}
                                        type="button"
                                        onClick={() => toggleQueryType(type.label)}
                                        className={`
                                            group relative p-4 rounded-xl border-2 transition-all duration-300 
                                            transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50
                                            ${getColorClasses(type.color, isSelected)}
                                            ${isSelected ? 'shadow-lg' : 'hover:shadow-md'}
                                        `}
                                    >
                                        <div className="flex flex-col items-center space-y-2">
                                            <span className="text-2xl">{type.icon}</span>
                                            <span className="font-medium text-sm sm:text-base text-center">
                                                {type.label}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Query Input */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                Describe Your Issue
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Please provide detailed information about your query
                            </p>
                        </div>

                        <div className="relative">
                            <textarea
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type your query here... Be as specific as possible to help us assist you better."
                                value={query}
                                rows={6}
                                className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-xl text-sm sm:text-base 
                                         outline-none transition-all duration-300 resize-none
                                         focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                                         placeholder-gray-400"
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                                {query.length}/500
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        <button
                            type="submit"
                            disabled={selectedQueryTypes.length === 0 || !query.trim() || loading}
                            className={`
                                w-full py-4 sm:py-5 rounded-xl font-semibold text-base sm:text-lg
                                transition-all duration-300 transform focus:outline-none focus:ring-4
                                ${selectedQueryTypes.length === 0 || !query.trim() || loading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 focus:ring-blue-200 shadow-lg hover:shadow-xl"
                                }
                            `}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Submitting...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <span>Submit Query</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                            )}
                        </button>

                        {selectedQueryTypes.length === 0 || !query.trim() ? (
                            <p className="text-center text-sm text-gray-500 mt-4">
                                Please select at least one query type and write your message
                            </p>
                        ) : (
                            <p className="text-center text-sm text-green-600 mt-4">
                                ✓ Ready to submit your query
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RaiseYourQuery;
