import { Button } from "@nextui-org/button";

interface ModalProp {
  isGameOverModal: boolean;
  message: string | null;
  handleClose?: () => void;
}

export default function GameModal({
  isGameOverModal,
  message,
  handleClose,
}: ModalProp) {
  if (isGameOverModal) {
    return (
      <div className="flex flex-col p-4 w-[55%] absolute left-1/2 top-1/2 bg-[#262421] z-10 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-xl sm:w-[70%]">
        <div
          id="modal-main-content"
          className="w-full h-40 grid place-items-center"
        >
          <p className="font-normal text-xl align-middle md:text-2xl sm:text-xl">
            {message ? message : "Game Over"}
          </p>
        </div>
        <div className="flex justify-between mt-4">
          <Button color="primary" size="md">
            New Game
          </Button>
          <Button color="primary" size="md" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
