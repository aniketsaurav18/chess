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
    <div className="flex flex-col items-center justify-start w-full h-full m-0 p-0">
      {moveHistory.length > 0
        ? moveHistory.map((movePair, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-start w-full h-8 text-md text-white my-0.5"
              style={{
                backgroundColor: index % 2 === 0 ? "#2A2926" : "#262522",
              }}
            >
              <span className="move-number">{index + 1}.</span>
              {movePair[0] && (
                <div
                  id="white-move"
                  className="is2d flex justify-start flex-row gap-1 items-center mr-8 ml-8 w-24 h-full"
                >
                  <span
                    className={`${getChessPiece(
                      movePair[0].piece,
                      movePair[0].color
                    )} h-full w-5 bg-size bg-contain bg-center bg-no-repeat`}
                  />
                  <span>{movePair[0].san}</span>
                </div>
              )}
              {movePair[1] && (
                <div
                  id="black-move"
                  className="is2d flex justify-start flex-row gap-1 items-center mr-8 ml-8 w-24 h-full"
                >
                  <span
                    className={`${getChessPiece(
                      movePair[1].piece,
                      movePair[1].color
                    )} h-full w-5 bg-size bg-contain bg-center bg-no-repeat`}
                  />
                  <span>{movePair[1].san}</span>
                </div>
              )}
            </div>
          ))
        : "No moves yet"}
    </div>
  );
};

export default MoveHistory;
