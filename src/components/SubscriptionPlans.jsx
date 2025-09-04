// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { checkoutpaySlice, getSubscriptionSlice } from "../redux/HomeSlice";
// import { useNavigate } from "react-router-dom";
// import { isAuthenticated } from "../utils/auth";

// const SubscriptionPlans = ({ userInfo }) => {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(false);
//   const [subscriptionData, setSubscriptionData] = useState([]);
//   const [benefitsHTML, setBenefitsHTML] = useState("");
//   const [plainId, setPlanId] = useState("");
//   const [auth, setAuth] = useState(false);
//   const nav = useNavigate();

//   const getSubscription = async () => {
//     try {
//       setIsLoading(true);
//       const res = await dispatch(getSubscriptionSlice()).unwrap();
//       if (res.status_code == 200) {
//         setSubscriptionData(res.data.plus.details);
//         setPlanId(res.data.plus.id);
//         setBenefitsHTML(res.data.plus.benefits);
//       }
//     } catch (error) {
//       console.error("Subscription fetch error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const checkOutPay = async (item) => {
//     const planData = {
//       amount: item.offer_price,
//       subscription_id: plainId,
//     };

//     try {
//       const res = await dispatch(checkoutpaySlice(planData)).unwrap();
//       if (res.status && res.payment_session_id) {
//         if (window.Cashfree) {
//           const cashfree = window.Cashfree({ mode: "production" });
//           cashfree.checkout({
//             paymentSessionId: res.payment_session_id,
//             redirectTarget: "_self",
//             redirectUrl: "/api/payment-response",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Checkout error", error);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const result = await isAuthenticated();
//       setAuth(result);
//     };
//     checkAuth();
//     getSubscription();
//   }, []);

