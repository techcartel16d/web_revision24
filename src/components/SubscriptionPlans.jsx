import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkoutpaySlice, getSubscriptionSlice } from '../redux/HomeSlice';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';


const SubscriptionPlans = ({ userInfo }) => {
    // console.log("user info", userInfo)
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [benefitsHTML, setBenefitsHTML] = useState('');
    const [plainId, setPlanId] = useState('');
    const [auth, setAuth] = useState(false);
    const nav = useNavigate();

    const getSubscription = async () => {
        try {
            setIsLoading(true);
            const res = await dispatch(getSubscriptionSlice()).unwrap();
            // console.log("plan", res)
            if (res.status_code == 200) {
                setSubscriptionData(res.data.plus.details);
                setPlanId(res.data.plus.id);
                setBenefitsHTML(res.data.plus.benefits);
            } else {
                console.error("Error fetching subscription:", res);
            }
        } catch (error) {
            console.error("Subscription fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const checkOutPay = async (item) => {
        const planData = {
            amount: item.offer_price,
            subscription_id: plainId,
        };

        try {
            const res = await dispatch(checkoutpaySlice(planData)).unwrap();
            if (res.status && res.payment_session_id) {
                if (window.Cashfree) {
                    const cashfree = window.Cashfree({ mode: "production" });  //production
                    cashfree.checkout({
                        paymentSessionId: res.payment_session_id,
                        redirectTarget: "_self",
                        redirectUrl: "/api/payment-response",
                    });
                } else {
                    alert("Cashfree SDK not loaded yet. Please try again.");
                }
            }
        } catch (error) {
            console.error("ERROR IN CHECK OUT PAY API", error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const result = await isAuthenticated();
            setAuth(result);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        getSubscription();
    }, []);



    return (
        <section className="py-12 px-4 bg-gray-100">
            <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-10 sm:mb-16">
                Our Subscriptions
            </h1>

            {isLoading ? (
                <div className="text-center text-xl text-gray-600">Loading Plans...</div>
            ) : (
                // <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2">
                //     {subscriptionData.map((plan, idx) => {
                //         const isActivePlain = userInfo?.subscription_details?.some(
                //             (sub) => sub.subscription_name === plan.subscription_name
                //         );
                //         return (
                //             <div
                //                 key={idx}
                //                 className={`rounded-2xl shadow-md p-6 sm:p-8 hover:scale-[1.02] transition-all duration-300 ${isActivePlain ? 'text-white' : 'bg-white'}`}
                //                 style={
                //                     isActivePlain
                //                         ? {
                //                             background: 'linear-gradient(135deg, #0a1f44, #112b63)',
                //                         }
                //                         : {}
                //                 }
                //             >
                //                 <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2 uppercase flex items-center justify-between">
                //                     {plan.subscription_name}
                //                     {
                //                         plan.offer_img && (

                //                             <img src={plan.offer_img} alt="Offer" className="w-20 sm:w-[100px]" />
                //                         )
                //                     }
                //                 </h3>

                //                 <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-green-400 mb-1">
                //                     ₹{plan.offer_price}
                //                     <span className="line-through text-sm text-red-400">
                //                         ₹{plan.price}
                //                     </span>
                //                 </div>
                //                 <p className={`text-sm mb-4 ${isActivePlain ? 'text-gray-300' : 'text-gray-600'}`}>{plan.duration} months</p>

                //                 <div
                //                     className="text-sm sm:text-base mb-6 space-y-2 leading-relaxed"
                //                     style={{ color: isActivePlain ? '#e2e8f0' : '#374151' }}
                //                     dangerouslySetInnerHTML={{ __html: benefitsHTML }}
                //                 />

                //                 {auth ? (
                //                     isActivePlain ? (
                //                         <button
                //                             className="w-full mt-auto cursor-pointer text-white font-semibold py-2 rounded-lg transition-all duration-200"
                //                             style={{
                //                                 background: 'linear-gradient(135deg, #3b5998, #5b7db1)',
                //                             }}
                //                         >
                //                             Active Plan
                //                         </button>
                //                     ) : (
                //                         <button
                //                             onClick={() => checkOutPay(plan)}
                //                             className="w-full mt-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                //                         >
                //                             Buy Now
                //                         </button>
                //                     )
                //                 ) : (
                //                     <button
                //                         onClick={() => nav('/login')}
                //                         className="w-full mt-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                //                     >
                //                         Buy Now
                //                     </button>
                //                 )}
                //             </div>
                //         );
                //     })}
                // </div>
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {subscriptionData.map((plan, idx) => {
                        const isActivePlain = userInfo?.subscription_details?.some(
                            (sub) => sub.subscription_name === plan.subscription_name
                        );
                        return (
                            <SwiperSlide key={idx}>
                                <div
                                    className={`rounded-2xl shadow-md p-6 sm:p-8 hover:scale-[1.02] transition-all duration-300 ${isActivePlain ? 'text-white' : 'bg-white'}`}
                                    style={
                                        isActivePlain
                                            ? { background: 'linear-gradient(135deg, #0a1f44, #112b63)' }
                                            : {}
                                    }
                                >
                                    <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2 uppercase flex items-center justify-between">
                                        {plan.subscription_name}
                                        {plan.offer_img && <img src={plan.offer_img} alt="Offer" className="w-20 sm:w-[100px]" />}
                                    </h3>

                                    <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-green-400 mb-1">
                                        ₹{plan.offer_price}
                                        <span className="line-through text-sm text-red-400">₹{plan.price}</span>
                                    </div>
                                    <p className={`text-sm mb-4 ${isActivePlain ? 'text-gray-300' : 'text-gray-600'}`}>{plan.duration} months</p>

                                    <div
                                        className="text-sm sm:text-base mb-6 space-y-2 leading-relaxed"
                                        style={{ color: isActivePlain ? '#e2e8f0' : '#374151' }}
                                        dangerouslySetInnerHTML={{ __html: benefitsHTML }}
                                    />

                                    {auth ? (
                                        isActivePlain ? (
                                            <button
                                                className="w-full mt-auto cursor-pointer text-white font-semibold py-2 rounded-lg transition-all duration-200"
                                                style={{ background: 'linear-gradient(135deg, #3b5998, #5b7db1)' }}
                                            >
                                                Active Plan
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => checkOutPay(plan)}
                                                className="w-full mt-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                                            >
                                                Buy Now
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            onClick={() => nav('/login')}
                                            className="w-full mt-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                                        >
                                            Buy Now
                                        </button>
                                    )}
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            )}
        </section>
    );
};

export default SubscriptionPlans;
