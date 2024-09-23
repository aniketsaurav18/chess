import { useEffect, useState, memo } from "react";
import MoveHistory from "./MoveHistory";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { GameTimeLimit } from "../utils/config";
import "../../public/cardinal.css";
import {
  FaFastBackward,
  FaFastForward,
  FaFlag,
  FaHandshake,
  FaStepBackward,
  FaStepForward,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

interface Move {
  from: string;
  to: string;
  color: string;
  piece: string;
  san: string;
  flags: string;
  lan: string;
  before: string;
  after: string;
  captured?: string;
  time: number;
}

interface GameInfoProps {
  side: BoardOrientation;
  waiting: boolean;
  status: "STARTED" | "OVER" | "WAITING" | "IDEAL";
  socket: WebSocket | null;
  startGame: (timeLimit: number) => boolean;
  gameHistory: Move[];
  drawOffered: boolean;
  setDrawOffered: (val: boolean) => void;
  offerDrawfn: () => void;
  offerDraw: boolean;
  gameResignfn: () => void;
  drawAcceptedfn: () => void;
  drawDeclinefn: () => void;
}

const GameInfo = memo(
  ({
    // side,
    waiting,
    status,
    // socket,
    startGame,
    gameHistory,
    drawOffered,
    // setDrawOffered,
    offerDrawfn,
    offerDraw,
    gameResignfn,
    drawAcceptedfn,
    drawDeclinefn,
  }: GameInfoProps) => {
    const [selectedTimeLimit, setSelectedTimeLimit] = useState("10");
    const [selectedKey, setSelectedKey] = useState("play");
    console.log("waiting", waiting);
    console.log("gameStatue", status);
    const [isResignPopoverOpen, setIsResignPopoverOpen] = useState(false);
    useEffect(() => {
      if (status === "STARTED") {
        setSelectedKey("history");
      }
    }, [status]);

    return (
      <div className="w-[35%] md:w-11/12 lg:w-11/12 md:min-h-[30rem] lg:min-h-[30rem] h-full flex flex-col bg-[#262522] m-0 p-0 rounded-[1.6%] pb-2">
        <Tabs
          aria-label="Options"
          fullWidth={true}
          color="primary"
          selectedKey={selectedKey}
          onSelectionChange={(key) => {
            setSelectedKey(key.toString());
          }}
          classNames={{
            tabList: "bg-[#21201D]",
            tab: "h-10",
            panel: "h-full rounded-[1.6%] flex-grow",
            cursor: "w-full bg-[#262522]",
            // base: "bg-red-400",
            tabContent: "text-8 text-white",
          }}
        >
          <Tab key="play" title="Play">
            <div className="flex flex-col items-center h-full flex-grow">
              <Select
                label="Select a Time Limit"
                className="max-w-[20rem] w-full m-4"
                classNames={{
                  listbox: "bg-[#3C3B39] text-white",
                  popoverContent: "bg-[#3C3B39]",
                  // mainWrapper: "bg-[#3C3B39]",
                  // base: "bg-[#3C3B39]",[#3C3B39]
                  trigger: "bg-[#3C3B39]",
                  // innerWrapper: "bg-[#3C3B39]",
                }}
                selectedKeys={[selectedTimeLimit]}
                onSelectionChange={(e) => {
                  e.anchorKey && setSelectedTimeLimit(e.anchorKey);
                }}
              >
                {GameTimeLimit.map((timeLimit) => (
                  <SelectItem key={timeLimit.key}>{timeLimit.label}</SelectItem>
                ))}
              </Select>
              <Button
                color="primary"
                onClick={() => {
                  startGame(Number(selectedTimeLimit));
                }}
                className="max-w-[20rem] w-full bg-[#2ea44f] hover:bg-[#2c974b] text-lg font-medium"
                disabled={waiting}
                isLoading={waiting}
                spinner={
                  <svg
                    className="animate-spin h-5 w-5 text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    />
                  </svg>
                }
              >
                {waiting ? "Looking for Oponent" : "Start Game"}
              </Button>
            </div>
          </Tab>
          <Tab key="history" title="History" className="flex flex-col">
            <div
              id="game-history"
              className="flex flex-col justify-start flex-grow items-center w-full overflow-y-scroll min-h-[60%] m-0 p-0 scrollbar-hide overflow-auto"
            >
              <MoveHistory gameHistory={gameHistory} />
              {drawOffered ? (
                <div className="h-[60px] w-full rounded-t-[5%] z-10 flex justify-center items-center flex-row gap-2 bg-[#606060] bottom-0 mt-auto">
                  <span>Oponent offered a Draw</span>
                  <Button
                    startContent={<FaCheck />}
                    onClick={drawAcceptedfn}
                    className="w-auto bg-[#3f4040] hover:bg-[#353636] p-0 h-8 rounded-md"
                  >
                    Accept
                  </Button>
                  <Button
                    startContent={<FaTimes />}
                    onClick={drawDeclinefn}
                    className="w-auto bg-[#3f4040] hover:bg-[#353636] p-0 h-8 rounded-md"
                  >
                    Decline
                  </Button>
                </div>
              ) : null}
            </div>
            <div
              id="user-control"
              className="flex items-center justify-between"
            >
              <div className="flex flex-row mr-6 ml-6 gap-2">
                <Popover
                  placement="top"
                  showArrow={true}
                  isOpen={isResignPopoverOpen}
                  onOpenChange={(open) => setIsResignPopoverOpen(open)}
                  classNames={{
                    content: "bg-[#3f4040]",
                  }}
                >
                  <PopoverTrigger>
                    <Button
                      color="primary"
                      // onClick={gameResignfn}
                      radius="none"
                      className="w-30 bg-[#3f4040] hover:bg-[#353636] p-0 h-8 rounded-md"
                      startContent={<FaFlag />}
                    >
                      Resign
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 flex flex-col items-center justify-center">
                      <div className="text-sm">
                        Are you sure you want to resign
                      </div>
                      <div className="flex flex-row gap-2">
                        <Button
                          className="p-0 h-8 min-w-16 rounded-md bg-[#2ea44f] hover:bg-[#2c974b]"
                          onClick={() => {
                            gameResignfn();
                            setIsResignPopoverOpen(false);
                          }}
                        >
                          Yes
                        </Button>
                        <Button
                          className="p-0 h-8 min-w-16 rounded-md bg-[#2ea44f] hover:bg-[#2c974b]"
                          onClick={() => {
                            setIsResignPopoverOpen(false);
                          }}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  color="primary"
                  onClick={offerDrawfn}
                  radius="none"
                  disabled={offerDraw}
                  className="w-30 bg-[#3f4040] hover:bg-[#353636] p-0 h-8 rounded-md"
                  startContent={<FaHandshake size={20} />}
                >
                  Draw
                </Button>
              </div>

              <div className="flex flex-row p-0">
                <Button
                  isIconOnly
                  className="hover:bg-[#353636] p-0 w-2"
                  variant="light"
                >
                  <FaFastBackward />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  className="hover:bg-[#353636] p-0"
                >
                  <FaStepBackward />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  className="hover:bg-[#353636] p-0"
                >
                  <FaStepForward />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  className="hover:bg-[#353636] p-0"
                >
                  <FaFastForward />
                </Button>
              </div>
            </div>
          </Tab>
          <Tab key="games" title="Games">
            <p>this is history page</p>
          </Tab>
        </Tabs>
      </div>
    );
  }
);

export default GameInfo;
