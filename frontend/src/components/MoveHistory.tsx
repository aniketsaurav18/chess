import { useEffect, useRef, useState } from "react";
import "../../public/cardinal.css";
import { Move } from "../types";

interface MoveHistoryProps {
  gameHistory: Move[];
}

const MoveHistory = ({ gameHistory }: MoveHistoryProps) => {
  const [moveHistory, setMoveHistory] = useState<Move[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const getChessPiece = (piece: string, color: string): string => {
    switch (piece + color) {
      case "bb":
        return "bishop black";
      case "bw":
        return "bishop white";
      case "kw":
        return "king white";
      case "kb":
        return "king black";
      case "qw":
        return "queen white ";
      case "qb":
        return "queen black";
      case "rw":
        return "rook white";
      case "rb":
        return "rook black";
      case "pb":
        return "pawn black";
      case "pw":
        return "pawn white";
      case "nw":
        return "knight white";
      case "nb":
        return "knight black";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (gameHistory.length === 0) return;

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

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [moveHistory]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-start w-full h-[90%] flex-grow overflow-y-scroll rounded-lg shadow-lg"
    >
      {moveHistory.length > 0 ? (
        moveHistory.map((movePair, index) => (
          <div
            key={index}
            className={`flex flex-row items-center w-full py-2 px-4 text-sm ${
              index % 2 === 0 ? "bg-[#2a2926]" : "bg-[#262522]"
            }`}
          >
            <span className="text-white font-semibold w-6">{index + 1}.</span>
            {movePair[0] && (
              <div
                id="white-move"
                className="is2d flex flex-row items-center justify-center gap-2 w-24"
              >
                <span
                  className={`${getChessPiece(
                    movePair[0].piece,
                    movePair[0].color
                  )} w-5 h-5 bg-center bg-no-repeat bg-contain`}
                />
                <span className="text-white">{movePair[0].san}</span>
              </div>
            )}
            {movePair[1] && (
              <div
                id="black-move"
                className="is2d flex flex-row items-center justify-center gap-2 w-24"
              >
                <span
                  className={`${getChessPiece(
                    movePair[1].piece,
                    movePair[1].color
                  )} w-5 h-5 bg-center bg-no-repeat bg-contain`}
                />
                <span className="text-white">{movePair[1].san}</span>
              </div>
            )}
          </div>
        ))
      ) : (
        <span className="text-gray-400 py-4">No moves yet</span>
      )}
    </div>
  );
};

export default MoveHistory;
