import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game{
    public player1: WebSocket | null;
    public player2: WebSocket | null;
    private board: Chess;
    private startTime: Date;
    
    constructor(p1: WebSocket | null, p2: WebSocket| null){
        this.player1 = p1;
        this.player2 = p2;
        this.board = new Chess();
        this.startTime = new Date();
        console.log("game created, message sending");
        this.player1?.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white",
            }
        }))
        this.player2?.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black",
            }
        }))
        console.log("send messages init_game");
    }

    makeMove(socket: WebSocket, move: {from: string, to: string}){
        if((this.board.turn() === "w") && (socket !== this.player1)){
            return;
        }
        if((this.board.turn() === "b") && (socket !== this.player2)){
            return;
        }
        try{
            this.board.move(move);
        } catch(e){
            console.log(e);
            return;
        }
        if(this.board.isGameOver()){
            this.player1?.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "white":"black"
                }
            }))
            this.player2?.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "white":"black"
                }
            }))
        }
        console.log(this.board.turn());
        if(this.board.turn() === "b"){
            this.player2?.send(JSON.stringify({
                type: MOVE,
                payload: move,
            }))
        }else{
            this.player1?.send(JSON.stringify({
                type: MOVE,
                payload:move,
            }))
        }
    }

}