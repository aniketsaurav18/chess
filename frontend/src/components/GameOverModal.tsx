import { Button } from "@nextui-org/button";

interface ModalProp {
  isGameOverModal: boolean;
}

export default function GameModal({ isGameOverModal }: ModalProp) {
  if (isGameOverModal) {
    return (
      <div className="flex flex-col p-4 w-[55%] absolute left-1/2 top-1/2 bg-[#262421] z-10 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-xl sm:w-[70%]">
        <div
          id="modal-main-content"
          className="w-full h-40 grid place-items-center"
        >
          <p className="font-normal text-4xl align-middle md:text-2xl sm:text-xl">
            You won 🎉
          </p>
        </div>
        <Button color="primary" size="md">
          New Game
        </Button>
      </div>
    );
  } else {
    return null;
  }
}
