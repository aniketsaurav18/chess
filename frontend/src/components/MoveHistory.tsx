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

  return (
    <div className="history-moves-table">
      {moveHistory.length > 0
        ? moveHistory.map((movePair, index) => (
            <div
              key={index}
              className="history-move "
              style={{
                backgroundColor: index % 2 === 0 ? "#2A2926" : "#262522",
              }}
            >
              <span className="move-number">{index + 1}.</span>
              {movePair[0] && (
                <div
                  id="white-move"
                  className="is2d flex justify-start flex-row items-center mr-8 ml-8 w-24"
                >
                  <span
                    className={`${getChessPiece(
                      movePair[0].piece,
                      movePair[0].color
                    )} h-8 max-w-4`}
                  />
                  <span>{movePair[0].san}</span>
                </div>
              )}
              {movePair[1] && (
                <div
                  id="black-move"
                  className="is2d flex justify-start flex-row items-center mr-8 ml-8 w-24"
                >
                  <span
                    className={`${getChessPiece(
                      movePair[1].piece,
                      movePair[1].color
                    )} h-8 max-w-1`}
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
