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
        console.log("Subscription plan", res.data.plus.details)

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
    <section className="py-12 px-4 bg-gray-50 h-screen relative">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-3xl md:text-5xl font-bold text-gray-800 mb-12">
          Our Subscription Plans
        </h1>

        {isLoading ? (
          <div className="text-center text-gray-600 text-lg">Loading Plans...</div>
        ) : (
          <>
            {/* --- Plans Comparison Table (all devices) --- */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[900px] flex bg-white rounded-lg shadow-lg">
                {/* Left Column (Benefits → kam width) */}
                <div className="bg-gray-100 flex-[1] p-6 border-r min-w-[220px]">
                  <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
                  <ul className="space-y-4">
                    {benefits.map((b, i) => (
                      <li key={i} className="text-gray-700 flex items-start">
                        <span className="mr-2">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Sidebar (Offers + Payment → zyada width) */}
                <div className="bg-white shadow-lg rounded-lg flex-[2] p-6">
                  <h2 className="text-lg font-semibold mb-3">Special Offers for You!</h2>

                  {/* Select Plan */}
                  <h3 className="text-base font-semibold mb-3">Select your Plan:</h3>
                  {subscriptionData.map((plan, idx) => {
                    const isActivePlan = userInfo?.subscription_details?.some(
                      (sub) => sub.subscription_name === plan.subscription_name
                    );
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedPlan(plan)}
                        className={`border rounded-lg p-4 flex justify-between items-center mb-4 cursor-pointer transition-all 
    ${selectedPlan?.subscription_name === plan.subscription_name
                            ? "border-blue-500 bg-blue-50"
                            : "hover:border-blue-400"
                          }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">{plan.subscription_name}</p>
                          <p className="text-sm text-gray-500">{plan.duration} months</p>
                        </div>

                        {/* Price / Active */}
                        <div className="text-right flex items-center">
                          {!isActivePlan && (
                            <div>
                              <div className="text-gray-400 line-through text-sm">₹{plan.price}</div>
                              <div className="text-xl font-bold text-green-600">₹{plan.offer_price}</div>
                            </div>
                          )}

                          {isActivePlan && (
                            <span className="ml-3 px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded">
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                    );
                  })}

                  {/* Final Price */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-700 font-medium">To Pay</span>
                    <span className="text-lg font-bold text-gray-900">
                      {selectedPlan ? `₹${selectedPlan.offer_price}` : "₹0"}
                    </span>
                  </div>

                  {/* Proceed Button */}
                  <button
                    onClick={() => (auth ? checkOutPay(selectedPlan) : nav("/login"))}
                    disabled={!selectedPlan}
                    className={`w-full py-3 rounded-lg font-semibold transition-all 
        ${selectedPlan
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                  >
                    Proceed To Payment
                  </button>
                </div>
              </div>

            </div>

          </>
        )}
      </div>
    </section >

  );
};

export default SubscriptionPlans;
