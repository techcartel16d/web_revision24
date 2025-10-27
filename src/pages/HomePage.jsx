// // HomePage.jsx
// import React, { useEffect, useState } from "react";
// import SwiperSlider from "../components/SwiperSlider";
// import HeroBanner from "../components/HeroBanner";
// import ExamSelector from "../components/ExamSelector";
// import { useDispatch } from "react-redux";
// import {
//   getSubscriptionSlice,
//   getUserInfoSlice,
//   homePageSlice,
// } from "../redux/HomeSlice";
// import TestSeriesViewer from "../components/TestSeriesViewer";
// import SubscriptionModal from "../components/SubscriptionModal";
// import AboutUs from "../components/AboutUs";
// import SubscriptionPlans from "../components/SubscriptionPlans";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import { checkAllEncryptedTestData } from "../helpers/testStorage";
// import {
//   getUserDataDecrypted,
//   saveUserDataEncrypted,
// } from "../helpers/userStorage";
// import AdBanner from "../components/AdBanner";
// import Sidebar from "../components/Sidebar";
// import { secureSet } from "../helpers/storeValues";
// import AuthHeader from "../components/AuthHeader";

// const HomePage = () => {
//   const dispatch = useDispatch();
//   const [homeData, setHomeData] = useState(null);
//   const [bannerData, setBannerData] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);
//   const [ad, setAd] = useState(null);

//   // Responsive state management
//   const [isMobile, setIsMobile] = useState(false);
//   const [sidebarVisible, setSidebarVisible] = useState(false);

