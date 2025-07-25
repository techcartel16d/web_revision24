import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
const PrivacyPolicy = () => {

  return (
    <>
    <Header />
    <div className="max-w-4xlpx-4 p-8 text-gray-800 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy – Revision24</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Effective Date: July 1, 2025</p>

      <p className="mb-6">
        This Privacy Policy explains how Revision24 collects, uses, and protects your information.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Phone Number (for registration)</li>
          <li>Name and PIN</li>
          <li>Email (optional)</li>
          <li>Usage data (tests, scores, preferences)</li>
          <li>Bank details (for reward payouts)</li>
          <li>Referral info</li>
          <li>Device & browser info</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To manage your account and access to content</li>
          <li>To track progress and performance</li>
          <li>To process payments and rewards</li>
          <li>To improve our services</li>
          <li>To send updates and notifications</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Sharing Your Information</h2>
        <p>
          We do not sell your data. Data may be shared with payment processors or legal authorities when necessary.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
        <p>
          We use standard encryption and controls, but cannot guarantee absolute security online.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Cookies & Tracking</h2>
        <p>
          We may use cookies to personalize content and improve experience.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
        <p>
          You may view/edit your profile, request data deletion, or opt out of marketing. Contact: <a href="mailto:privacy@revision24.com" className="text-blue-600 underline">privacy@revision24.com</a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Children’s Privacy</h2>
        <p>
          Our service is not for children under 13. We do not knowingly collect data from minors.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Third-Party Links</h2>
        <p>
          We are not responsible for the privacy practices of third-party websites.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Updates to Policy</h2>
        <p>
          We may change this policy. Updated versions will be available on our platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
        <p>
          For any questions, email us at <a href="mailto:privacy@revision24.com" className="text-blue-600 underline">privacy@revision24.com</a>
        </p>
      </section>
    </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
