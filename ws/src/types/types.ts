import { Move } from "chess.js";
import {
  DRAW_OFFERED,
  GAME_DRAW,
  GAME_OVER,
  INIT_GAME,
  MOVE,
  OFFER_DRAW,
  RESIGN,
  TIMEOUT,
} from "../messages";

export type Result = "white" | "black" | "draw";

export interface InitGamePayloadProducer {
  t: string;
  d: {
    gameId: string;
    whitePlayerId: string;
    blackPlayerId: string;
    startTime: Date;
    timeControl: number;
    currentFen: string;
  };
}

export type GameOverType =
  | "draw"
  | "white_timeout"
  | "black_timeout"
  | "white_resign"
  | "black_resign"
  | "white_checkmate" //white gets checkmated by black
  | "black_checkmate" //black gets checkmated by white
  | "white_stalemate"
  | "black_stalemate"
  | "threefold_repetition"
  | "insufficient_material"
  | "fifty_move_rule"
  | "unknown";

export type GameOverMessage = {
  [key in GameOverType]: string;
};

export const gameOverMessages: GameOverMessage = {
  draw: "Draw.",
  white_timeout: "Black wins by timeout.",
  black_timeout: "White wins by timeout.",
  white_resign: "Black wins by resignation.",
  black_resign: "White wins by resignation.",
  white_checkmate: "Black wins by checkmate.",
  black_checkmate: "White wins by checkmate.",
  white_stalemate: "Stalemate. Draw.",
  black_stalemate: "Stalemate. Draw.",
  threefold_repetition: "Draw by repetition.",
  insufficient_material: "Draw by material.",
  fifty_move_rule: "Draw by 50-move rule.",
  unknown: "Game ended.",
};

export type GameStatus = "active" | "over";
export interface GameMove extends Move {
  time: number;
  moveNumber: number;
}

export interface InitGamePayload {
  t: typeof INIT_GAME;
  d: {
    id: string;
    color: "white" | "black";
    clock: {
      w: number;
      b: number;
    };
  };
}

export interface MovePayload {
  t: typeof MOVE;
  d: {
    san: string;
    f: string;
    t: number;
    c: string;
    ply: number;
    clock: {
      w: number;
      b: number;
    };
  };
}

//draw offer sent to a player.
export interface DrawOfferPayload {
  t: typeof DRAW_OFFERED;
  d: {
    color: "black" | "white"; //who offered the draw
  };
}

export interface GameDrawPayload {
  t: typeof GAME_DRAW;
  d: {
    winner: "draw";
    clock: {
      w: number;
      b: number;
    };
  };
}

export interface TimeoutPayload {
  t: typeof TIMEOUT;
  d: {
    winner: "white" | "black";
    clock: {
      w: number;
      b: number;
    };
  };
}

export interface ResignPayload {
  t: typeof RESIGN;
  d: {
    winner: "white" | "black";
    clock: {
      w: number;
      b: number;
    };
  };
}

export interface GameOverPayload {
  t: typeof GAME_OVER;
  d: {
    type: GameOverType;
    msg: string;
    winner: "draw" | "white" | "black";
    clock: {
      w: number;
      b: number;
    };
  };
}

export type GameMessagePayload =
  | InitGamePayload
  | MovePayload
  | DrawOfferPayload
  | GameDrawPayload
  | GameOverPayload
  | TimeoutPayload
  | ResignPayload;
