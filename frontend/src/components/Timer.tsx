import { PieceColor } from "chess.js";
import { useEffect, useRef, useState } from "react";

interface GameTimerProps {
  time: number;
  side: PieceColor;
  turn: PieceColor;
  gameStatus: GameStatus;
}

const GameTimer = ({ time, side, turn, gameStatus }: GameTimerProps) => {
  const [clock, setClock] = useState<number>(time);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // useRef to avoid re-renders

  useEffect(() => {
    // console.log("timer", turn, side, gameStatus);
    setClock(time);
    if (side === turn && gameStatus === "STARTED") {
      if (!timerRef.current) {
        startTimer();
      }
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [turn, gameStatus, side, time]);

  useEffect(() => {
    setClock(time);
  }, [time, side, turn]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setClock((prevClock) => Math.max(prevClock - 1000, 0));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const timeLeftMs = clock;
  const timeInMinutes = Math.floor(timeLeftMs / 60000);
  const timeInSeconds = Math.floor((timeLeftMs % 60000) / 1000);

  return (
    <div className="flex justify-center items-center bg-gray-500 w-[6rem] h-5/6 text-[1.5rem] font-bold text-white">
      {timeInMinutes < 10 ? "0" : ""}
      {timeInMinutes}:{timeInSeconds < 10 ? "0" : ""}
      {timeInSeconds}
    </div>
  );
};

export default GameTimer;
