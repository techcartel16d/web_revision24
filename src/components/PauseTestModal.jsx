// PauseTestModal.jsx
import React from 'react';

const PauseTestModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Pause Test</h2>
                <p className="text-gray-600 mb-6">Do you want to pause the test?</p>
                <div className="flex justify-end gap-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={onConfirm}
                    >
                        Yes, Pause
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PauseTestModal;
