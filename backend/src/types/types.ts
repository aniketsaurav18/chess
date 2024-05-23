import { Move } from "chess.js";

export interface GameMove extends Move {
  time: number;
}
