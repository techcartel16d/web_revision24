import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
const RefundPolicy = () => {
  return (
    <>
      {/* <Header /> */}
      <div className="max-w-4xlpx-4 p-8 text-gray-800 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Refund Policy</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Last updated: April 01, 2025
        </p>

        <p className="mb-6">
          Thank you for choosing Revision24, your trusted platform for civil
          services exam preparation. Please read our refund policy carefully
          before making any purchases.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            1. Digital Nature of Services
          </h2>
          <p>
            All services provided on Revision24, including mock tests, test
            series, ebooks, and other study materials, are digital products.
            Once accessed or downloaded, these products are considered used and
            are therefore non-refundable.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            2. No Refunds on Subscriptions or One-Time Purchases
          </h2>
          <p>
            All purchases made on the Revision24 platform are final. We do not
            offer refunds for any subscription plans, test series, or individual
            product purchases once the transaction is completed.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Exceptions</h2>
          <p>
            Refunds may only be considered under exceptional circumstances such
            as:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Duplicate payment for the same service.</li>
            <li>Payment deducted but service not activated within 48 hours.</li>
          </ul>
          <p className="mt-2">
            In such cases, you must contact our support team within 7 days of
            the transaction, with proof of payment and full transaction details.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            4. Contact for Refund Issues
          </h2>
          <p>
            If you believe you are eligible for a refund under the exceptions
            above, please write to us at{" "}
            <a
              href="mailto:support@revision24.com"
              className="text-blue-600 underline"
            >
              support@revision24.com
            </a>{" "}
            with all relevant details.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Processing Time</h2>
          <p>
            If your refund request is approved, the amount will be credited to
            your original payment method within 7–10 business days, depending on
            your bank or payment provider.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            6. Changes to This Policy
          </h2>
          <p>
            Revision24 reserves the right to update or modify this refund policy
            at any time. Please review this page periodically for any changes.
          </p>
        </section>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default RefundPolicy;
