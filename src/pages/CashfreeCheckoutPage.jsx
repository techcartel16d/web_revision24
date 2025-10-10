import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CashfreeCheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sdkLoaded, setSdkLoaded] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    // console.log("queryParams", queryParams)
    const orderId = queryParams.get('order_id');
    const sessionId = queryParams.get('session_id');
    const userId = queryParams.get('user_id');
    const amount = queryParams.get('amount');

    // Load Cashfree SDK
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js";
        script.async = true;

        script.onload = () => {
            setSdkLoaded(true);
        };

        script.onerror = () => {
            alert("Failed to load Cashfree SDK");
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Call checkout when SDK is loaded
    useEffect(() => {
        if (!orderId || !sessionId || !userId || !amount) {
            navigate('/payment-response?status=failed&reason=missing_params');
            return;
        }

       useEffect(() => {
  if (sdkLoaded && sessionId) {
    const cashfree = new window.Cashfree({
      mode: "production", // or "sandbox"
    });

    cashfree.checkout({
      paymentSessionId: sessionId,
      redirectTarget: "_self"
    }).then((result) => {
      // console.log("Payment result:", result);
      if (result.error) {
        navigate(`/payment-response?status=failed&reason=${result.error.message}`);
      } else {
        navigate(`/payment-response?status=success&order_id=${orderId}`);
      }
    });
  }
}, [sdkLoaded, sessionId]);

    }, [sdkLoaded, orderId, sessionId, userId, amount, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <h2 className="text-lg font-semibold text-gray-700">Launching Payment...</h2>
            <p className="text-gray-500 mt-2">Please wait while we initiate your secure payment session.</p>
        </div>
    );
};

export default CashfreeCheckoutPage;