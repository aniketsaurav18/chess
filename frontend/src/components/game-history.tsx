"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import useUser from "../hooks/useUser";
import { format } from "date-fns";

interface Player {
  username: string;
  avatar_url: string | null;
}

interface Game {
  id: string;
  whitePlayer: Player;
  blackPlayer: Player | null;
  result: "white" | "black" | "draw";
  time_control: number;
  moves: string | null;
  start_at: string;
  end_at: string | null;
}

export default function GameHistory() {
  const [userDetails, setUserDetails] = useState<any>({});
  const [gameHistory, setGameHistory] = useState<Game[]>([]);
  const user = useUser();

  useEffect(() => {
    if (user.type !== "user") {
      return;
    }

    async function fetchUserDetails() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!res.ok) {
          console.error(`Failed to fetch user details: ${res.status}`);
          return;
        }
        const data = await res.json();
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    async function fetchGames() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/game/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!res.ok) {
          console.error(`Failed to fetch games: ${res.status}`);
          return;
        }
        const data = await res.json();
        setGameHistory(data.games);
      } catch (error) {
        console.error("Error fetching game history:", error);
      }
    }

    fetchUserDetails();
    fetchGames();
  }, [user]);

  return (
    <div className="text-gray-200 min-h-screen p-6 min-w-[1000px] lg:min-w-[1000px] md:w-auto">
      {/* Profile section */}
      <div className="border-b border-gray-700 pb-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 rounded overflow-hidden bg-gray-800 flex items-center justify-center">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-xl font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-start items-start">
            <h1 className="text-2xl font-bold mb-1">{user?.username}</h1>
            <div className="flex gap-4 mt-2 text-sm text-gray-400">
              {userDetails.createdAt && (
                <div>
                  Joined: {format(new Date(userDetails.createdAt), "MMM yyyy")}
                </div>
              )}
              {userDetails.gameCount !== undefined && (
                <div>{userDetails.gameCount} Games Played</div>
              )}
              {/* You can add more profile information here if available in userDetails */}
            </div>
          </div>
        </div>
      </div>

      {/* Game history section */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Game History{" "}
          <span className="text-gray-400 text-lg">({gameHistory.length})</span>
        </h2>

        <div>
          {/* Headers */}
          <div className="grid grid-cols-6 py-3 border-b border-gray-700 text-gray-400 text-sm">
            <div className="col-span-2 pl-6">Players</div>
            <div className="text-center">Result</div>
            <div className="text-center">Time Control</div>
            <div className="text-center">Date</div>
            <div className="text-center">Details</div>
          </div>

          {/* Game rows */}
          {gameHistory.map((game) => (
            <div
              key={game.id}
              className="grid grid-cols-6 py-4 border-b border-gray-700 items-center hover:bg-[#252525]"
            >
              {/* Players */}
              <div className="col-span-2 flex items-center pl-6">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-white mr-2"></div>
                    <span className="font-medium">
                      {game.whitePlayer?.username || "Guest"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-black border border-white mr-2"></div>
                    <span className="font-medium">
                      {game.blackPlayer?.username || "Guest"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="text-center">
                {game.result === "white" && (
                  <span className="text-green-500 font-semibold">Won</span>
                )}
                {game.result === "black" && (
                  <span className="text-red-500 font-semibold">Lost</span>
                )}
                {game.result === "draw" && (
                  <span className="text-gray-400 font-semibold">Draw</span>
                )}
              </div>

              {/* Time Control */}
              <div className="text-center">
                {game.time_control}{" "}
                {game.time_control > 1 ? "minutes" : "minute"}
              </div>

              {/* Date */}
              <div className="text-center">
                {format(new Date(game.start_at), "MMM dd, yyyy")}
              </div>

              {/* Details */}
              <div className="text-center">
                <Clock
                  className="text-gray-400 hover:text-white cursor-pointer mx-auto"
                  size={20}
                />
              </div>
            </div>
          ))}

          {gameHistory.length === 0 && (
            <div className="py-6 text-center text-gray-500">
              No game history available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
