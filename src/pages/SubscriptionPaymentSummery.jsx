import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkoutpaySlice } from "../redux/HomeSlice";
import { allCouponData, couponApplyData } from "../redux/couponDataSlice"; // ✅ Import both
import { motion } from "framer-motion";
import { ArrowLeft, Tag, X, CheckCircle, Loader2 } from "lucide-react";

const SubscriptionPaymentSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { plan, planId, pricing, benefits, userInfo } = location.state || {};

    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponsLoading, setCouponsLoading] = useState(true);

    // Load Cashfree SDK
    useEffect(() => {
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

    // Fetch coupons from API
    // useEffect(() => {
    //     const fetchCoupons = async () => {
    //         try {
    //             setCouponsLoading(true);
    //             const response = await dispatch(allCouponData()).unwrap();

    //             if (response.status === 200 && response.data) {
    //                 const formattedCoupons = response.data.map(coupon => {
    //                     const isPercentage = coupon.coupon_type === 'percentage';

    //                     return {
    //                         id: coupon.id,
    //                         code: coupon.code,
    //                         discount: isPercentage
    //                             ? parseFloat(coupon.discount_percent)
    //                             : parseFloat(coupon.flat_amount),
    //                         type: coupon.coupon_type,
    //                         description: isPercentage
    //                             ? `Get ${coupon.discount_percent}% off${coupon.max_discount_amount ? ` (Max ₹${coupon.max_discount_amount})` : ''}`
    //                             : `Flat ₹${coupon.flat_amount } off`,
    //                         min_amount: parseFloat(coupon.min_transaction_amount) || 0,
    //                         max_discount: coupon.max_discount_amount ? parseFloat(coupon.max_discount_amount) : null,
    //                         expiry_date: coupon.end_date,
    //                         is_active: coupon.status === 'active',
    //                     };
    //                 });

    //                 const activeCoupons = formattedCoupons.filter(c => c.is_active);
    //                 setAvailableCoupons(activeCoupons);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching coupons:", error);
    //             setAvailableCoupons([]);
    //         } finally {
    //             setCouponsLoading(false);
    //         }
    //     };

    //     fetchCoupons();
    // }, [dispatch]);

    // Fetch coupons from API
useEffect(() => {
    const fetchCoupons = async () => {
        try {
            setCouponsLoading(true);
            const response = await dispatch(allCouponData()).unwrap();

            if (response.status === 200 && response.data) {
                const formattedCoupons = response.data.map(coupon => {
                    // ✅ FIXED: Check which value is available
                    const isPercentage = coupon.discount_percent !== null && coupon.discount_percent !== undefined;
                    const isFlat = coupon.flat_amount !== null && coupon.flat_amount !== undefined;

                    return {
                        id: coupon.id,
                        code: coupon.code,
                        discount: isPercentage
                            ? parseFloat(coupon.discount_percent)
                            : parseFloat(coupon.flat_amount),
                        type: coupon.coupon_type,
                        // ✅ FIXED: Show correct description based on available value
                        description: isPercentage
                            ? `Get ${coupon.discount_percent}% off${coupon.max_discount_amount ? ` (Max ₹${coupon.max_discount_amount})` : ''}`
                            : isFlat
                                ? `Flat ₹${coupon.flat_amount} off`
                                : 'Discount available', // fallback
                        min_amount: parseFloat(coupon.min_transaction_amount) || 0,
                        max_discount: coupon.max_discount_amount ? parseFloat(coupon.max_discount_amount) : null,
                        expiry_date: coupon.end_date,
                        is_active: coupon.status === 'active',
                    };
                });

                const activeCoupons = formattedCoupons.filter(c => c.is_active);
                setAvailableCoupons(activeCoupons);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
            setAvailableCoupons([]);
        } finally {
            setCouponsLoading(false);
        }
    };

    fetchCoupons();
}, [dispatch]);


    // Redirect if no plan data
    useEffect(() => {
        if (!plan || !pricing) {
            navigate("/subscription");
        }
    }, [plan, pricing, navigate]);

    // ✅ FIXED: Calculate with GST added
    const calculateFinalPrice = () => {
        if (!appliedCoupon) return pricing.totalWithGST;

        // ✅ Manual calculation (don't trust API's final_amount)
        const basePrice = pricing.basePrice; // 349
        const discountAmount = appliedCoupon.discount; // 100
        const priceAfterDiscount = basePrice - discountAmount; // 249
        const gstAmount = priceAfterDiscount * 0.18; // 44.82
        const finalAmount = priceAfterDiscount + gstAmount; // 293.82

        return finalAmount;
    };

    const finalPrice = calculateFinalPrice();
    const savedAmount = appliedCoupon ? pricing.totalWithGST - finalPrice : 0;


    // ✅ Send base price (without GST) to coupon API
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        setIsApplying(true);
        setCouponError("");

        try {
            const formData = new FormData();
            formData.append('coupon_code', couponCode.toUpperCase());
            // ✅ FIXED: Send base price WITHOUT GST
            formData.append('cart_amount', pricing.basePrice.toString()); // 349 instead of 411.82

            const response = await dispatch(couponApplyData(formData)).unwrap();
            console.log("Apply Coupon Response:", response);

            if (response.status === true || response.status === 200) {
                const apiCouponData = {
                    id: null,
                    code: response.data.coupon_code,
                    discount: response.data.discount_amount,
                    type: response.data.coupon_type,
                    description: `${response.data.coupon_type === 'flat' ? 'Flat' : ''} ₹${response.data.discount_amount} off`,
                    api_final_amount: response.data.final_amount,
                };

                setAppliedCoupon(apiCouponData);
                setCouponCode("");
                setCouponError("");
            } else {
                setCouponError(response.message || "Invalid coupon code");
            }
        } catch (error) {
            console.error("Apply coupon error:", error);
            setCouponError(error.message || "Failed to apply coupon. Please try again.");
        } finally {
            setIsApplying(false);
        }
    };


    // Remove coupon
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponError("");
    };

    // Process payment
    const handleProceedToPayment = async () => {
        if (!plan || !planId) return;

        setIsProcessing(true);

        const paymentData = {
            amount: finalPrice,
            subscription_id: planId,
            coupon_code: appliedCoupon?.code || null,
            coupon_id: appliedCoupon?.id || null,
        };

        try {
            const res = await dispatch(checkoutpaySlice(paymentData)).unwrap();

            if (window.Cashfree) {
                const cashfree = window.Cashfree({ mode: "production" });
                cashfree.checkout({
                    paymentSessionId: res.payment_session_id,
                    redirectTarget: "_self",
                    redirectUrl: "/cashfree-payment",
                });
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!plan || !pricing) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">
                        Payment Summary
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Plan Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-lg p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                Selected Plan
                            </h2>
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div>
                                    <p className="font-semibold text-lg text-gray-800">
                                        {plan.subscription_name}
                                    </p>
                                    <p className="text-sm text-gray-600">{plan.duration} months</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 line-through text-sm">₹{plan.price}</p>
                                    <p className="text-xl font-bold text-green-600">
                                        ₹{plan.offer_price}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Coupon Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-lg shadow-lg p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                <Tag className="w-5 h-5 mr-2 text-green-600" />
                                Apply Coupon
                            </h2>

                            {/* Coupon Input */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={appliedCoupon}
                                />
                                {!appliedCoupon ? (
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={isApplying || !couponCode.trim()}
                                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${isApplying || !couponCode.trim()
                                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                            }`}
                                    >
                                        {isApplying ? "Applying..." : "Apply"}
                                    </button>
                                ) : null}
                            </div>

                            {couponError && (
                                <p className="text-red-600 text-sm mb-4">{couponError}</p>
                            )}

                            {/* Applied Coupon */}
                            {appliedCoupon && (
                                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                        <div>
                                            <p className="font-semibold text-green-800">
                                                {appliedCoupon.code} Applied!
                                            </p>
                                            <p className="text-sm text-green-600">
                                                {appliedCoupon.description}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRemoveCoupon}
                                        className="p-1 hover:bg-green-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-green-600" />
                                    </button>
                                </div>
                            )}

                            {/* Available Coupons */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-3">
                                    Available Coupons:
                                </p>

                                {couponsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                        <span className="ml-2 text-gray-600">Loading coupons...</span>
                                    </div>
                                ) : availableCoupons.length > 0 ? (
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {availableCoupons.map((coupon) => (
                                            <div
                                                key={coupon.id}
                                                className={`p-3 border rounded-lg cursor-pointer transition-all ${appliedCoupon?.code === coupon.code
                                                        ? "border-green-500 bg-green-50"
                                                        : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                                                    }`}
                                                onClick={() => {
                                                    if (!appliedCoupon) {
                                                        setCouponCode(coupon.code);
                                                    }
                                                }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800">
                                                            {coupon.code}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {coupon.description}
                                                        </p>
                                                        {coupon.min_amount > 0 && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Min order: ₹{coupon.min_amount}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {appliedCoupon?.code !== coupon.code && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCouponCode(coupon.code);
                                                                setTimeout(() => handleApplyCoupon(), 100);
                                                            }}
                                                            className="text-blue-600 text-sm font-semibold hover:underline ml-2"
                                                        >
                                                            Apply
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm text-center py-4">
                                        No coupons available at the moment
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>


                    {/* Price Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-lg shadow-lg p-6 sticky top-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                Price Summary
                            </h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Plan Price:</span>
                                    <span>₹{pricing.basePrice}</span>
                                </div>

                                {/* ✅ Show discount if coupon applied */}
                                {appliedCoupon && (
                                    <div className="flex justify-between text-red-600">
                                        <span>Coupon Discount:</span>
                                        <span>- ₹{appliedCoupon.discount}</span>
                                    </div>
                                )}

                                {/* ✅ Show price after discount (before GST) */}
                                {appliedCoupon && (
                                    <div className="flex justify-between text-gray-700 font-medium">
                                        <span>Price After Discount:</span>
                                        <span>₹{(pricing.basePrice - appliedCoupon.discount).toFixed(2)}</span>
                                    </div>
                                )}

                                {/* ✅ Show GST on discounted price */}
                                <div className="flex justify-between text-gray-700">
                                    <span>GST (18%):</span>
                                    <span>
                                        ₹{appliedCoupon
                                            ? ((pricing.basePrice - appliedCoupon.discount) * 0.18).toFixed(2)
                                            : pricing.gstAmount.toFixed(2)
                                        }
                                    </span>
                                </div>

                                {/* ✅ Remove old Total line if coupon applied */}
                                {!appliedCoupon && (
                                    <div className="flex justify-between text-gray-700">
                                        <span>Total:</span>
                                        <span>₹{pricing.totalWithGST}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800">
                                        Final Amount:
                                    </span>
                                    <span className="text-2xl font-bold text-green-600">
                                        ₹{finalPrice.toFixed(2)}
                                    </span>
                                </div>
                                {appliedCoupon && (
                                    <p className="text-sm text-green-600 mt-2">
                                        You saved ₹{savedAmount.toFixed(2)}!
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleProceedToPayment}
                                disabled={isProcessing}
                                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${isProcessing
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                                    }`}
                            >
                                {isProcessing ? "Processing..." : "Proceed to Payment"}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Secure payment powered by Cashfree
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SubscriptionPaymentSummary;
