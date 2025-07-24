import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkoutpaySlice, getSubscriptionSlice } from '../redux/HomeSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const SubscriptionPlans = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [benefitsHTML, setBenefitsHTML] = useState('');
    const [plainId, setPlanId] = useState('')
    const [auth, setAuth] = useState(false);
    const nav = useNavigate()

    const getSubscription = async () => {
        try {
            setIsLoading(true);
            const res = await dispatch(getSubscriptionSlice()).unwrap();
            // console.log("respose", res)
            if (res.status_code == 200) {
                setSubscriptionData(res.data.plus.details);
                setPlanId(res.data.plus.id)
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


    // useEffect में SDK script add करना
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // cleanup
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
                    const cashfree = window.Cashfree({
                        mode: "sandbox", // Use "production" when live
                    });

                    const checkoutOptions = {
                        paymentSessionId: res.payment_session_id,
                        redirectTarget: "_self",
                        redirectUrl: "/api/payment-response", // 👈 Success Page URL here
                    };

                    cashfree.checkout(checkoutOptions);
                } else {
                    alert("Cashfree SDK not loaded yet. Please try again.");
                }
            } else {
                // console.log("Error: Payment session not created.");
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
            <h1 className="text-center text-4xl md:text-5xl font-bold text-blue-600 mb-16">
                Our Subscriptions
            </h1>

            {isLoading ? (
                <div className="text-center text-xl text-gray-600">Loading Plans...</div>
            ) : (
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {subscriptionData.map((plan, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl shadow-lg bg-white p-6 md:p-8 hover:scale-105 transition-all duration-300"
                        >
                            <h3 className="text-xl font-bold text-blue-800 mb-2 uppercase">
                                {plan.subscription_name}
                            </h3>
                            <div className="flex items-center gap-2 text-2xl font-bold text-green-600 mb-1">
                                ₹{plan.offer_price}
                                <span className="line-through text-sm text-red-400">₹{plan.price}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{plan.duration} months</p>

                            <div
                                className="text-sm text-gray-700 mb-6 space-y-2"
                                dangerouslySetInnerHTML={{ __html: benefitsHTML }}
                            />

                            {
                                auth ? (
                                    <button onClick={() => checkOutPay(plan)} className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200">
                                        Buy Now
                                    </button>
                                ) : (
                                    <button onClick={() => nav('/login')} className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200">
                                        Buy Now
                                    </button>
                                )
                            }

                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default SubscriptionPlans;
