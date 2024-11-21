import { useCallback, useEffect, useState } from "react";

interface ModalProp {
  isGameOverModal: boolean;
  message: string | null;
  winner: string | null;
  startGameFn?: (t: number) => void;
}

export default function GameModal({
  isGameOverModal,
  message,
  // handleClose,
  winner,
  startGameFn,
}: ModalProp) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(isGameOverModal);
  }, [isGameOverModal]);

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
      <div className="flex flex-col p-4 w-[55%] absolute left-1/2 top-1/2 bg-[#262421] z-10 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-xl sm:w-[70%]">
        <div className="rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Game Over</h2>
            <p className="text-lg mb-4">{message}</p>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow">
                <span className="text-4xl" role="img" aria-label="White King">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="black"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                    <path d="M5 21h14" />
                  </svg>
                </span>
              </div>
              <div className="text-3xl font-bold">
                {winner === "white" ? "1-0" : "0-1"}
              </div>
              <div className="w-16 h-16 bg-gray-950 rounded-full flex items-center justify-center shadow">
                <span
                  className="text-4xl text-white"
                  role="img"
                  aria-label="Black King"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                    <path d="M5 21h14" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleNewGame}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
