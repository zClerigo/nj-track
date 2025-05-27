import { useState } from "react"; 
import PropTypes from "prop-types"; 
//JUST USE DIALOG element
function Modal ({
  title,
  message,
  type = "default",
  onConfirm,
  onCancel,
  isVisible = false,
}) {
  const [isOpen, setIsOpen] = useState(isVisible);
  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  if (type == "default") {
    return (
      <div>
        {/* Modal */}
        {isOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              {/* Close Button */}
              <button
                onClick={toggleModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-900"
              >
                ✕
              </button>

              {/* Modal Content */}
              <h3 className="text-lg font-bold mb-4">
                {title || "Default Title"}
              </h3>
              <p className="text-gray-500 mb-6">
                {message || "Default message here."}
              </p>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    onConfirm && onConfirm();
                    toggleModal();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    onCancel && onCancel();
                    toggleModal();
                  }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else if (type == "warning") {
    return (
      <div>
        {/* Modal */}
        {isOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-transit_white rounded-lg shadow-lg max-w-md w-full p-6 flex flex-col justify-center items-center transition-all">
              {/* Modal Content */}
              <div className="flex items-center justify-center w-3/5">
                <svg
                  className="w-16 h-16 text-transit_orange"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg text-transit_black font-bold mb-4 text-center">
                {title || "Default Title"}
              </h3>
              <p className="text-gray-500 mb-6 text-center">
                {message || "Default message here."}
              </p>
              <button
                className="bg-transit_blue w-3/5 hover:bg-[#0778e3] text-normal_text p-3"
                onClick={toggleModal}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
};
Modal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(["default", "warning"]),
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  isVisible: PropTypes.bool,
};
export default Modal;
