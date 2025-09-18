import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkoutpaySlice, getSubscriptionSlice } from "../redux/HomeSlice";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { motion } from "framer-motion";

const SubscriptionPlans = ({ userInfo }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [planId, setPlanId] = useState("");
  const [auth, setAuth] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // Dynamically load Cashfree SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const getSubscription = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(getSubscriptionSlice()).unwrap();
      if (res.status_code === 200) {
        setSubscriptionData(res.data.plus.details);
        setPlanId(res.data.plus.id);
        console.log("Subscription plan", res.data.plus.details);

        // Benefits HTML → array
        const temp = res.data.plus.benefits
          .replace(/<\/?p>/g, "")
          .split("<br />")
          .map((line) => line.replace(/<[^>]*>?/gm, "").trim())
          .filter((line) => line.length > 0);
        setBenefits(temp);
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
      subscription_id: planId,
    };

    try {
      const res = await dispatch(checkoutpaySlice(planData)).unwrap();
      if (window.Cashfree) {
        const cashfree = window.Cashfree({ mode: "production" });
        cashfree.checkout({
          paymentSessionId: res.payment_session_id,
          redirectTarget: "_self",
          redirectUrl: "/cashfree-payment",
        });
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

  return (
    <section className="min-h-screen bg-gray-50 py-6 px-3 sm:py-8 sm:px-4 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Title */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 sm:mb-8 lg:mb-12 px-2"
        >
          Our Subscription Plans
        </motion.h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center text-gray-600 text-base sm:text-lg">
              Loading Plans...
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            {/* Mobile Layout (< lg) */}
            <div className="lg:hidden space-y-6">
              {/* Benefits Section - Mobile */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
                  Benefits
                </h2>
                <ul className="space-y-2 sm:space-y-3">
                  {benefits.map((b, i) => (
                    <li key={i} className="text-gray-700 flex items-start text-sm sm:text-base">
                      <span className="text-green-600 mr-2 mt-1 flex-shrink-0">✓</span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plans Section - Mobile */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                  Special Offers for You!
                </h2>
                
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700">
                  Select your Plan:
                </h3>

                {/* Mobile Plan Cards */}
                <div className="space-y-3 sm:space-y-4">
                  {subscriptionData.map((plan, idx) => {
                    const isActivePlan = userInfo?.subscription_details?.some(
                      (sub) => sub.subscription_name === plan.subscription_name
                    );
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        onClick={() => setSelectedPlan(plan)} // ✅ All plans selectable
                        className={`border rounded-lg p-3 sm:p-4 transition-all duration-200 cursor-pointer ${
                          isActivePlan 
                            ? selectedPlan?.subscription_name === plan.subscription_name
                              ? "border-green-500 bg-green-50 shadow-lg transform scale-105"
                              : "border-green-500 bg-green-50"
                            : selectedPlan?.subscription_name === plan.subscription_name
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-400 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-800 text-base sm:text-lg">
                                {plan.subscription_name}
                              </p>
                              {/* ✅ Active Badge */}
                              {isActivePlan && (
                                <span className="px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {plan.duration} months
                            </p>
                            {/* ✅ Show reactivation message for active plans */}
                            {isActivePlan && (
                              <p className="text-xs text-green-600 mt-1">
                                Renew or extend your subscription
                              </p>
                            )}
                          </div>

                          {/* ✅ Always show pricing */}
                          <div className="text-right">
                            <div className="text-gray-400 line-through text-sm">
                              ₹{plan.price}
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-green-600">
                              ₹{plan.offer_price}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Total Price - Mobile */}
                <div className="border-t mt-4 sm:mt-6 pt-4 sm:pt-6">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <span className="text-gray-700 font-medium text-base sm:text-lg">
                      To Pay
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      {selectedPlan ? `₹${selectedPlan.offer_price}` : "₹0"}
                    </span>
                  </div>

                  {/* Proceed Button - Mobile */}
                  <button
                    onClick={() => (auth ? checkOutPay(selectedPlan) : nav("/login"))}
                    disabled={!selectedPlan}
                    className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 ${
                      selectedPlan
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {!auth 
                      ? "Login to Continue" 
                      : selectedPlan && userInfo?.subscription_details?.some(
                          (sub) => sub.subscription_name === selectedPlan.subscription_name
                        )
                      ? "Renew Subscription"
                      : "Proceed To Payment"
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout (lg+) */}
            <div className="hidden lg:block">
              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Benefits Column - Desktop */}
                <div className="bg-gray-100 flex-1 p-6 xl:p-8 border-r min-w-[300px]">
                  <h2 className="text-2xl xl:text-3xl font-semibold mb-6 xl:mb-8 text-gray-800">
                    Benefits
                  </h2>
                  <ul className="space-y-4 xl:space-y-5">
                    {benefits.map((b, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="text-gray-700 flex items-start text-base xl:text-lg"
                      >
                        <span className="text-green-600 mr-3 mt-1 flex-shrink-0 text-lg">✓</span>
                        <span className="leading-relaxed">{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Plans Column - Desktop */}
                <div className="bg-white flex-[2] p-6 xl:p-8">
                  <h2 className="text-xl xl:text-2xl font-semibold mb-4 xl:mb-6 text-gray-800">
                    Special Offers for You!
                  </h2>

                  <h3 className="text-lg xl:text-xl font-semibold mb-4 xl:mb-6 text-gray-700">
                    Select your Plan:
                  </h3>

                  {/* Desktop Plan Cards */}
                  <div className="space-y-4 xl:space-y-5 mb-6 xl:mb-8">
                    {subscriptionData.map((plan, idx) => {
                      const isActivePlan = userInfo?.subscription_details?.some(
                        (sub) => sub.subscription_name === plan.subscription_name
                      );
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          onClick={() => setSelectedPlan(plan)} // ✅ All plans selectable
                          className={`border rounded-lg p-4 xl:p-5 flex justify-between items-center transition-all duration-200 cursor-pointer ${
                            isActivePlan 
                              ? selectedPlan?.subscription_name === plan.subscription_name
                                ? "border-green-500 bg-green-50 shadow-lg transform scale-105"
                                : "border-green-500 bg-green-50 hover:shadow-md"
                              : selectedPlan?.subscription_name === plan.subscription_name
                              ? "border-blue-500 bg-blue-50 shadow-lg transform scale-105"
                              : "border-gray-200 hover:border-blue-400 hover:shadow-md hover:transform hover:scale-102"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="font-semibold text-gray-800 text-lg xl:text-xl">
                                {plan.subscription_name}
                              </p>
                              {/* ✅ Active Badge */}
                              {isActivePlan && (
                                <span className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm xl:text-base text-gray-500">
                              {plan.duration} months
                            </p>
                            {/* ✅ Show reactivation message for active plans */}
                            {isActivePlan && (
                              <p className="text-sm text-green-600 mt-1">
                                Renew or extend your subscription
                              </p>
                            )}
                          </div>

                          {/* ✅ Always show pricing */}
                          <div className="text-right">
                            <div className="text-gray-400 line-through text-sm xl:text-base">
                              ₹{plan.price}
                            </div>
                            <div className="text-xl xl:text-2xl font-bold text-green-600">
                              ₹{plan.offer_price}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Final Price - Desktop */}
                  <div className="border-t pt-6 xl:pt-8">
                    <div className="flex justify-between items-center mb-6 xl:mb-8">
                      <span className="text-gray-700 font-medium text-lg xl:text-xl">
                        To Pay
                      </span>
                      <span className="text-2xl xl:text-3xl font-bold text-gray-900">
                        {selectedPlan ? `₹${selectedPlan.offer_price}` : "₹0"}
                      </span>
                    </div>

                    {/* Proceed Button - Desktop */}
                    <button
                      onClick={() => (auth ? checkOutPay(selectedPlan) : nav("/login"))}
                      disabled={!selectedPlan}
                      className={`w-full py-4 xl:py-5 rounded-lg font-semibold text-lg xl:text-xl transition-all duration-300 ${
                        selectedPlan
                          ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {!auth 
                        ? "Login to Continue" 
                        : selectedPlan && userInfo?.subscription_details?.some(
                            (sub) => sub.subscription_name === selectedPlan.subscription_name
                          )
                        ? "Renew Subscription"
                        : "Proceed To Payment"
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SubscriptionPlans;
