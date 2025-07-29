import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const AppPaymentResponse = () => {
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");
    const orderId = searchParams.get("order_id");
    const paymentId = searchParams.get("payment_id");
    const reason = searchParams.get("reason");

    const isSuccess = status === "success";

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
                <img
                    src={
                        isSuccess
                            ? "https://cdn-icons-png.flaticon.com/512/845/845646.png"
                            : "https://cdn-icons-png.flaticon.com/512/1828/1828665.png"
                    }
                    alt={isSuccess ? "Success" : "Failed"}
                    className="w-20 h-20 mx-auto mb-4"
                />
                <h2 className={`text-2xl font-bold mb-2 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
                    {isSuccess ? "Payment Successful!" : "Payment Failed!"}
                </h2>

                {isSuccess ? (
                    <p className="text-gray-600 mb-4">
                        Thank you for your payment. Your subscription is now active.
                    </p>
                ) : (
                    <p className="text-gray-600 mb-4">
                        Sorry, your payment could not be processed.
                    </p>
                )}

                <div className="text-left text-sm text-gray-700 mb-4">
                    <p><strong>Order ID:</strong> {orderId}</p>
                    {paymentId && <p><strong>Payment ID:</strong> {paymentId}</p>}
                    {!isSuccess && reason && <p><strong>Reason:</strong> {reason}</p>}
                </div>

                <p

                    className={`inline-block px-6 py-2 text-white ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} rounded-lg shadow`}
                >
                    GO TO APP FOR CHECK WALLET
                </p>
            </div>
        </div>
    );
};

export default AppPaymentResponse;