import { WebSocket } from "ws";
import {Game} from "./game";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager{
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor(){
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket: WebSocket){
        this.users.push(socket);
        this.handleInit(socket);
    }
    removeUser(socket: WebSocket){
        //logic to remove user;
        this.users.filter(user => user !== socket);
    }
    private handleInit(socket: WebSocket){
        try{
            socket.on("message", data => {
                const msg = JSON.parse(data.toString());
                console.log(msg);
                if(msg.type === INIT_GAME && this.pendingUser !== null){
                    // if(this.pendingUser === null){
                    //     throw "INIT_GAME error: No pending user.";
                    // }
                    console.log("init game" + msg.type);
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }else if(msg.type === INIT_GAME){
                    console.log("user added to pending user");
                    this.pendingUser = socket;
                }else if(msg.type === MOVE){
                    console.log("move1" + msg.payload.move);
                    const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                    if(game){
                        game.makeMove(socket, msg.payload.move);
                    }else{
                        socket.send(JSON.stringify({
                            type: "error",
                            payload: {
                                message: "Game not found"
                            }
                        }));
                    }
                }
            })
        }catch(e:any){
            console.log(e.message);
        }
    }

}