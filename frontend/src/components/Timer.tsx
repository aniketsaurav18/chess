import { useEffect, useRef, useState } from "react";

interface GameTimerProps {
  time: number;
  side: string;
  turn: string;
}

const GameTimer = ({ time, side, turn }: GameTimerProps) => {
  const [clock, setClock] = useState(time);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Use useRef to avoid re-renders

  // Start/Stop timer based on whose turn it is
  useEffect(() => {
    if (side[0] === turn) {
      if (!timerRef.current) {
        startTimer();
      }
    } else {
      stopTimer();
    }

    return () => {
      stopTimer(); // Clean up the timer on turn change or unmount
    };
  }, [turn]);

  // Sync clock with the initial time only when side starts its turn
  useEffect(() => {
    if (side[0] === turn) {
      setClock(time);
    }
  }, [time, side, turn]);

  const startTimer = () => {
    stopTimer(); // Stop any existing timer first
    timerRef.current = setInterval(() => {
      setClock((prevClock) => Math.max(prevClock - 1000, 0)); // Decrease every second
    }, 1000); // Lower the frequency to update every second
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Convert time from milliseconds to minutes and seconds
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
