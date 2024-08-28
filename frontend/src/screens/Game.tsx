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
import GameModal from "../components/GameOverModal";

// const WS_URL = "ws://localhost:8080";

// interface GameMetadata {
//   player1: string;
//   player2: string;
// }

export function Game() {
  const socket = useSocket();
  const user = useUser();
  const {
    // gameId,
    gameState,
    gameStatus,
    gameResult,
    isGameOver,
    player1timer,
    player2timer,
    optionSquares,
    makeMove,
    setDrawOffered,
    offerDraw,
    gameResign,
    drawOffered,
    gameHistory,
    chessboardRef,
    side,
    waiting,
    onSquareClick,
    startGame,
    offerDrawfn,
    drawAcceptedfn,
    drawDeclinedfn,
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
    const mainEle = document.getElementById("main") as HTMLElement;
    mainEle.style.marginLeft = `${
      windowDimensions.width < viewportWidthBreakpoint ? 0 : sidebarWidth
    }px`;
  }, [windowDimensions.width]);

  const chessboardDivRef = useRef<any>();
  useEffect(() => {
    const chessboardEle = chessboardDivRef.current;
    if (!chessboardEle) return;

    const updateBoardWidth = () => {
      const boardH = chessboardEle.clientHeight;
      const boardW = chessboardEle.clientWidth;
      // console.log("boardH", boardH, "boardW", boardW);
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
    const timeLeftMs = timeConsumed;
    const timeINMinutes = Math.floor(timeLeftMs / 60000);
    const timeInSeconds = Math.floor((timeLeftMs % 60000) / 1000);
    return (
      <div className="flex justify-center items-center bg-gray-500 w-[6rem] h-5/6 text-[1.5rem] font-bold text-white">
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
      <main
        id="main"
        className="flex flex-row justify-start items-center flex-grow overflow-auto bg-[#302e2b] h-screen m-0 p-4 md:p-1 box-border lg:h-auto lg:flex-col lg:relative lg:w-full lg:gap-5"
      >
        <div className="w-[60%] h-full flex flex-col items-center justify-center m-0 p-0 lg:w-full lg:h-[80vh] md:h-[40rem] sm:h-[30rem]">
          <div
            className="w-full h-[2.5rem] flex flex-row justify-between items-center md:w-full"
            style={{ width: boardWidth }}
          >
            <div className="flex flex-row justify-start items-center w-[55%] h-full text-[1.2rem] font-bold text-white mr-[5rem] sm:text-[2rem] sm:h-[2rem]">
              <img
                className="h-full"
                src={defaultUserImage}
                alt={defaultUserImage}
              />
              <span className="ml-[0.5rem] text-base">Username</span>
            </div>
            {side === "white"
              ? gameTimer(player2timer)
              : gameTimer(player1timer)}
          </div>
          <div
            className="w-full flex-grow my-2 p-0 grid place-items-center lg:w-full lg:h-full"
            ref={chessboardDivRef}
          >
            <div className="relative">
              <GameModal isGameOverModal={isGameOver} message={gameResult} />
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
          <div
            className="player-metadata w-full h-[2.5rem] flex flex-row justify-between items-center md:w-full"
            style={{ width: boardWidth }}
          >
            <div className="flex flex-row justify-start items-center w-[55%] h-full text-[1.2rem] font-bold text-white mr-[5rem] sm:text-[2rem] sm:h-[2rem]">
              <img
                className="h-full"
                src={defaultUserImage}
                alt={defaultUserImage}
              />
              <span className="ml-[0.5rem] text-base">Username</span>
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
          gameResignfn={gameResign}
          drawAcceptedfn={drawAcceptedfn}
          drawDeclinefn={drawDeclinedfn}
        />
      </main>
    </>
  );
}
