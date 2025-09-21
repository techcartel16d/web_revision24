import React, { useState } from "react";
import { helpAndSupportSlice } from "../../redux/HomeSlice";
import { showErrorToast, showSuccessToast } from "../../utils/ToastUtil";
import { useDispatch } from "react-redux";

const ScheduleCall = () => {
    const dispatch = useDispatch();
    const [mobile, setMobile] = useState("");
    const [query, setQuery] = useState("");
    const [selectedQueryTypes, setSelectedQueryTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const queryTypes = [
        { label: "Course Related", icon: "📚", color: "emerald" },
        { label: "Test Series Issue", icon: "📝", color: "blue" },
        { label: "Payment Problem", icon: "💳", color: "red" },
        { label: "App Not Working", icon: "⚙️", color: "purple" },
        { label: "Other", icon: "💬", color: "orange" }
    ];

    const getColorClasses = (color, isSelected) => {
        const colorMap = {
            emerald: isSelected 
                ? "bg-emerald-500 text-white border-emerald-500 shadow-emerald-200" 
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
            blue: isSelected 
                ? "bg-blue-500 text-white border-blue-500 shadow-blue-200" 
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
            red: isSelected 
                ? "bg-red-500 text-white border-red-500 shadow-red-200" 
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
            purple: isSelected 
                ? "bg-purple-500 text-white border-purple-500 shadow-purple-200" 
                : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
            orange: isSelected 
                ? "bg-orange-500 text-white border-orange-500 shadow-orange-200" 
                : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
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
                "mobile": mobile,
                "message": query
            };
            const res = await dispatch(helpAndSupportSlice(queryData)).unwrap();
            if (res.status_code == 200) {
                showSuccessToast(res.message);
                setMobile('');
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

    const validatePhone = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    };

    const isFormValid = selectedQueryTypes.length > 0 && mobile && query.trim() && validatePhone(mobile);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-xl">📞</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Schedule a Call
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                                Request a callback and we'll reach out to you
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
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                                <span className="mr-2">🏷️</span>
                                Select Query Type(s)
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Choose the categories that best describe your concern
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

                    {/* Contact Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                                <span className="mr-2">📱</span>
                                Contact Information
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Provide your mobile number for the callback
                            </p>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mobile Number *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">🇮🇳 +91</span>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter your 10-digit mobile number"
                                    value={mobile}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        if (value.length <= 10) {
                                            setMobile(value);
                                        }
                                    }}
                                    className={`
                                        w-full pl-20 pr-4 py-4 border-2 rounded-xl text-sm sm:text-base 
                                        outline-none transition-all duration-300
                                        ${!mobile || validatePhone(mobile) 
                                            ? 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100' 
                                            : 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                        }
                                        placeholder-gray-400
                                    `}
                                    maxLength={10}
                                />
                            </div>
                            {mobile && !validatePhone(mobile) && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Please enter a valid 10-digit mobile number
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Query Details */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                                <span className="mr-2">✍️</span>
                                Describe Your Query
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Provide details about your query so we can assist you better
                            </p>
                        </div>

                        <div className="relative">
                            <textarea
                                placeholder="Please describe your query in detail. Include any specific issues, error messages, or questions you have..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                rows={6}
                                className="w-full p-4 sm:p-6 border-2 border-gray-200 rounded-xl text-sm sm:text-base 
                                         outline-none transition-all duration-300 resize-none
                                         focus:border-green-500 focus:ring-4 focus:ring-green-100
                                         placeholder-gray-400"
                                maxLength={500}
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                                {query.length}/500
                            </div>
                        </div>
                    </div>

                    {/* Call Schedule Info */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 sm:p-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl">⏰</span>
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    Call Schedule Information
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Our support team will contact you
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <span className="text-green-600">📞</span>
                                <span className="text-gray-700">Response within 24 hours</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-blue-600">🕐</span>
                                <span className="text-gray-700">Working hours: 9 AM - 6 PM</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-purple-600">📅</span>
                                <span className="text-gray-700">Monday to Friday</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-orange-600">🎯</span>
                                <span className="text-gray-700">Priority support available</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        <button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className={`
                                w-full py-4 sm:py-5 rounded-xl font-semibold text-base sm:text-lg
                                transition-all duration-300 transform focus:outline-none focus:ring-4
                                ${!isFormValid || loading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 hover:scale-105 focus:ring-green-200 shadow-lg hover:shadow-xl"
                                }
                            `}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Scheduling Your Call...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <span>📞</span>
                                    <span>Schedule Call Now</span>
                                </div>
                            )}
                        </button>

                        {!isFormValid && (
                            <div className="mt-4 space-y-2">
                                {selectedQueryTypes.length === 0 && (
                                    <p className="text-sm text-red-600 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        Please select at least one query type
                                    </p>
                                )}
                                {!mobile && (
                                    <p className="text-sm text-red-600 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        Mobile number is required
                                    </p>
                                )}
                                {mobile && !validatePhone(mobile) && (
                                    <p className="text-sm text-red-600 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        Please enter a valid mobile number
                                    </p>
                                )}
                                {!query.trim() && (
                                    <p className="text-sm text-red-600 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        Please describe your query
                                    </p>
                                )}
                            </div>
                        )}

                        {isFormValid && (
                            <p className="text-center text-sm text-green-600 mt-4 flex items-center justify-center">
                                <span className="mr-1">✓</span>
                                Ready to schedule your call
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleCall;
