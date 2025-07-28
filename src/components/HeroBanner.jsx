import React from 'react';
import { FaGooglePlay, FaApple, FaWhatsapp, FaAngleRight } from 'react-icons/fa';
import SwiperSlider from './SwiperSlider';

const HeroBanner = ({ banner }) => {
    return (
        <section className="w-full bg-gradient-to-b from-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-10">
                {/* Left Content */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 leading-tight">
                        Practice SSC's new UI Today <br />
                        <span className="font-bold text-gray-900">Crack your Exam Tomorrow</span>
                    </h2>
                    <p className="text-sm flex justify-center md:justify-start items-center gap-2 text-gray-600 mt-3">
                        Learn <FaAngleRight /> Revise <FaAngleRight /> Crack
                    </p>
                    <p className="mt-4 text-gray-700">Start your selection's journey. Just Free!</p>

                    {/* Download Buttons */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mt-6">
                        {/* Text */}
                        <div className="text-sm text-gray-600 whitespace-nowrap">Available soon</div>

                        {/* Store Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="#"
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition whitespace-nowrap"
                            >
                                <FaGooglePlay size={20} />
                                <span>Google Play</span>
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition whitespace-nowrap"
                            >
                                <FaApple size={20} />
                                <span>App Store</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Side Slider */}
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    {banner && <SwiperSlider banner={banner} />}
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-green-100 p-4 rounded-xl shadow">
                    <div className="text-green-600 font-bold text-xl">150K+</div>
                    <div className="text-gray-700 text-sm">Practice Questions</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl shadow">
                    <div className="text-yellow-600 font-bold text-xl">15K+</div>
                    <div className="text-gray-700 text-sm">Mock Tests</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl shadow">
                    <div className="text-purple-600 font-bold text-xl">18K+</div>
                    <div className="text-gray-700 text-sm">Previous Year Papers</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl shadow">
                    <div className="text-orange-600 font-bold text-xl">10K+</div>
                    <div className="text-gray-700 text-sm">Expert Curated Notes</div>
                </div>
            </div>

            {/* WhatsApp Icon */}
            <div className="fixed bottom-5 right-5 z-50">
                <a href="https://wa.me/917822936229" target="_blank" rel="noopener noreferrer">
                    <div className="bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-lg transition">
                        <FaWhatsapp size={28} color="white" />
                    </div>
                </a>
            </div>
        </section>
    );
};

export default HeroBanner;
