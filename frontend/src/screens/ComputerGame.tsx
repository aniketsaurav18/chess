import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import useEngine from "../hooks/useEngine";
import useWindowDimensions from "../hooks/useWindowDimensions";
import useUser from "../hooks/useUser";
// import defaultUserImage from "../assets/default-user.jpg";
// import GameInfo from "../components/GameInfo";
import Sidebar from "../components/Sidebar";
import { viewportWidthBreakpoint } from "../utils/config";
import EngineInfo from "../components/EngineInfo";
import GameModal from "../components/GameOverModal";
// import GameModal from "../components/GameOverModal";

const ComputerPlay = () => {
  const windowDimensions = useWindowDimensions();
  const user = useUser();
  const [boardWidth, setBoardWidth] = useState<number>(500);
  const [modal, setModal] = useState(false);
  // const [command, setCommand] = useState("");
  const {
    // worker,
    // progress,
    gameStatus,
    gameHistory,
    downloadProgress,
    side,
    boardState,
    engineReady,
    setSide,
    initializeWorker,
    // sendCommand,
    makeMove,
    setEngineConfiguration,
  } = useEngine();

  useEffect(() => {
    if (gameStatus === "OVER") {
      setModal(true);
    }
  }, [gameStatus]);

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
    // Create a ResizeObserver to watch the chessboard element
    const resizeObserver = new ResizeObserver(updateBoardWidth);
    resizeObserver.observe(chessboardEle);

    // Initial update to set the board width
    updateBoardWidth();

    return () => resizeObserver.disconnect();
  }, []);

  const handleClose = () => {
    setModal(false);
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
            className="w-full flex-grow my-2 p-0 grid place-items-center lg:w-full lg:h-full"
            ref={chessboardDivRef}
          >
            <div className="relative">
              <GameModal
                isGameOverModal={modal}
                message={"Game Over"}
                handleClose={handleClose}
              />
              <Chessboard
                id="PlayVsPlay"
                boardWidth={boardWidth}
                position={boardState}
                onPieceDrop={makeMove}
                customBoardStyle={{
                  borderRadius: "4px",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
                }}
                // ref={chessboardRef}
                boardOrientation={side}
                areArrowsAllowed={true}
                arePremovesAllowed={true}
                // onSquareClick={onSquareClick}
                // customSquareStyles={{
                //   ...optionSquares,
                // }}
              />
            </div>
          </div>
        </div>
        <EngineInfo
          initializeWorker={initializeWorker}
          setEngineConfiguration={setEngineConfiguration}
          downloadProgress={downloadProgress}
          setSide={setSide}
          gameHistory={gameHistory}
          engineStatus={engineReady}
        />
        {/* <GameInfo
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
        /> */}
      </main>
    </>
  );
};

export default ComputerPlay;
