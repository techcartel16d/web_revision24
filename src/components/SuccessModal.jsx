import React from 'react';
import ModalBase from './ModalBase';

const SuccessModal = ({ isOpen, onClose, message }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="text-green-500 text-4xl mb-2">✔</div>
        <h2 className="text-xl font-bold mb-2">Success</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          OK
        </button>
      </div>
    </ModalBase>
  );
};

export default SuccessModal;
