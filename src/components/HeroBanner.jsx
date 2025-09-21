import React, { useEffect, useState } from 'react';
import { FaGooglePlay, FaApple, FaWhatsapp, FaAngleRight, FaRocket, FaUsers, FaAward, FaTrophy } from 'react-icons/fa';
import { MdPlayArrow, MdStar, MdTrendingUp, MdSchool } from 'react-icons/md';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import SwiperSlider from './SwiperSlider';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { motion } from 'framer-motion';

// Custom hook for window dimensions
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return windowSize;
};

const HeroBanner = ({ banner, data }) => {
    const nav = useNavigate();
    const [auth, setAuth] = useState(false);
    const { width } = useWindowSize();

    useEffect(() => {
        const checkAuth = async () => {
            const result = await isAuthenticated();
            setAuth(result);
        };
        checkAuth();
    }, []);

    // Determine icon size based on screen width
    const getIconSize = () => {
        if (width < 640) return 20; // Mobile
        if (width < 768) return 24; // Small tablets
        return 28; // Desktop
    };

    return (
        <section className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
                {/* Mobile-First Layout */}
                <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

                    {/* Left Content - Mobile First */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1 text-center lg:text-left space-y-6 lg:space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-blue-200 shadow-lg text-sm sm:text-base"
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-medium text-gray-700">🔥 India's Fastest Growing Platform</span>
                        </motion.div>

                        {/* Main Heading - Mobile Optimized */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-3 sm:space-y-4"
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                                Practice SSC's{' '}
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    New UI
                                </span>{' '}
                                Today
                            </h1>
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                                    Crack your Exam Tomorrow
                                </span>
                            </h2>
                        </motion.div>

                        {/* Process Flow - Mobile Responsive */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg font-semibold text-gray-700"
                        >
                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="flex items-center gap-2 bg-blue-100 px-2 py-1 sm:px-3 sm:py-1 rounded-lg">
                                    <MdSchool className="text-blue-600 text-sm sm:text-base" />
                                    <span>Learn</span>
                                </div>
                                <FaAngleRight className="text-gray-400 hidden sm:block" />
                                <div className="flex items-center gap-2 bg-green-100 px-2 py-1 sm:px-3 sm:py-1 rounded-lg">
                                    <MdTrendingUp className="text-green-600 text-sm sm:text-base" />
                                    <span>Revise</span>
                                </div>
                                <FaAngleRight className="text-gray-400 hidden sm:block" />
                                <div className="flex items-center gap-2 bg-purple-100 px-2 py-1 sm:px-3 sm:py-1 rounded-lg">
                                    <FaTrophy className="text-purple-600 text-sm sm:text-base" />
                                    <span>Crack</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0"
                        >
                            Start your selection journey with India's most comprehensive exam preparation platform.{' '}
                            <span className="font-bold text-green-600">Completely Free!</span>
                        </motion.p>
                        {/* Trust Indicators - Mobile Optimized */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-1 sm:-space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
                                    ))}
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-600">Thousands of Happy Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map(i => <MdStar key={i} size={16} />)}
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-600">4.8 Rating</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side Slider - Mobile First */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="order-1 lg:order-2 relative w-full"
                    >
                        <div className="relative z-10 w-full max-w-md mx-auto lg:max-w-none">
                            {banner && (
                                <div >

                                    <div className="w-full h-64 sm:h-80 md:h-96 lg:h-auto">
                                        <SwiperSlider banner={banner} />
                                    </div>
                                    {/* App Download Section - Mobile Optimized */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-4 sm:space-y-6 mt-4"
                                    >
                                        <div className="text-center">
                                            <p className="text-sm sm:text-base text-gray-600 font-medium px-4 sm:px-0">
                                                Download our mobile app for better experience
                                            </p>
                                        </div>

                                        {/* App Download Buttons - Fully Responsive */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0">
                                            {/* Google Play Store Button */}
                                            <Link
                                                to="https://play.google.com/store/apps/details?id=com.edurevision24"
                                                target='_blank'
                                                className="group flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 active:scale-95"
                                            >
                                                <div className="flex-shrink-0">
                                                    <FaGooglePlay
                                                        size={getIconSize()}
                                                        className="text-green-600 group-hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                                <div className="text-left flex-1 min-w-0">
                                                    <div className="text-xs text-gray-500 leading-tight">Download on</div>
                                                    <div className="font-bold text-sm sm:text-base text-gray-800 leading-tight">
                                                        Google Play
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MdPlayArrow className="text-gray-400" size={16} />
                                                </div>
                                            </Link>

                                            {/* Apple App Store Button */}
                                            <Link
                                                to="https://apps.apple.com/in/app/edurevision24/id6751642229"
                                                target='_blank'
                                                className="group flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-gray-800 hover:bg-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 active:scale-95"
                                            >
                                                <div className="flex-shrink-0">
                                                    <FaApple
                                                        size={getIconSize()}
                                                        className="text-gray-800 group-hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                                <div className="text-left flex-1 min-w-0">
                                                    <div className="text-xs text-gray-500 leading-tight">Download on</div>
                                                    <div className="font-bold text-sm sm:text-base text-gray-800 leading-tight">
                                                        App Store
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MdPlayArrow className="text-gray-400" size={16} />
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Quick Stats - Mobile Responsive */}
                                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>4.8★ Rating</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span>Easy to Use</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span>Free to Use</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                        {/* Decorative Elements around slider */}
                        <div className="absolute -top-2 -left-2 w-16 h-16 lg:w-20 lg:h-20 bg-blue-400/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 lg:w-16 lg:h-16 bg-purple-400/20 rounded-full blur-xl"></div>
                    </motion.div>
                </div>

                {/* CTA Button - Below Both Sections */}
                {!auth && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex justify-center mt-8 sm:mt-12 lg:mt-16"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => nav('/register')}
                            className="group relative px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white text-base sm:text-lg lg:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden w-full max-w-xs sm:max-w-sm"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                                <FaRocket className="text-lg sm:text-xl flex-shrink-0" />
                                <span className="font-bold">Start Free Test Now</span>
                                <MdPlayArrow className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            </div>
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Enhanced Stats Section - Mobile Responsive */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 relative z-10"
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="group text-center p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-green-300 transform hover:scale-105">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaUsers className="text-lg sm:text-2xl text-white" />
                        </div>
                        <div className="text-xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">150K+</div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700">Practice Questions</div>
                    </div>

                    <div className="group text-center p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-yellow-300 transform hover:scale-105">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MdStar className="text-lg sm:text-2xl text-white" />
                        </div>
                        <div className="text-xl sm:text-3xl font-bold text-yellow-600 mb-1 sm:mb-2">15K+</div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700">Mock Tests</div>
                    </div>

                    <div className="group text-center p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-purple-300 transform hover:scale-105">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaAward className="text-lg sm:text-2xl text-white" />
                        </div>
                        <div className="text-xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">18K+</div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700">Previous Year Papers</div>
                    </div>

                    <div className="group text-center p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-orange-300 transform hover:scale-105">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MdSchool className="text-lg sm:text-2xl text-white" />
                        </div>
                        <div className="text-xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">10K+</div>
                        <div className="text-xs sm:text-sm font-medium text-gray-700">Expert Notes</div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced WhatsApp Float - Mobile Optimized */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
            >
                <a
                    href="https://wa.me/917822936229"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                >
                    <div className="relative bg-green-500 hover:bg-green-600 p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95">
                        <FaWhatsapp size={width < 640 ? 24 : 32} className="text-white" />

                        {/* Pulse Animation */}
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>

                        {/* Notification Dot */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Tooltip - Hidden on small screens */}
                    <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
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
