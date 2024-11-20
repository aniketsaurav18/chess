import { useCallback, useEffect, useState } from "react";

interface ModalProp {
  isGameOverModal: boolean;
  message: string | null;
  // handleClose?: () => void;
  startGameFn?: (t: number) => void;
}

export default function GameModal({
  isGameOverModal,
  message,
  // handleClose,
  startGameFn,
}: ModalProp) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(isGameOverModal);
  });

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleNewGame = useCallback(() => {
    setIsOpen(false);
    startGameFn && startGameFn(10);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose]);
  if (isOpen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Game Over</h2>
            <p className="text-lg mb-4">{message}</p>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow">
                <span className="text-4xl" role="img" aria-label="White King">
                  ♔
                </span>
              </div>
              <div className="text-3xl font-bold">{1 - 0}</div>
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow">
                <span
                  className="text-4xl text-white"
                  role="img"
                  aria-label="Black King"
                >
                  ♚
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleNewGame}
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                New Game
              </button>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
