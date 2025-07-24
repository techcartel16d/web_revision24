import React, { useEffect, useState } from 'react';

const SubscriptionModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 5000); // Show modal after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => setShowModal(false);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)] bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Subscribe Now</h2>
        <p className="text-gray-700 mb-4 text-center">Unlock all premium features by subscribing!</p>
        <div className="flex justify-center">
          <button
            onClick={closeModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
