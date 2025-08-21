import React, { useState } from "react";
import { ArrowLeft, FileText, Phone } from "lucide-react";
import RaiseYourQuery from "../components/helpSupport/RaiseYourQuery";
import ScheduleCall from "../components/helpSupport/SecheduleCall";

const HelpAndSupportPage = () => {
    const [selectedSupport, setSelectedSupport] = useState('raise')
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            {/* <div className="flex items-center p-4 border-b bg-white shadow-sm">
        <ArrowLeft className="w-5 h-5 mr-2 cursor-pointer text-gray-700" />
        <h1 className="text-lg font-medium text-gray-800">Help & Support</h1>
      </div> */}

            {/* Content */}
            <div className="p-4 flex flex-col gap-4">
                {/* Raise Query */}
                <div onClick={() => setSelectedSupport('raise')} className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-700" />
                        <span className="text-gray-800 font-medium">Raise Your Query</span>
                    </div>
                    <span className="text-gray-500">›</span>
                </div>

                {/* Schedule Call */}
                <div onClick={() => setSelectedSupport('call')} className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-700" />
                        <span className="text-gray-800 font-medium">Schedule a Call</span>
                    </div>
                    <span className="text-gray-500">›</span>
                </div>
            </div>
            {
                selectedSupport == "raise" ? (
                    <RaiseYourQuery />
                ) : (
                    <ScheduleCall />
                )

            }
        </div>
    );
};

export default HelpAndSupportPage;
