import React, { useEffect, useState } from 'react';
import { FaGooglePlay, FaApple, FaWhatsapp, FaAngleRight, FaRocket, FaUsers, FaAward, FaTrophy } from 'react-icons/fa';
import { MdPlayArrow, MdStar, MdTrendingUp, MdSchool } from 'react-icons/md';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import SwiperSlider from './SwiperSlider';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { motion } from 'framer-motion';

const HeroBanner = ({ banner, data }) => {
    const nav = useNavigate();
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const result = await isAuthenticated();
            setAuth(result);
        };
        checkAuth();
    }, []);

    return (
        <section className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 shadow-lg"
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">🔥 India's Fastest Growing Platform</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                                Practice SSC's{' '}
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    New UI
                                </span>{' '}
                                Today
                            </h1>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                                    Crack your Exam Tomorrow
                                </span>
                            </h2>
                        </motion.div>

                        {/* Process Flow */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center lg:justify-start gap-3 text-lg font-semibold text-gray-700"
                        >
                            <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-lg">
                                <MdSchool className="text-blue-600" />
                                <span>Learn</span>
                            </div>
                            <FaAngleRight className="text-gray-400" />
                            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg">
                                <MdTrendingUp className="text-green-600" />
                                <span>Revise</span>
                            </div>
                            <FaAngleRight className="text-gray-400" />
                            <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-lg">
                                <FaTrophy className="text-purple-600" />
                                <span>Crack</span>
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0"
                        >
                            Start your selection journey with India's most comprehensive exam preparation platform.{' '}
                            <span className="font-bold text-green-600">Completely Free!</span>
                        </motion.p>

                        {/* App Download Buttons Only */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto"
                        >
                            {/* App Download Buttons Container */}
                            <div className="w-full space-y-4">
                                {/* Download Buttons Label */}
                                <div className="text-center">
                                    <p className="text-sm sm:text-base text-gray-600 font-medium">
                                        Download our mobile app for better experience
                                    </p>
                                </div>

                                {/* App Download Buttons - Responsive Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
                                    {/* Google Play Store Button */}
                                    <Link
                                        to="https://play.google.com/store/apps/details?id=com.edurevision24"
                                        target='_blank'
                                        className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-white hover:shadow-green-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 min-h-[56px] sm:min-h-[64px]"
                                    >
                                        <div className="flex-shrink-0">
                                            <FaGooglePlay
                                                size={window.innerWidth < 640 ? 24 : 28}
                                                className="text-green-600 group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <div className="text-xs sm:text-sm text-gray-500 leading-tight">Download on</div>
                                            <div className="font-bold text-sm sm:text-base text-gray-800 leading-tight truncate">
                                                Google Play
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MdPlayArrow className="text-gray-400 rotate-180" />
                                        </div>
                                    </Link>

                                    {/* Apple App Store Button */}
                                    <Link
                                        to="https://apps.apple.com/in/app/edurevision24/id6751642229"
                                        target='_blank'
                                        className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-gray-800 hover:bg-white hover:shadow-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 min-h-[56px] sm:min-h-[64px]"
                                    >
                                        <div className="flex-shrink-0">
                                            <FaApple
                                                size={window.innerWidth < 640 ? 24 : 28}
                                                className="text-gray-800 group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <div className="text-xs sm:text-sm text-gray-500 leading-tight">Download on</div>
                                            <div className="font-bold text-sm sm:text-base text-gray-800 leading-tight truncate">
                                                App Store
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MdPlayArrow className="text-gray-400 rotate-180" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Quick Stats */}
                                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 mt-6">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>4.8★ Rating</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>100K+ Downloads</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span>Free to Use</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-gray-600">50K+ Happy Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map(i => <MdStar key={i} />)}
                                </div>
                                <span className="text-sm font-medium text-gray-600">4.8 Rating</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side Slider */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10">
                            {banner && <SwiperSlider banner={banner} />}
                        </div>
                        {/* Decorative Elements around slider */}
                        <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"></div>
                    </motion.div>
                </div>

                {/* ✅ CTA Button - Now Below the Slider Section */}
                {!auth && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex justify-center mt-12 sm:mt-16"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => nav('/register')}
                            className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white text-lg sm:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden min-h-[64px] max-w-sm sm:max-w-md"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative flex items-center justify-center gap-3">
                                <FaRocket className="text-xl sm:text-2xl flex-shrink-0" />
                                <span className="font-bold">Start Free Test Now</span>
                                <MdPlayArrow className="text-2xl sm:text-3xl group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            </div>
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Enhanced Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-green-300 transform hover:scale-105">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaUsers className="text-2xl text-white" />
                        </div>
                        <div className="text-3xl font-bold text-green-600 mb-2">150K+</div>
                        <div className="text-sm font-medium text-gray-700">Practice Questions</div>
                    </div>

                    <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-yellow-300 transform hover:scale-105">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MdStar className="text-2xl text-white" />
                        </div>
                        <div className="text-3xl font-bold text-yellow-600 mb-2">15K+</div>
                        <div className="text-sm font-medium text-gray-700">Mock Tests</div>
                    </div>

                    <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-purple-300 transform hover:scale-105">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaAward className="text-2xl text-white" />
                        </div>
                        <div className="text-3xl font-bold text-purple-600 mb-2">18K+</div>
                        <div className="text-sm font-medium text-gray-700">Previous Year Papers</div>
                    </div>

                    <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-orange-300 transform hover:scale-105">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MdSchool className="text-2xl text-white" />
                        </div>
                        <div className="text-3xl font-bold text-orange-600 mb-2">10K+</div>
                        <div className="text-sm font-medium text-gray-700">Expert Notes</div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced WhatsApp Float */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <a
                    href="https://wa.me/917822936229"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                >
                    <div className="relative bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95">
                        <FaWhatsapp size={32} className="text-white" />

                        {/* Pulse Animation */}
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>

                        {/* Notification Dot */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
                            Chat with us!
                            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>
                </a>
            </motion.div>
        </section>
    );
};

export default HeroBanner;
