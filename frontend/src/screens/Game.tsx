import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import useWindowDimensions from "../hooks/useWindowDimensions";
import useUser from "../hooks/useUser";
import defaultUserImage from "../assets/default-user.jpg";
import GameInfo from "../components/GameInfo";
import Sidebar from "../components/Sidebar";
import { viewportWidthBreakpoint } from "../utils/config";
import { useChessGame } from "../hooks/useGame";
import GameModal from "../components/GameOverModal";
import ChessBoard from "../components/ChessBoard";
import GameTimer from "../components/Timer";

export default function Game() {
  const socket = useSocket();
  const user = useUser();
  const {
    // gameId,
    gameState,
    gameStatus,
    turn,
    gameResult,
    isGameOver,
    player1clock,
    player2clock,
    winner,
    makeMove,
    setDrawOffered,
    offerDraw,
    gameResign,
    drawOffered,
    gameHistory,
    chessboardRef,
    side,
    waiting,
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
    const sidebarEle = document.getElementById("sidebar") as HTMLElement;
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

    const resizeObserver = new ResizeObserver(updateBoardWidth);
    resizeObserver.observe(chessboardEle);

    updateBoardWidth();

    return () => resizeObserver.disconnect();
  }, []);

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
              <span className="ml-[0.5rem] text-base">Oponent</span>
            </div>
            {side === "white" ? (
              <GameTimer
                time={player2clock}
                side="b"
                turn={turn}
                gameStatus={gameStatus}
              />
            ) : (
              <GameTimer
                time={player1clock}
                side="w"
                turn={turn}
                gameStatus={gameStatus}
              />
            )}
          </div>
          <div
            className="w-full flex-grow my-2 p-0 grid place-items-center lg:w-full lg:h-full"
            ref={chessboardDivRef}
          >
            <div className="relative">
              <GameModal
                isGameOverModal={isGameOver}
                message={gameResult}
                winner={winner}
                startGameFn={startGame}
              />
              <ChessBoard
                makeMove={makeMove}
                boardState={gameState}
                boardWidth={boardWidth}
                chessBoardref={chessboardRef}
                gameStatus={gameStatus}
                side={side}
                key="game"
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
              <span className="ml-[0.5rem] text-base">
                {user.username !== "" ? user.username : "Guest"}
              </span>
            </div>
            {side === "white" ? (
              <GameTimer
                time={player1clock}
                side="w"
                turn={turn}
                gameStatus={gameStatus}
              />
            ) : (
              <GameTimer
                time={player2clock}
                side="b"
                turn={turn}
                gameStatus={gameStatus}
              />
            )}
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
