import "./Game.css";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import useWindowDimensions from "../hooks/useWindowDimensions";
import useUser from "../hooks/useUser";
import { Chessboard } from "react-chessboard";
import defaultUserImage from "../assets/default-user.jpg";
import GameInfo from "../components/GameInfo";
import Sidebar from "../components/Sidebar";
import { viewportWidthBreakpoint } from "../utils/config";
import { useChessGame } from "../hooks/useGame";

const GAME_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes

// const WS_URL = "ws://localhost:8080";

// interface GameMetadata {
//   player1: string;
//   player2: string;
// }

export function Game() {
  const socket = useSocket();
  const user = useUser();
  const {
    gameState,
    gameStatus,
    player1timer,
    player2timer,
    optionSquares,
    moveFrom,
    makeMove,
    setDrawOffered,
    offerDraw,
    drawOffered,
    gameHistory,
    chessboardRef,
    side,
    waiting,
    onSquareClick,
    startGame,
    offerDrawfn,
  } = useChessGame(user);
  // const [user, setUser] = useState<User | null>(null);
  const windowDimensions = useWindowDimensions();
  const [boardWidth, setBoardWidth] = useState<number>(500);

  useEffect(() => {
    console.log("user details", user);
  }, []);

  useEffect(() => {
    if (windowDimensions.width === null || windowDimensions.height === null)
      return;
    const sidebarEle = document.getElementsByClassName(
      "sidebar"
    )[0] as HTMLElement;
    const sidebarWidth = sidebarEle.clientWidth;
    const mainEle = document.getElementsByClassName("main")[0] as HTMLElement;
    mainEle.style.marginLeft = `${
      windowDimensions.width < viewportWidthBreakpoint ? 0 : sidebarWidth
    }px`;
    // const chessboardEle = document.getElementsByClassName(
    //   "chessboard"
    // )[0] as HTMLElement;
    // const boardH = chessboardEle.clientHeight;
    // const boardW = chessboardEle.clientWidth;
    // console.log("boardH", boardH, "boardW", boardW);
    // setBoardWidth(boardH < boardW ? boardH : boardW);
  }, [windowDimensions.width]);
  const chessboardDivRef = useRef<any>();

  useEffect(() => {
    const chessboardEle = chessboardDivRef.current;
    if (!chessboardEle) return;

    const updateBoardWidth = () => {
      const boardH = chessboardEle.clientHeight;
      const boardW = chessboardEle.clientWidth;
      console.log("boardH", boardH, "boardW", boardW);
      setBoardWidth(boardH < boardW ? boardH : boardW);
    };
    // Create a ResizeObserver to watch the chessboard element
    const resizeObserver = new ResizeObserver(updateBoardWidth);
    resizeObserver.observe(chessboardEle);

    // Initial update to set the board width
    updateBoardWidth();

    return () => resizeObserver.disconnect();
  }, []);

  const gameTimer = (timeConsumed: number) => {
    const timeLeftMs = GAME_TIME_LIMIT - timeConsumed;
    const timeINMinutes = Math.floor(timeLeftMs / 60000);
    const timeInSeconds = Math.floor((timeLeftMs % 60000) / 1000);
    return (
      <div className="game-timer">
        {timeINMinutes < 10 ? "0" : ""}
        {timeINMinutes}:{timeInSeconds < 10 ? "0" : ""}
        {timeInSeconds}
      </div>
    );
  };

  return (
    <>
      <Sidebar
        windowSize={windowDimensions.width ? windowDimensions.width : 1251}
        user={user}
      />
      <main className="main">
        <div className="game-board">
          <div className="player-metadata" style={{ width: boardWidth }}>
            <div className="player-profile">
              <img src={defaultUserImage} alt={defaultUserImage} />
              <span>Username</span>
            </div>
            {side === "white"
              ? gameTimer(player2timer)
              : gameTimer(player1timer)}
          </div>
          <div className="chessboard" ref={chessboardDivRef}>
            <div className="chessboard-container">
              <Chessboard
                id="PlayVsPlay"
                boardWidth={boardWidth}
                position={gameState}
                onPieceDrop={makeMove}
                customBoardStyle={{
                  borderRadius: "4px",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
                }}
                ref={chessboardRef}
                boardOrientation={side}
                areArrowsAllowed={true}
                arePremovesAllowed={true}
                onSquareClick={onSquareClick}
                customSquareStyles={{
                  ...optionSquares,
                }}
              />
            </div>
          </div>
          <div className="player-metadata" style={{ width: boardWidth }}>
            <div className="player-profile">
              <img src={defaultUserImage} alt={defaultUserImage} />
              <span>Username</span>
            </div>
            {side === "white"
              ? gameTimer(player1timer)
              : gameTimer(player2timer)}
          </div>
        </div>
        <GameInfo
          side={side}
          socket={socket}
          startGame={startGame}
          status={gameStatus}
          waiting={waiting}
          gameHistory={gameHistory}
          drawOffered={drawOffered}
          setDrawOffered={setDrawOffered}
          offerDrawfn={offerDrawfn}
          offerDraw={offerDraw}
        />
      </main>
    </>
  );
}
