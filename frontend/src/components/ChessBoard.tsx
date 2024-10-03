import { Chess, Square } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

const ChessBoard = ({
  boardState,
  side,
  gameStatus,
  makeMove,
  boardWidth,
  chessBoardref,
}: {
  boardState: string;
  side: BoardOrientation;
  gameStatus: string;
  makeMove: (from: Square, to: Square) => boolean;
  boardWidth: number;
  chessBoardref: any;
}) => {
  const [game, setGame] = useState(new Chess(boardState));
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<any>({});

  useEffect(() => {
    setOptionSquares({});
    setMoveFrom(null);
    setGame(new Chess(boardState));
  }, [boardState]);

  const makeMoveWrapper = (from: Square, to: Square): boolean => {
    setMoveFrom(null);
    setOptionSquares({});
    if (makeMove(from, to)) {
      return true;
    } else {
      return false;
    }
  };

  function getMoveOptions(square: Square) {
    if (game.turn() !== side[0] && gameStatus !== "STARTED") return;
    if (game.get(square) === null) {
      setMoveFrom(null);
      setOptionSquares({});
      return;
    }
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      return;
    }

    const newSquares: any = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)?.color !== game.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
  }

  const onSquareClick = (square: Square) => {
    if (game.turn() !== side[0]) return;
    if (!moveFrom) {
      if (game.get(square)?.color !== game.turn()) return;
      getMoveOptions(square);
      setMoveFrom(square);
    } else {
      if (!Object.keys(optionSquares).includes(square)) {
        getMoveOptions(square);
        setMoveFrom(square);
        return;
      }
      if (makeMove(moveFrom, square)) {
        setMoveFrom(null);
        setOptionSquares({});
      }
    }
  };
  return (
    <Chessboard
      id="PlayVsPlay"
      boardWidth={boardWidth}
      position={boardState}
      onPieceDrop={makeMoveWrapper}
      customBoardStyle={{
        borderRadius: "4px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
      }}
      ref={chessBoardref}
      boardOrientation={side}
      areArrowsAllowed={true}
      arePremovesAllowed={true}
      onSquareClick={onSquareClick}
      customSquareStyles={{
        ...optionSquares,
      }}
    />
  );
};

export default ChessBoard;
