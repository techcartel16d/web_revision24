import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Screen3 = () => {
    const nav = useNavigate()
    const { state } = useLocation();
    console.log("screen3 state===>", state)

    return (
        <div className="px-6 py-4">
            {/* Header */}
            <div className='flex justify-between items-center gap-5 my-3'>
                <h1 className="text-xl font-semibold">SSC ONLINE MOCK TEST</h1>
                <div className='flex items-center justify-center gap-3'>
                    <p className="text-2xl font-bold text-blue-800">
                        {state?.userData?.systemNumber || 'R2400000'}
                    </p>
                </div>
            </div>

            <div className="text-sm w-full bg-blue-400 text-left text-white px-3 py-2 mb-6 font-bold rounded">
                Candidate Name : {state?.userData?.candidateName || 'N/A'}
            </div>

            {/* Instructions & Overview */}
            <div className="text-[15px] text-gray-800 ">
                <h2 className="font-bold mb-3">Instructions, Terms & Conditions</h2>
                <div className="overflow-x-auto my-4">
                    <table className="w-full border border-gray-300 text-sm text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-3 py-2">Section</th>
                                <th className="border border-gray-300 px-3 py-2">Subject</th>
                                <th className="border border-gray-300 px-3 py-2">Number of Questions</th>
                                <th className="border border-gray-300 px-3 py-2">Maximum Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-3 py-2">PART-1</td>
                                <td className="border px-3 py-2">General Intelligence & Reasoning</td>
                                <td className="border px-3 py-2">25</td>
                                <td className="border px-3 py-2">50</td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="border px-3 py-2">PART-2</td>
                                <td className="border px-3 py-2">General Awareness</td>
                                <td className="border px-3 py-2">25</td>
                                <td className="border px-3 py-2">50</td>
                            </tr>
                            <tr>
                                <td className="border px-3 py-2">PART-3</td>
                                <td className="border px-3 py-2">Quantitative Aptitude</td>
                                <td className="border px-3 py-2">25</td>
                                <td className="border px-3 py-2">50</td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="border px-3 py-2">PART-4</td>
                                <td className="border px-3 py-2">English Comprehensions</td>
                                <td className="border px-3 py-2">25</td>
                                <td className="border px-3 py-2">50</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Exam Overview */}
                <ol className="list-decimal pl-5 space-y-4">
                    <li>

                        <p className="font-bold mb-2">Exam Overview / परीक्षा का संक्षिप्त विवरण</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                Duration: <span className="font-bold text-blue-700">60 minutes</span> / समयावधि: <span className="font-bold text-blue-700">60 मिनट</span>
                            </li>
                            <li>
                                Total Questions: <span className="font-bold text-blue-700">100</span> / कुल प्रश्न: <span className="font-bold text-blue-700">100</span>
                            </li>
                            <li>
                                Negative Marking: 0.5 marks deducted for each wrong answer. / ऋणात्मक अंकन: प्रत्येक गलत उत्तर पर <span className="font-bold">0.5</span> अंक काटे जाएंगे।
                            </li>
                            <li>
                                Number of Sections displayed at any time: <span className="font-bold text-blue-700">4</span> / किसी भी समय पर प्रदर्शित अनुभागों की संख्या: <span className="font-bold text-blue-700">4</span>
                            </li>
                        </ul>

                        {/* Table */}

                    </li>
                    {/* After the Table */}
                    <div className="mt-6 space-y-6 text-[15px] text-gray-800">
                        {/* 2. Timing & Submission */}
                        <li>
                            <p className="font-bold mb-2">Timing & Submission / समय और उत्तर जमा करना</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    The timer displayed at the top-right corner is controlled by the server. Remaining time will be shown there. <br />
                                    ऊपरी दाएँ कोने में दिखाई देने वाला टाइमर सर्वर द्वारा नियंत्रित होता है। शेष समय वहीं प्रदर्शित होगा।
                                </li>
                                <li>
                                    Once the time is over, the exam will automatically be submitted. You do not need to submit it manually. <br />
                                    समय समाप्त होने पर परीक्षा स्वतः जमा हो जाएगी। मैन्युअल रूप से सबमिट करने की आवश्यकता नहीं है।
                                </li>

                            </ul>
                        </li>

                        {/* 3. Language */}
                        <li>
                            <p className="font-bold mb-2">Language / भाषा</p>
                            <ul className="list-disc pl-5 space-y-1">

                                <li>Apart from English, questions and options for all other subjects will be displayed in both English and Hindi languages<br />
                                    अंग्रेजी के अलावा, अन्य सभी विषयों के प्रश्न और विकल्प अंग्रेजी और हिंदी दोनों भाषाओं में प्रदर्शित किए जाएंगे</li>
                                <li>If you choose English, questions will still appear only in English.<br />यदि आपने English चुना, तो प्रश्न केवल अंग्रेज़ी में ही दिखाई देंगे।</li>
                                <li>If you choose Hindi, questions will appear in both Hindi and English.<br />यदि आपने Hindi चुना, तो प्रश्न हिंदी और अंग्रेज़ी दोनों में प्रदर्शित होंगे।</li>
                                <li>You can change your language preference during the exam for sections where it is allowed.<br />जहाँ अनुमति हो, वहाँ परीक्षा के दौरान भाषा वरीयता बदली जा सकती है।</li>
                               
                            </ul>
                        </li>

                        {/* 4. Navigation */}
                        <li>
                            <p className="font-bold mb-2">Navigation / नेविगेशन</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>All sections remain accessible throughout the exam. You can switch between sections or questions freely by clicking their names (top left) or question numbers.<br />सभी अनुभाग परीक्षा के दौरान खुले रहते हैं। आप बाएँ ऊपर अनुभाग नाम या प्रश्न संख्या पर क्लिक करके किसी भी अनुभाग या प्रश्न पर जा सकते हैं।</li>
                                <li>Use the "Previous" or "Save & Next" buttons to move between questions. Use "Mark for Review" to flag questions you want to revisit.<br />प्रश्नों के बीच जाने के लिए "Previous" या "Save & Next" का उपयोग करें। किसी प्रश्न को बाद में देखने के लिए "Mark for Review" विकल्प चुनें।</li>
                                <li>After the last question of a section, clicking "Save & Next" will take you to the next section.<br />किसी अनुभाग का अंतिम प्रश्न पूरा करने के बाद "Save & Next" बटन अगला अनुभाग खोलेगा।</li>
                            </ul>
                        </li>

                        {/* 5. Answering */}
                        <li>
                            <p className="font-bold mb-2">Answering / उत्तर देना</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Each question contains four options; only one is correct. You can select or change your answer anytime before saving.<br />हर प्रश्न के चार विकल्प होते हैं, जिनमें से केवल एक सही होता है। सहेजने से पहले उत्तर कभी भी चुना या बदला जा सकता है।</li>
                                <li>The answer is saved only when you click "Save & Next".<br />"Save & Next" पर क्लिक करने के बाद ही उत्तर सुरक्षित होता है।</li>
                                <li>To modify a saved answer, revisit the question, make changes, and save it again.<br />सहेजे गए उत्तर को बदलने के लिए, प्रश्न पर वापस जाएँ, उत्तर बदलें और फिर से सुरक्षित करें।</li>
                            </ul>
                        </li>

                        {/* 6. Additional Notes */}
                        <li>
                            <p className="font-bold mb-2">Additional Notes / अतिरिक्त निर्देश</p>
                            <ul className="list-disc pl-5 space-y-1">
                            
                                <li>The system saves each response automatically and submits it when the time is over.<br />हर उत्तर सिस्टम द्वारा स्वतः सहेजा जाता है और समय समाप्त होने पर परीक्षा स्वतः सबमिट हो जाती है।</li>
                                <li>If you have doubts related to exam content,You can report the question.<br />यदि आपको परीक्षा सामग्री से संबंधित कोई संदेह है, तो आप प्रश्न की रिपोर्ट कर सकते हैं।।</li>
                                <li>In case of a technical issue you can contact our customer support team.<br />किसी तकनीकी समस्या के मामले में आप हमारी ग्राहक सहायता टीम से संपर्क कर सकते हैं।</li>
                            </ul>
                        </li>

                        <p className="text-center font-semibold text-green-700 mt-4">Good Luck! / शुभकामनाएँ!</p>
                    </div>
                </ol>
            </div>
            <div className="flex justify-center my-4">
                <button
                    className="bg-blue-700 text-white px-6 py-2 cursor-pointer rounded hover:bg-blue-800"
                    onClick={() => {
                        // Replace this with your exam start logic
                        console.log('Start Exam');
                        nav("/screen4", {state:state})
                    }}
                >
                    Agree
                </button>
            </div>
        </div>
    );
};

export default Screen3;
