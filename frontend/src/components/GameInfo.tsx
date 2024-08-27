import { useEffect, useState } from "react";
import "./GameInfo.css";
import MoveHistory from "./MoveHistory";
import { DRAW_DECLINED } from "../utils/messages";
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
} from "react-icons/fa";

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
}

const GameInfo = ({
  side,
  waiting,
  status,
  socket,
  startGame,
  gameHistory,
  drawOffered,
  setDrawOffered,
  offerDrawfn,
  offerDraw,
  gameResignfn,
  drawAcceptedfn,
}: GameInfoProps) => {
  const [moveHistory, setMoveHistory] = useState<Move[][]>([]);
  const [selectedTimeLimit, setSelectedTimeLimit] = useState("10");

  useEffect(() => {
    console.log(drawOffered);
  }, [drawOffered]);

  useEffect(() => {
    if (gameHistory.length === 0) return;
    console.log(gameHistory);
    // console.log(gameHistory[0].after);
    // console.log(gameHistory[0].before);

    const history: Move[][] = [[]];
    for (let i = 0; i < gameHistory.length; i++) {
      if (i % 2 === 0) {
        if (history[history.length - 1].length === 2) {
          history.push([gameHistory[i]]);
        } else {
          history[history.length - 1].push(gameHistory[i]);
        }
      } else {
        history[history.length - 1].push(gameHistory[i]);
      }
    }
    setMoveHistory(history);
  }, [gameHistory]);

  const drawDeclined = () => {
    if (status !== "STARTED" || !socket) {
      return;
    }
    socket.send(JSON.stringify({ t: DRAW_DECLINED, d: { color: side[0] } }));
    setDrawOffered(false);
  };

  return (
    <div className="w-[35%] md:w-11/12 lg:w-11/12 md:min-h-[30rem] lg:min-h-[30rem] h-full flex flex-col bg-[#262522] m-0 p-0 rounded-[1.6%] pb-2">
      <Tabs
        aria-label="Options"
        fullWidth={true}
        color="primary"
        classNames={{
          tabList: "bg-[#21201D]",
          tab: "h-10",
          panel: "h-full rounded-[1.6%]",
          cursor: "w-full bg-[#262522]",
          // base: "bg-red-400",
          tabContent: "text-8 text-white",
        }}
      >
        <Tab key="play" title="Play">
          <div className="flex flex-col items-center">
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
            >
              Start
            </Button>
          </div>
        </Tab>
        <Tab key="history" title="History">
          <div
            id="game-history"
            className="flex flex-col justify-start items-center w-full overflow-y-scroll min-h-[60%] h-[80%] m-0 p-0"
          >
            <MoveHistory moveHistory={moveHistory} />
            {drawOffered ? (
              <div className="draw-offered-dialogue">
                <span>Oponent offered a Draw</span>
                <button className="draw-offered-btn" onClick={drawAcceptedfn}>
                  Accept
                </button>
                <button className="draw-offered-btn" onClick={drawDeclined}>
                  Decline
                </button>
              </div>
            ) : null}
          </div>
          <div id="user-control" className="flex items-center justify-between">
            <div className="flex flex-row mr-6 ml-6 gap-2">
              <Button
                color="primary"
                onClick={gameResignfn}
                radius="none"
                className="w-30 bg-[#3f4040] hover:bg-[#353636] p-0 h-8 rounded-md"
                startContent={<FaFlag />}
              >
                Resign
              </Button>
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
};

export default GameInfo;
