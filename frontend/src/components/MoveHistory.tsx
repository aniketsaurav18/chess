import bb from "../assets/chess-pieces/bb.svg";
import bw from "../assets/chess-pieces/bw.svg";
import kw from "../assets/chess-pieces/kw.svg";
import kb from "../assets/chess-pieces/kb.svg";
import qw from "../assets/chess-pieces/qw.svg";
import qb from "../assets/chess-pieces/qb.svg";
import rw from "../assets/chess-pieces/rw.svg";
import rb from "../assets/chess-pieces/rb.svg";
import pb from "../assets/chess-pieces/pb.svg";
import pw from "../assets/chess-pieces/pw.svg";
import nw from "../assets/chess-pieces/nw.svg";
import nb from "../assets/chess-pieces/nb.svg";

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
  const getChessPiece = (piece: string, color: string) => {
    switch (piece + color) {
      case "bb":
        return bb;
      case "bw":
        return bw;
      case "kw":
        return kw;
      case "kb":
        return kb;
      case "qw":
        return qw;
      case "qb":
        return qb;
      case "rw":
        return rw;
      case "rb":
        return rb;
      case "pb":
        return pb;
      case "pw":
        return pw;
      case "nw":
        return nw;
      case "nb":
        return nb;
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
              className="history-move"
              style={{
                backgroundColor: index % 2 === 0 ? "#2A2926" : "#262522",
              }}
            >
              <span className="move-number">{index + 1}.</span>
              {movePair[0] && (
                <div className="white-move">
                  <img
                    src={getChessPiece(movePair[0].piece, movePair[0].color)}
                    alt={`${movePair[0].color} ${movePair[0].piece}`}
                  />
                  {movePair[0].san}
                </div>
              )}
              {movePair[1] && (
                <div className="black-move">
                  <img
                    src={getChessPiece(movePair[1].piece, movePair[1].color)}
                    alt={`${movePair[1].color} ${movePair[1].piece}`}
                  />
                  {movePair[1].san}
                </div>
              )}
            </div>
          ))
        : "No moves yet"}
    </div>
  );
};

export default MoveHistory;
