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
  const [selectedPlan, setSelectedPlan] = useState(null); // <-- selected plan
  const nav = useNavigate();

  const getSubscription = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(getSubscriptionSlice()).unwrap();
      if (res.status_code === 200) {
        setSubscriptionData(res.data.plus.details);
        setPlanId(res.data.plus.id);

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

  return (
  <section className="py-12 px-4 bg-gray-50 h-screen relative">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-center text-3xl md:text-5xl font-bold text-gray-800 mb-12">
      Our Subscription Plans
    </h1>

    {isLoading ? (
      <div className="text-center text-gray-600 text-lg">Loading Plans...</div>
    ) : (
      <>
        {/* --- Mobile View: Cards --- */}
        <div className="grid gap-6 md:hidden">
          {subscriptionData.map((plan, idx) => {
            const isActivePlan = userInfo?.subscription_details?.some(
              (sub) => sub.subscription_name === plan.subscription_name
            );

            const isSelected =
              selectedPlan?.subscription_name === plan.subscription_name;

            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                animate={{ scale: isSelected ? 1.05 : 1 }}
                className={`shadow rounded-lg p-6 border transition-all cursor-pointer 
                  ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-600 ring-2 ring-blue-400"
                      : "bg-white text-gray-800"
                  }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <h3 className="text-xl font-bold mb-2">
                  {plan.subscription_name}
                </h3>

                <div className="mb-4">
                  <span
                    className={`text-3xl font-extrabold ${
                      isSelected ? "text-white" : "text-blue-600"
                    }`}
                  >
                    ₹{plan.offer_price}
                  </span>
                  <div
                    className={`line-through ${
                      isSelected ? "text-gray-200" : "text-gray-400"
                    }`}
                  >
                    ₹{plan.price}
                  </div>
                  <p
                    className={`text-sm ${
                      isSelected ? "text-gray-100" : "text-gray-500"
                    }`}
                  >
                    {plan.duration} months
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {benefits.map((b, i) => (
                    <li
                      key={i}
                      className={`flex items-center ${
                        isSelected ? "text-gray-100" : "text-gray-700"
                      }`}
                    >
                      <span
                        className={`mr-2 ${
                          isSelected ? "text-green-300" : "text-green-500"
                        }`}
                      >
                        ✔
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                {auth ? (
                  isActivePlan ? (
                    <button className="w-full py-2 rounded-lg bg-gray-600 text-white font-semibold cursor-default">
                      Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => checkOutPay(plan)}
                      className={`w-full py-2 rounded-lg font-semibold transition-all ${
                        isSelected
                          ? "bg-white text-blue-700 hover:bg-gray-100"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Subscribe Now
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => nav("/login")}
                    className={`w-full py-2 rounded-lg font-semibold transition-all ${
                      isSelected
                        ? "bg-white text-blue-700 hover:bg-gray-100"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Subscribe Now
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* --- Desktop View: Comparison Table --- */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-[900px] grid grid-cols-[250px_repeat(auto-fill,minmax(200px,1fr))] bg-white rounded-lg shadow-lg">
            {/* Left Column (Benefits) */}
            <div className="bg-gray-100 p-6 border-r">
              <h2 className="text-lg font-semibold mb-4">Benefits</h2>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Plans */}
            {subscriptionData.map((plan, idx) => {
              const isActivePlan = userInfo?.subscription_details?.some(
                (sub) => sub.subscription_name === plan.subscription_name
              );
              const isSelected =
                selectedPlan?.subscription_name === plan.subscription_name;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  animate={{ scale: isSelected ? 1.05 : 1 }}
                  className={`flex flex-col border-l p-6 text-center cursor-pointer transition-all 
                    ${
                      isSelected
                        ? "bg-gradient-to-b from-blue-500 to-indigo-500 text-white border-blue-600 ring-2 ring-blue-400"
                        : "bg-white text-gray-800"
                    }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <h3 className="text-xl font-bold mb-2">
                    {plan.subscription_name}
                  </h3>
                  <div className="mb-4">
                    <span
                      className={`text-3xl font-extrabold ${
                        isSelected ? "text-white" : "text-blue-600"
                      }`}
                    >
                      ₹{plan.offer_price}
                    </span>
                    <div
                      className={`line-through ${
                        isSelected ? "text-gray-200" : "text-gray-400"
                      }`}
                    >
                      ₹{plan.price}
                    </div>
                    <p
                      className={`text-sm ${
                        isSelected ? "text-gray-100" : "text-gray-500"
                      }`}
                    >
                      {plan.duration} months
                    </p>
                  </div>
                  <ul className="flex-grow space-y-3 mb-6">
                    {benefits.map((_, i) => (
                      <li key={i} className="flex justify-center">
                        <span
                          className={`text-lg ${
                            isSelected ? "text-green-300" : "text-green-500"
                          }`}
                        >
                          ✔
                        </span>
                      </li>
                    ))}
                  </ul>

                  {auth ? (
                    isActivePlan ? (
                      <button className="w-full py-2 rounded-lg bg-gray-600 text-white font-semibold cursor-default">
                        Active Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => checkOutPay(plan)}
                        className={`w-full py-2 rounded-lg font-semibold transition-all ${
                          isSelected
                            ? "bg-white text-blue-700 hover:bg-gray-100"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        Subscribe Now
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => nav("/login")}
                      className={`w-full py-2 rounded-lg font-semibold transition-all ${
                        isSelected
                          ? "bg-white text-blue-700 hover:bg-gray-100"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Subscribe Now
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* --- Selected Plan Bottom Bar --- */}
        {selectedPlan && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 flex items-center justify-between"
          >
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                {selectedPlan.subscription_name}
              </h4>
              <p className="text-blue-600 font-bold text-xl">
                ₹{selectedPlan.offer_price}
              </p>
            </div>
            <button
              onClick={() => (auth ? checkOutPay(selectedPlan) : nav("/login"))}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Proceed to Pay
            </button>
          </motion.div>
        )}
      </>
    )}
  </div>
</section>

  );
};

export default SubscriptionPlans;
