import React from "react";

const RegisterModal = ({ visible, onClose, onConfirm }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-80 p-6 text-center">
        <h3 className="font-bold text-lg text-black">
          Are you ready to join this live test?
        </h3>

        {/* <p className="font-bold mt-2 text-sm text-black">
          Entry Fee: ₹0
        </p> */}

        <p className="mt-3 text-xs text-gray-600">
          If you want to join this quiz, press "Yes".
        </p>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={onConfirm}
            className="bg-gray-200 text-black px-4 py-2 rounded-full text-xs w-full"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-full text-xs w-full"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;