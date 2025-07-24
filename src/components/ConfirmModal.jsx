import React from 'react';
import ModalBase from './ModalBase';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">{title || 'Are you sure?'}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default ConfirmModal;
