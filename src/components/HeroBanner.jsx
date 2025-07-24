import React from 'react';
import { FaGooglePlay, FaApple, FaWhatsapp, FaAngleRight } from 'react-icons/fa';
import SwiperSlider from './SwiperSlider';

const HeroBanner = ({ banner }) => {

    return (
        <section className="w-full bg-gradient-to-b from-white to-blue-50">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
                {/* Left Content */}
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
                        Practice SSC's new UI Today <br />
                        <span className="font-bold text-gray-900">Crack your Exam Tomorrow</span>
                    </h2>
                    <p className="text-sm flex items-center  text-gray-600 mt-3">
                        Learn <FaAngleRight /> Revise <FaAngleRight />Crack
                    </p>
                    <p className="mt-4 text-gray-700">Start your selection's journey. Just Free!</p>
                    <div>

                    </div>
                    <div className="flex items-center gap-4 mt-6">
                        {/* <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md shadow">
                            Get Started For Free
                        </button> */}

                        <div className='flex flex-col items-center gap-3'>
                            <h1>Available soon</h1>
                            <div className='flex items-center justify-center gap-2'>
                                <a href="#" className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100">
                                    <FaGooglePlay size={20} />
                                    <span>Google Play</span>
                                </a>
                                <a href="#" className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100">
                                    <FaApple size={20} />
                                    <span>App Store</span>
                                </a>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Right Image */}
                <div className="md:w-1/2 flex justify-center">
                    {/* <img
                        src={banner[0]?.image}
                        alt="Exam Prep Illustration"
                        className="max-w-md w-full"
                    /> */}
                    {
                        banner && (

                            <SwiperSlider banner={banner} />
                        )
                    }
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-5xl mx-auto px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-green-100 p-4 rounded-xl shadow">
                    <div className="text-green-600 font-bold text-lg">150K +</div>
                    <div className="text-gray-700 text-sm">Practice Questions</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl shadow">
                    <div className="text-yellow-600 font-bold text-lg">15K +</div>
                    <div className="text-gray-700 text-sm">Mock Tests</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl shadow">
                    <div className="text-purple-600 font-bold text-lg">18K +</div>
                    <div className="text-gray-700 text-sm">Previouse Year Papers</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl shadow">
                    <div className="text-orange-600 font-bold text-lg">10K +</div>
                    <div className="text-gray-700 text-sm">Expert Curated Notes</div>
                </div>
            </div>

            {/* WhatsApp Icon */}
            <div className="fixed bottom-5 right-5 z-50">
                <a href="https://wa.me/917822936229" target="_blank" rel="noopener noreferrer">
                    <div className="bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-lg">
                        <FaWhatsapp size={28} color="white" />
                    </div>
                </a>
            </div>
        </section>
    );
};

export default HeroBanner;
