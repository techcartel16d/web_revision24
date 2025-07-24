import React from 'react';

const ModalBase = ({ isOpen, onClose, children, bg='bg-white' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center">
      <div className={`${bg} rounded-xl p-6 shadow-lg w-full max-w-md relative animate-fadeIn`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalBase;