//   // Check mobile screen size
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const getHomeData = async (id) => {
//     try {
//       setLoading(true);
//       const res = await dispatch(homePageSlice()).unwrap();

//       setCategory(res.data.category);
//       let previousStr = JSON.stringify(res.data.previous_year_exam);

//       setHomeData(res.data);
//       setBannerData(res.data.banner);
//       secureSet("previouseYearTest", previousStr);

//       setLoading(false);
//       setRefreshing(false);
//     } catch (error) {
//       setLoading(false);
//       setRefreshing(false);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const loadUserData = async () => {
//     const user = await getUserDataDecrypted();
//     setUserInfo(user);
//   };

//   const getUserDetails = async () => {
//     try {
//       const res = await dispatch(getUserInfoSlice()).unwrap();
//       if (res.status_code == 200) {
//         const userInfo = {
//           ...res.data,
//           token: res.token,
//           subscription_status: res.subscription_status,
//           subscription_details: res.subscription_details,
//         };

//         await saveUserDataEncrypted(userInfo);
//       }
//     } catch (error) {
//       console.log("error in get user profile", error);
//     }
//   };

//   useEffect(() => {
//     getHomeData();
//     checkAllEncryptedTestData();
//     getUserDetails();
//   }, []);

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   // Loading state component
//   const LoadingSpinner = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
//       <div className="text-center space-y-4">
//         <div className="fading-spinner mx-auto">
//           {[...Array(12)].map((_, i) => (
//             <div key={i} className={`bar bar${i + 1}`}></div>
//           ))}
//         </div>
//         <div className="text-gray-600 font-medium">Loading your content...</div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <>
//       {/* Main Layout Container */}
//       <div className="min-h-screen bg-gray-50">
//         {/* Layout Wrapper */}
//         <div className="flex h-screen overflow-hidden">

//           {/* Sidebar - Only show when user is logged in */}
//           {userInfo && (
//             <>
//               {/* Mobile Overlay */}
//               {isMobile && sidebarVisible && (
//                 <div
//                   className="fixed inset-0 bg-black/50 z-40 md:hidden"
//                   onClick={() => setSidebarVisible(false)}
//                 />
//               )}

//               {/* Sidebar Component */}
//               <div className={`
//                 fixed md:static inset-y-0 left-0 z-50
//                 transform transition-transform duration-300 ease-in-out
//                 ${isMobile ? (sidebarVisible ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
//               `}>
//                 <Sidebar />
//               </div>
//             </>
//           )}

//           {/* Main Content Area */}
//           <div className={`
//             flex-1 flex flex-col h-full overflow-hidden
//             ${userInfo && !isMobile ? 'md:ml-0' : ''}
//           `}>

//             {/* Header */}
//             <div className="flex-shrink-0 relative z-30">
//               {userInfo ? (
//                 // Mobile Menu Button for logged-in users
//                 isMobile && (
//                   <div className="flex items-center p-4 bg-white shadow-sm md:hidden">
//                     <button
//                       onClick={() => setSidebarVisible(!sidebarVisible)}
//                       className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
//                     >
//                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                       </svg>
//                     </button>
//                     <h1 className="ml-3 text-xl font-bold text-gray-900">Revision24</h1>
//                   </div>
//                 )
//               ) : (
//                 <AuthHeader />
//               )}
//             </div>

//             {/* Scrollable Content */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="min-h-full">

//                 {/* Hero Banner */}
//                 {bannerData && bannerData.length > 0 && (
//                   <section className="relative">
//                     <HeroBanner
//                       banner={bannerData}
//                       data={homeData?.test_series_paid}
//                     />
//                   </section>
//                 )}

//                 {/* Test Series Section */}
//                 {category.length > 0 && (
//                   <section className="relative">
//                     <TestSeriesViewer
//                       category={category}
//                       testSeriesData={homeData?.test_series_paid}
//                     />
//                   </section>
//                 )}

//                 {/* Subscription Plans - Only for logged-in users without subscription */}
//                 {userInfo && !userInfo?.subscription_status && (
//                   <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
//                     <div className="container mx-auto px-4 py-8">
//                       <SubscriptionPlans />
//                     </div>
//                   </section>
//                 )}

//                 {/* Additional Content Sections */}
//                 {/* You can add more sections here as needed */}

//                 {/* Footer - Only for non-logged-in users */}
//                 {!userInfo && (
//                   <Footer />
//                 )}

//                 {/* Spacer for mobile menu */}
//                 {userInfo && isMobile && (
//                   <div className="h-20"></div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Bottom Navigation for Logged Users (Optional) */}
//         {userInfo && isMobile && (
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden">
//             <div className="flex items-center justify-around py-2">
//               <button
//                 onClick={() => setSidebarVisible(true)}
//                 className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//                 <span className="text-xs mt-1">Menu</span>
//               </button>

//               <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
//                 </svg>
//                 <span className="text-xs mt-1">Tests</span>
//               </button>

//               <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 <span className="text-xs mt-1">Profile</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Enhanced Loading Spinner Styles */}
//       <style jsx>{`
//         .fading-spinner {
//           position: relative;
//           width: 60px;
//           height: 60px;
//         }
        
//         .bar {
//           position: absolute;
//           width: 4px;
//           height: 20px;
//           background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
//           border-radius: 2px;
//           animation: spin 1.2s linear infinite;
//         }
        
//         @keyframes spin {
//           0%, 40%, 100% { transform: scaleY(0.4); opacity: 0.5; }
//           20% { transform: scaleY(1.0); opacity: 1; }
//         }
        
//         ${[...Array(12)].map((_, i) => {
//         const angle = i * 30;
//         const delay = i * 0.1;
//         return `
//             .bar${i + 1} {
//               transform: rotate(${angle}deg) translate(0, -150%);
//               animation-delay: -${delay}s;
//             }
//           `;
//       }).join('')}

//         /* Custom Scrollbar */
//         .overflow-y-auto::-webkit-scrollbar {
//           width: 8px;
//         }
        
//         .overflow-y-auto::-webkit-scrollbar-track {
//           background: #f1f5f9;
//         }
        
//         .overflow-y-auto::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 4px;
//         }
        
//         .overflow-y-auto::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }

//         /* Smooth scrolling */
//         .overflow-y-auto {
//           scroll-behavior: smooth;
//         }

//         /* Mobile optimizations */
//         @media (max-width: 768px) {
//           .min-h-screen {
//             min-height: 100vh;
//             min-height: 100dvh; /* For better mobile support */
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default HomePage;



// HomePage.jsx
// import React, { useEffect, useState } from "react";
// import SwiperSlider from "../components/SwiperSlider";
// import HeroBanner from "../components/HeroBanner";
// import ExamSelector from "../components/ExamSelector";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getSubscriptionSlice,
//   getUserInfoSlice,
//   homePageSlice,
// } from "../redux/HomeSlice";
// import TestSeriesViewer from "../components/TestSeriesViewer";
// import SubscriptionModal from "../components/SubscriptionModal";
// import AboutUs from "../components/AboutUs";
// import SubscriptionPlans from "../components/SubscriptionPlans";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import { checkAllEncryptedTestData } from "../helpers/testStorage";
// import {
//   getUserDataDecrypted,
//   saveUserDataEncrypted,
// } from "../helpers/userStorage";
// import AdBanner from "../components/AdBanner";
// import Sidebar from "../components/Sidebar";
// import { secureSet } from "../helpers/storeValues";
// import AuthHeader from "../components/AuthHeader";

// const HomePage = () => {
//   const dispatch = useDispatch();
  
//   // ✅ Use Redux state for sidebar (consistent with Header component)
//   const { isSideBar } = useSelector(state => state.toggleSlice);
  
//   const [homeData, setHomeData] = useState(null);
//   const [bannerData, setBannerData] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);
//   const [ad, setAd] = useState(null);

//   // Responsive state management
//   const [isMobile, setIsMobile] = useState(false);

//   // Check mobile screen size
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const getHomeData = async (id) => {
//     try {
//       setLoading(true);
//       const res = await dispatch(homePageSlice()).unwrap();

//       setCategory(res.data.category);
//       let previousStr = JSON.stringify(res.data.previous_year_exam);

//       setHomeData(res.data);
//       setBannerData(res.data.banner);
//       secureSet("previouseYearTest", previousStr);

//       setLoading(false);
//       setRefreshing(false);
//     } catch (error) {
//       setLoading(false);
//       setRefreshing(false);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const loadUserData = async () => {
//     const user = await getUserDataDecrypted();
//     setUserInfo(user);
//   };

//   const getUserDetails = async () => {
//     try {
//       const res = await dispatch(getUserInfoSlice()).unwrap();
//       if (res.status_code == 200) {
//         const userInfo = {
//           ...res.data,
//           token: res.token,
//           subscription_status: res.subscription_status,
//           subscription_details: res.subscription_details,
//         };

//         await saveUserDataEncrypted(userInfo);
//       }
//     } catch (error) {
//       console.log("error in get user profile", error);
//     }
//   };

//   useEffect(() => {
//     getHomeData();
//     checkAllEncryptedTestData();
//     getUserDetails();
//   }, []);

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   // Loading state component
//   const LoadingSpinner = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
//       <div className="text-center space-y-4">
//         <div className="fading-spinner mx-auto">
//           {[...Array(12)].map((_, i) => (
//             <div key={i} className={`bar bar${i + 1}`}></div>
//           ))}
//         </div>
//         <div className="text-gray-600 font-medium">Loading your content...</div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <>
//       {/* Main Layout Container */}
//       <div className="min-h-screen bg-gray-50">
//         {/* ✅ Always show Header component */}
//         <Header />

//         {/* Layout Wrapper */}
//         <div className="flex h-screen overflow-hidden">

//           {/* ✅ Sidebar - Use Redux state (isSideBar) */}
//           {userInfo && (
//             <>
//               {/* Mobile Overlay */}
//               {isMobile && isSideBar && (
//                 <div
//                   className="fixed inset-0 bg-black/50 md:hidden"
//                   style={{ zIndex: 9998 }}
//                   onClick={() => dispatch({ type: 'toggleSlice/sidebarToggle' })}
//                 />
//               )}

//               {/* Sidebar Component */}
//               <div 
//                 className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl md:hidden overflow-y-auto"
//                 style={{ 
//                   zIndex: 9999,
//                   transform: isSideBar ? 'translateX(0)' : 'translateX(-100%)',
//                   transition: 'transform 0.3s ease-in-out'
//                 }}
//               >
//                 <Sidebar />
//               </div>
//             </>
//           )}

//           {/* Main Content Area */}
//           <div className={`
//             flex-1 flex flex-col h-full overflow-hidden
//             ${userInfo && !isMobile ? 'md:ml-0' : ''}
//           `}>

//             {/* Scrollable Content */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="min-h-full">

//                 {/* Hero Banner */}
//                 {bannerData && bannerData.length > 0 && (
//                   <section className="relative">
//                     <HeroBanner
//                       banner={bannerData}
//                       data={homeData?.test_series_paid}
//                     />
//                   </section>
//                 )}

//                 {/* Test Series Section */}
//                 {category.length > 0 && (
//                   <section className="relative">
//                     <TestSeriesViewer
//                       category={category}
//                       testSeriesData={homeData?.test_series_paid}
//                     />
//                   </section>
//                 )}

//                 {/* Subscription Plans - Only for logged-in users without subscription */}
//                 {userInfo && !userInfo?.subscription_status && (
//                   <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
//                     <div className="container mx-auto px-4 py-8">
//                       <SubscriptionPlans />
//                     </div>
//                   </section>
//                 )}

//                 {/* Footer - Only for non-logged-in users */}
//                 {!userInfo && (
//                   <Footer />
//                 )}

//                 {/* Spacer for mobile menu */}
//                 {userInfo && isMobile && (
//                   <div className="h-20"></div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Bottom Navigation for Logged Users (Optional) */}
//         {userInfo && isMobile && (
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden">
//             <div className="flex items-center justify-around py-2">
//               <button
//                 onClick={() => dispatch({ type: 'toggleSlice/sidebarToggle' })}
//                 className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//                 <span className="text-xs mt-1">Menu</span>
//               </button>

//               <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
//                 </svg>
//                 <span className="text-xs mt-1">Tests</span>
//               </button>

//               <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 <span className="text-xs mt-1">Profile</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Enhanced Loading Spinner Styles */}
//       <style jsx>{`
//         .fading-spinner {
//           position: relative;
//           width: 60px;
//           height: 60px;
//         }
        
//         .bar {
//           position: absolute;
//           width: 4px;
//           height: 20px;
//           background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
//           border-radius: 2px;
//           animation: spin 1.2s linear infinite;
//         }
        
//         @keyframes spin {
//           0%, 40%, 100% { transform: scaleY(0.4); opacity: 0.5; }
//           20% { transform: scaleY(1.0); opacity: 1; }
//         }
        
//         ${[...Array(12)].map((_, i) => {
//         const angle = i * 30;
//         const delay = i * 0.1;
//         return `
//             .bar${i + 1} {
//               transform: rotate(${angle}deg) translate(0, -150%);
//               animation-delay: -${delay}s;
//             }
//           `;
//       }).join('')}

//         .overflow-y-auto::-webkit-scrollbar {
//           width: 8px;
//         }
        
//         .overflow-y-auto::-webkit-scrollbar-track {
//           background: #f1f5f9;
//         }
        
//         .overflow-y-auto::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 4px;
//         }
        
//         .overflow-y-auto::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }

//         .overflow-y-auto {
//           scroll-behavior: smooth;
//         }

//         @media (max-width: 768px) {
//           .min-h-screen {
//             min-height: 100vh;
//             min-height: 100dvh;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default HomePage;



// import React, { useEffect, useState } from "react";
// import SwiperSlider from "../components/SwiperSlider";
// import HeroBanner from "../components/HeroBanner";
// import ExamSelector from "../components/ExamSelector";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getSubscriptionSlice,
//   getUserInfoSlice,
//   homePageSlice,
// } from "../redux/HomeSlice";
// import TestSeriesViewer from "../components/TestSeriesViewer";
// import SubscriptionModal from "../components/SubscriptionModal";
// import AboutUs from "../components/AboutUs";
// import SubscriptionPlans from "../components/SubscriptionPlans";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import { checkAllEncryptedTestData } from "../helpers/testStorage";
// import {
//   getUserDataDecrypted,
//   saveUserDataEncrypted,
// } from "../helpers/userStorage";
// import AdBanner from "../components/AdBanner";
// import Sidebar from "../components/Sidebar";
// import { secureSet } from "../helpers/storeValues";
// import AuthHeader from "../components/AuthHeader";

// const HomePage = () => {
//   const dispatch = useDispatch();
  
//   const { isSideBar } = useSelector(state => state.toggleSlice);
  
//   const [homeData, setHomeData] = useState(null);
//   const [bannerData, setBannerData] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);
//   const [ad, setAd] = useState(null);

//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const getHomeData = async (id) => {
//     try {
//       setLoading(true);
//       const res = await dispatch(homePageSlice()).unwrap();

//       setCategory(res.data.category);
//       let previousStr = JSON.stringify(res.data.previous_year_exam);

//       setHomeData(res.data);
//       setBannerData(res.data.banner);
//       secureSet("previouseYearTest", previousStr);

//       setLoading(false);
//       setRefreshing(false);
//     } catch (error) {
//       setLoading(false);
//       setRefreshing(false);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const loadUserData = async () => {
//     const user = await getUserDataDecrypted();
//     setUserInfo(user);
//   };

//   const getUserDetails = async () => {
//     try {
//       const res = await dispatch(getUserInfoSlice()).unwrap();
//       if (res.status_code == 200) {
//         const userInfo = {
//           ...res.data,
//           token: res.token,
//           subscription_status: res.subscription_status,
//           subscription_details: res.subscription_details,
//         };

//         await saveUserDataEncrypted(userInfo);
//       }
//     } catch (error) {
//       console.log("error in get user profile", error);
//     }
//   };

//   useEffect(() => {
//     getHomeData();
//     checkAllEncryptedTestData();
//     getUserDetails();
//   }, []);

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   const LoadingSpinner = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
//       <div className="text-center space-y-4">
//         <div className="fading-spinner mx-auto">
//           {[...Array(12)].map((_, i) => (
//             <div key={i} className={`bar bar${i + 1}`}></div>
//           ))}
//         </div>
//         <div className="text-gray-600 font-medium">Loading your content...</div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50">
//         <Header />

//         <div className="flex h-screen overflow-hidden">
          
//           {/* ✅ Desktop Sidebar - Always visible, doesn't need isSideBar check */}
//           {userInfo && !isMobile && (
//             <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200">
//               <div className="h-full overflow-y-auto">
//                 <Sidebar />
//               </div>
//             </div>
//           )}

//           {/* ✅ Mobile Sidebar - Toggle with overlay */}
//           {userInfo && isMobile && (
//             <>
//               {isSideBar && (
//                 <div
//                   className="fixed inset-0 bg-black/50 z-40"
//                   onClick={() => dispatch({ type: 'toggleSlice/sidebarToggle' })}
//                 />
//               )}

//               <div 
//                 className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 overflow-y-auto"
//                 style={{ 
//                   transform: isSideBar ? 'translateX(0)' : 'translateX(-100%)',
//                   transition: 'transform 0.3s ease-in-out'
//                 }}
//               >
//                 <Sidebar />
//               </div>
//             </>
//           )}

//           {/* Main Content */}
//           <div className="flex-1 flex flex-col h-full overflow-hidden">
//             <div className="flex-1 overflow-y-auto">
//               <div className="min-h-full">

//                 {bannerData && bannerData.length > 0 && (
//                   <section className="relative">
//                     <HeroBanner
//                       banner={bannerData}
//                       data={homeData?.test_series_paid}
//                     />
//                   </section>
//                 )}

//                 {category.length > 0 && (
//                   <section className="relative">
//                     <TestSeriesViewer
//                       category={category}
//                       testSeriesData={homeData?.test_series_paid}
//                     />
//                   </section>
//                 )}

//                 {userInfo && !userInfo?.subscription_status && (
//                   <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
//                     <div className="container mx-auto px-4 py-8">
//                       <SubscriptionPlans />
//                     </div>
//                   </section>
//                 )}

//                 {!userInfo && <Footer />}

//                 {userInfo && isMobile && <div className="h-20"></div>}
//               </div>
//             </div>
//           </div>
//         </div>

//         {userInfo && isMobile && (
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden">
//             <div className="flex items-center justify-around py-2">
//               <button
//                 onClick={() => dispatch({ type: 'toggleSlice/sidebarToggle' })}
//                 className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//                 <span className="text-xs mt-1">Menu</span>
//               </button>

//               <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
//                 </svg>
//                 <span className="text-xs mt-1">Tests</span>
//               </button>

//               <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 <span className="text-xs mt-1">Profile</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .fading-spinner {
//           position: relative;
//           width: 60px;
//           height: 60px;
//         }
        
//         .bar {
//           position: absolute;
//           width: 4px;
//           height: 20px;
//           background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
//           border-radius: 2px;
//           animation: spin 1.2s linear infinite;
//         }
        
//         @keyframes spin {
//           0%, 40%, 100% { transform: scaleY(0.4); opacity: 0.5; }
//           20% { transform: scaleY(1.0); opacity: 1; }
//         }
        
//         ${[...Array(12)].map((_, i) => {
//         const angle = i * 30;
//         const delay = i * 0.1;
//         return `
//             .bar${i + 1} {
//               transform: rotate(${angle}deg) translate(0, -150%);
//               animation-delay: -${delay}s;
//             }
//           `;
//       }).join('')}

//         .overflow-y-auto::-webkit-scrollbar {
//           width: 8px;
//         }
        
//         .overflow-y-auto::-webkit-scrollbar-track {
//           background: #f1f5f9;
//         }
        
//         .overflow-y-auto::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 4px;
//         }
        
//         .overflow-y-auto::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }

//         .overflow-y-auto {
//           scroll-behavior: smooth;
//         }

//         @media (max-width: 768px) {
//           .min-h-screen {
//             min-height: 100vh;
//             min-height: 100dvh;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default HomePage;



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserInfoSlice,
  homePageSlice,
} from "../redux/HomeSlice";
import HeroBanner from "../components/HeroBanner";
import TestSeriesViewer from "../components/TestSeriesViewer";
import SubscriptionPlans from "../components/SubscriptionPlans";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { checkAllEncryptedTestData } from "../helpers/testStorage";
import {
  getUserDataDecrypted,
  saveUserDataEncrypted,
} from "../helpers/userStorage";
import Sidebar from "../components/Sidebar";
import { secureSet } from "../helpers/storeValues";
import { sidebarToggle } from "../redux/globleSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  
  // ✅ Use Redux state for sidebar consistency
  const { isSideBar } = useSelector(state => state.toggleSlice);
  
  const [homeData, setHomeData] = useState(null);
  const [bannerData, setBannerData] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getHomeData = async () => {
    try {
      setLoading(true);
      const res = await dispatch(homePageSlice()).unwrap();

      setCategory(res.data.category);
      let previousStr = JSON.stringify(res.data.previous_year_exam);

      setHomeData(res.data);
      setBannerData(res.data.banner);
      secureSet("previouseYearTest", previousStr);

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUserData = async () => {
    const user = await getUserDataDecrypted();
    setUserInfo(user);
  };

  const getUserDetails = async () => {
    try {
      const res = await dispatch(getUserInfoSlice()).unwrap();
      if (res.status_code == 200) {
        const userInfo = {
          ...res.data,
          token: res.token,
          subscription_status: res.subscription_status,
          subscription_details: res.subscription_details,
        };

        await saveUserDataEncrypted(userInfo);
      }
    } catch (error) {
      console.log("error in get user profile", error);
    }
  };

  useEffect(() => {
    getHomeData();
    checkAllEncryptedTestData();
    getUserDetails();
  }, []);

  useEffect(() => {
    loadUserData();
  }, []);

  const LoadingSpinner = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="text-center space-y-4">
        <div className="fading-spinner mx-auto">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`bar bar${i + 1}`}></div>
          ))}
        </div>
        <div className="text-gray-600 font-medium">Loading your content...</div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Main Layout Container */}
      <div className="min-h-screen bg-gray-50">
        {/* Layout Wrapper */}
        <div className="flex h-screen overflow-hidden">

          {/* ✅ Sidebar - Only show when user is logged in */}
          {userInfo && (
            <>
              {/* Mobile Overlay - Using Redux isSideBar */}
              {isMobile && isSideBar && (
                <div
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => dispatch(sidebarToggle())}
                />
              )}

              {/* Sidebar Component - Using Redux isSideBar for mobile */}
              <div className={`
                fixed md:static inset-y-0 left-0 z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobile ? (isSideBar ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
              `}>
                <Sidebar />
              </div>
            </>
          )}

          {/* Main Content Area */}
          <div className={`
            flex-1 flex flex-col h-full overflow-hidden
            ${userInfo && !isMobile ? 'md:ml-0' : ''}
          `}>

            {/* Header */}
            <div className="flex-shrink-0 relative z-30">
              {userInfo ? (
                // Mobile Menu Button - Using Redux sidebarToggle
                isMobile && (
                  <div className="flex items-center p-4 bg-white shadow-sm md:hidden">
                    <button
                      onClick={() => dispatch(sidebarToggle())}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <h1 className="ml-3 text-xl font-bold text-gray-900">Revision24</h1>
                  </div>
                )
              ) : (
                <Header />
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="min-h-full">

                {/* Hero Banner */}
                {bannerData && bannerData.length > 0 && (
                  <section className="relative">
                    <HeroBanner
                      banner={bannerData}
                      data={homeData?.test_series_paid}
                    />
                  </section>
                )}

                {/* Test Series Section */}
                {category.length > 0 && (
                  <section className="relative">
                    <TestSeriesViewer
                      category={category}
                      testSeriesData={homeData?.test_series_paid}
                    />
                  </section>
                )}

                {/* Subscription Plans */}
                {userInfo && !userInfo?.subscription_status && (
                  <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="container mx-auto px-4 py-8">
                      <SubscriptionPlans />
                    </div>
                  </section>
                )}

                {/* Footer */}
                {!userInfo && <Footer />}

                {/* Spacer for mobile menu */}
                {userInfo && isMobile && <div className="h-20"></div>}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation - Using Redux sidebarToggle */}
        {userInfo && isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden">
            <div className="flex items-center justify-around py-2">
              <button
                onClick={() => dispatch(sidebarToggle())}
                className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-xs mt-1">Menu</span>
              </button>

              <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                <span className="text-xs mt-1">Tests</span>
              </button>

              <button className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs mt-1">Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Loading Spinner Styles */}
      <style jsx>{`
        .fading-spinner {
          position: relative;
          width: 60px;
          height: 60px;
        }
        
        .bar {
          position: absolute;
          width: 4px;
          height: 20px;
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 2px;
          animation: spin 1.2s linear infinite;
        }
        
        @keyframes spin {
          0%, 40%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          20% { transform: scaleY(1.0); opacity: 1; }
        }
        
        ${[...Array(12)].map((_, i) => {
          const angle = i * 30;
          const delay = i * 0.1;
          return `
            .bar${i + 1} {
              transform: rotate(${angle}deg) translate(0, -150%);
              animation-delay: -${delay}s;
            }
          `;
        }).join('')}

        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .overflow-y-auto {
          scroll-behavior: smooth;
        }

        @media (max-width: 768px) {
          .min-h-screen {
            min-height: 100vh;
            min-height: 100dvh;
          }
        }
      `}</style>
    </>
  );
};

export default HomePage;
