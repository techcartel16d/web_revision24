import React, { useState } from "react";
import { ArrowLeft, FileText, Phone, CheckCircle2 } from "lucide-react";
import RaiseYourQuery from "../components/helpSupport/RaiseYourQuery";
import ScheduleCall from "../components/helpSupport/SecheduleCall";

const HelpAndSupportPage = () => {
    const [selectedSupport, setSelectedSupport] = useState('raise');

    const supportOptions = [
        {
            id: 'raise',
            title: 'Raise Your Query',
            description: 'Submit a written query and get detailed responses',
            icon: FileText,
            color: 'blue'
        },
        {
            id: 'call',
            title: 'Schedule a Call',
            description: 'Talk directly with our support team',
            icon: Phone,
            color: 'green'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-4 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Help & Support
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Choose how you'd like to get assistance from our support team
                    </p>
                </div>
            </div>

            {/* Support Options */}
            <div className="p-4 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {supportOptions.map((option) => {
                            const IconComponent = option.icon;
                            const isSelected = selectedSupport === option.id;
                            
                            return (
                                <div
                                    key={option.id}
                                    onClick={() => setSelectedSupport(option.id)}
                                    className={`
                                        group relative bg-white rounded-2xl shadow-lg p-6 sm:p-8 cursor-pointer
                                        border-2 transition-all duration-300 transform hover:scale-105
                                        ${isSelected 
                                            ? option.color === 'blue'
                                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-blue-200'
                                                : 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-green-200'
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
                                        }
                                    `}
                                >
                                    {/* Selected Indicator */}
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 z-10">
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center shadow-lg
                                                ${option.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}
                                            `}>
                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`
                                            w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg
                                            transition-all duration-300 group-hover:scale-110
                                            ${isSelected
                                                ? option.color === 'blue'
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                                    : 'bg-gradient-to-r from-green-500 to-green-600'
                                                : 'bg-gradient-to-r from-gray-400 to-gray-500 group-hover:from-blue-500 group-hover:to-blue-600'
                                            }
                                        `}>
                                            <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                        </div>

                                        <div className={`
                                            text-2xl transition-all duration-300
                                            ${isSelected ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'}
                                        `}>
                                            →
                                        </div>
                                    </div>

                                    {/* Title and Description */}
                                    <div className="mb-6">
                                        <h3 className={`
                                            text-xl sm:text-2xl font-bold mb-3 transition-colors
                                            ${isSelected 
                                                ? option.color === 'blue' ? 'text-blue-700' : 'text-green-700'
                                                : 'text-gray-900 group-hover:text-blue-600'
                                            }
                                        `}>
                                            {option.title}
                                        </h3>
                                        <p className={`
                                            text-sm sm:text-base leading-relaxed transition-colors
                                            ${isSelected ? 'text-gray-700' : 'text-gray-600'}
                                        `}>
                                            {option.description}
                                        </p>
                                    </div>

                                    {/* Status Bar */}
                                    <div className={`
                                        h-1 w-full rounded-full transition-all duration-300
                                        ${isSelected
                                            ? option.color === 'blue'
                                                ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                                                : 'bg-gradient-to-r from-green-400 to-green-600'
                                            : 'bg-gray-200 group-hover:bg-blue-200'
                                        }
                                    `}></div>

                                    {/* Selected Label */}
                                    {isSelected && (
                                        <div className="mt-4 flex items-center justify-center">
                                            <span className={`
                                                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                                                ${option.color === 'blue' 
                                                    ? 'bg-blue-100 text-blue-700' 
                                                    : 'bg-green-100 text-green-700'
                                                }
                                            `}>
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Currently Selected
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Selected Support Component */}
            <div className="flex-1">
                {selectedSupport === "raise" ? (
                    <RaiseYourQuery />
                ) : (
                    <ScheduleCall />
                )}
            </div>
        </div>
    );
};

export default HelpAndSupportPage;
