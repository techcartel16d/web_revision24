import React from 'react';
import ModalBase from './ModalBase';

const AlertModal = ({ isOpen, onClose, title = 'Alert', message }) => {
  return (
    <ModalBase bg={'bg-red-100'} isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-3">
        {/* <div className="text-yellow-500 text-4xl mb-2">⚠️</div> */}
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-5 py-2  rounded hover:bg-red-600"
        >
          OK
        </button>
      </div>
    </ModalBase>
  );
};

export default AlertModal;
