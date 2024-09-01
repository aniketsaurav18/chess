import "../../public/cardinal.css";

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

interface MoveHistoryProp {
  moveHistory: Move[][];
}

const MoveHistory = ({ moveHistory }: MoveHistoryProp) => {
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

  // const movehiss = [
  //   [
  //     { piece: "q", color: "b", san: "a4" },
  //     { piece: "k", color: "w", san: "r5" },
  //   ],
  // ];

  return (
    <div className="flex flex-col items-center justify-start w-full h-full overflow-y-auto rounded-lg shadow-lg">
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