//   return (
//     <section className="py-12 px-6 bg-gray-100">
//       <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-12">
//         Our Subscriptions
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {subscriptionData.map((plan, idx) => {
//           const ribbonColors = ["bg-blue-500", "bg-yellow-500", "bg-green-500"];
//           let isActivePlain = userInfo?.subscription_details?.some(
//             (sub) => sub.subscription_name === plan.subscription_name
//           );

//           return (
//             <div
//               key={idx}
//               className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
//             >
//               {/* Ribbon */}
//               <div
//                 className={`absolute top-0 left-0 w-full h-12 flex items-center justify-center text-white text-lg font-semibold ${ribbonColors[idx % ribbonColors.length]}`}
//               >
//                 {plan.subscription_name.toUpperCase()}
//               </div>

//               {/* Price Section */}
//               <div className="pt-16 pb-6 text-center">
//                 <h2 className="text-3xl font-bold text-gray-800">
//                   ₹{plan.offer_price}
//                 </h2>
//                 <p className="line-through text-sm text-red-400">₹{plan.price}</p>
//                 <p className="text-gray-500 mt-1">{plan.duration} months</p>
//               </div>

//               {/* Benefits */}
//               <div className="px-6 text-sm text-gray-700 mb-6 leading-relaxed"
//                 dangerouslySetInnerHTML={{ __html: benefitsHTML }}
//               />

//               {/* Button */}
//               <div className="px-6 pb-6">
//                 {auth ? (
//                   isActivePlain ? (
//                     <button className="w-full py-2 rounded-lg bg-gray-600 text-white font-semibold cursor-default">
//                       Active Plan
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => checkOutPay(plan)}
//                       className={`w-full py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${ribbonColors[idx % ribbonColors.length]} hover:opacity-90`}
//                     >
//                       Order Now
//                     </button>
//                   )
//                 ) : (
//                   <button
//                     onClick={() => nav("/login")}
//                     className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
//                   >
//                     Order Now
//                   </button>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default SubscriptionPlans;


import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkoutpaySlice, getSubscriptionSlice } from "../redux/HomeSlice"; // Assuming these paths are correct
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth"; // Assuming this path is correct
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- New SVG Icon for the Active Card ---
const HeartIcon = () => (
    <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-full mb-6">
        <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
    </div>
);

const SubscriptionPlans = ({ userInfo }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [benefitsHTML, setBenefitsHTML] = useState("");
    const [plainId, setPlanId] = useState("");
    const [auth, setAuth] = useState(false);
    const nav = useNavigate();

    // --- Your existing logic is preserved exactly ---
    const getSubscription = async () => {
        try {
            setIsLoading(true);
            const res = await dispatch(getSubscriptionSlice()).unwrap();
            if (res.status_code === 200) {
                setSubscriptionData(res.data.plus.details);
                setPlanId(res.data.plus.id);
                setBenefitsHTML(res.data.plus.benefits);
            }
        } catch (error) {
            console.error("Subscription fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkOutPay = async (item) => {
        const planData = {
            amount: item.offer_price,
            subscription_id: plainId,
        };
        try {
            const res = await dispatch(checkoutpaySlice(planData)).unwrap();
            if (res.status && res.payment_session_id) {
                if (window.Cashfree) {
                    const cashfree = window.Cashfree({ mode: "production" });
                    cashfree.checkout({
                        paymentSessionId: res.payment_session_id,
                        redirectTarget: "_self",
                        redirectUrl: "/api/payment-response",
                    });
                }
            }
        } catch (error) {
            console.error("Checkout error", error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const result = await isAuthenticated();
            setAuth(result);
        };
        checkAuth();
        getSubscription();
    }, []);
    // --- End of logic section ---

    return (
        <section className="py-16 px-4 bg-gray-100 font-sans">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-center text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
                    Our Subscription Plans
                </h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-60">
                        <div className="text-xl font-medium text-gray-600">Loading Plans...</div>
                    </div>
                ) : (
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        pagination={{ clickable: true }}
                        spaceBetween={30}
                        slidesPerView={3}
                        className="pb-10"
                    >
                        {subscriptionData.map((plan, idx) => {
                            const isActivePlan = userInfo?.subscription_details?.some(
                                (sub) => sub.subscription_name === plan.subscription_name
                            );

                            if (isActivePlan) {
                                // --- RENDER THE NEW "ACTIVE PLAN" DESIGN ---
                                return (
                                    <SwiperSlide key={idx} className="h-auto">
                                        <div className="relative flex flex-col h-full p-8 rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-rose-600 text-white shadow-2xl">
                                            {/* Active Badge */}
                                            <div className="absolute top-6 right-6 bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full z-10">
                                                ACTIVE
                                            </div>

                                            <HeartIcon />

                                            <h3 className="text-3xl font-extrabold">{plan.subscription_name}</h3>
                                            <p className="mt-1 text-white/90 text-lg">
                                                For {plan.duration} months of access
                                            </p>

                                            <div className="my-6">
                                                <span className="text-6xl font-extrabold">
                                                    ₹{plan.offer_price}
                                                </span>
                                                <span className="ml-3 text-2xl font-medium line-through text-white/70">
                                                    ₹{plan.price}
                                                </span>
                                            </div>

                                            {/* Benefits with custom styling to match image */}
                                            <div
                                                className="prose prose-lg prose-invert prose-strong:text-white prose-strong:font-extrabold text-white/90 flex-grow"
                                                dangerouslySetInnerHTML={{ __html: benefitsHTML }}
                                            />

                                            <button disabled className="w-full py-4 mt-8 rounded-2xl bg-white text-red-500 font-bold text-xl cursor-not-allowed">
                                                Your Active Plan
                                            </button>
                                        </div>
                                    </SwiperSlide>
                                );
                            }

                            // --- RENDER A STANDARD "INACTIVE PLAN" CARD ---
                            // (This part is for other plans that are not active)
                            return (
                                <SwiperSlide key={idx} className="h-auto">
                                    <div className="flex flex-col h-full  p-8 rounded-3xl bg-white text-gray-800 shadow-lg">
                                        <h3 className="text-2xl font-bold">{plan.subscription_name}</h3>
                                        <p className="mt-1 text-gray-500">
                                            For {plan.duration} months of access
                                        </p>

                                        <div className="my-6">
                                            <span className="text-5xl font-extrabold text-gray-900">
                                                ₹{plan.offer_price}
                                            </span>
                                            <span className="ml-2 text-xl font-medium line-through text-red-500">
                                                ₹{plan.price}
                                            </span>
                                        </div>

                                        <div
                                            className="prose prose-sm text-gray-600 flex-grow"
                                            dangerouslySetInnerHTML={{ __html: benefitsHTML }}
                                        />

                                        <button onClick={() => auth ? checkOutPay(plan) : nav("/login")} className="w-full py-3 mt-8 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity">
                                            Order Now
                                        </button>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                )}
            </div>
        </section>
    );
};

export default SubscriptionPlans;

