"use client";

import { useState } from "react";
import { Clock, Download, History } from "lucide-react";

export default function GameHistory() {
  const [activeTab, setActiveTab] = useState("recent");

  // Sample game history data
  const games = [
    {
      id: 1,
      player1: { name: "aniketsaurav", rating: 1396, country: "in" },
      player2: { name: "chris_izur", rating: 1421, country: "br" },
      result: "0-1",
      accuracy: "Review",
      moves: 11,
      date: "5/2/2025",
    },
    {
      id: 2,
      player1: { name: "R7_Knights", rating: 1407, country: "in" },
      player2: { name: "aniketsaurav", rating: 1404, country: "in" },
      result: "1-0",
      accuracy: "Review",
      moves: 26,
      date: "5/2/2025",
    },
    {
      id: 3,
      player1: { name: "sunnyminister", rating: 1415, country: "us" },
      player2: { name: "aniketsaurav", rating: 1413, country: "in" },
      result: "1-0",
      accuracy: { player1: "89.3", player2: "77" },
      moves: 22,
      date: "5/2/2025",
    },
    {
      id: 4,
      player1: { name: "aniketsaurav", rating: 1422, country: "in" },
      player2: { name: "TheSanRoman", rating: 1416, country: "mx" },
      result: "0-1",
      accuracy: "Review",
      moves: 12,
      date: "5/2/2025",
    },
    {
      id: 5,
      player1: { name: "aniketsaurav", rating: 1431, country: "in" },
      player2: { name: "wolfman", rating: 1408, country: "ie" },
      result: "1-0",
      accuracy: { player1: "72.3", player2: "61.5" },
      moves: 28,
      date: "5/2/2025",
    },
  ];

  return (
    <div className="bg-[#1a1a1a] text-gray-200 min-h-screen">
      {/* Profile section - simplified */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 bg-red-900 rounded"></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">aniketsaurav</h1>
              <img
                src="/placeholder.svg?height=20&width=30"
                alt="India flag"
                className="h-5"
              />
              <button className="ml-2 px-3 py-1 bg-[#444] text-sm rounded hover:bg-[#555]">
                Add flair
              </button>
              <button className="ml-auto px-4 py-1 bg-[#444] text-sm rounded hover:bg-[#555]">
                Edit Profile
              </button>
            </div>
            <p className="text-gray-400 mt-2">Enter a status here</p>

            <div className="flex gap-6 mt-6 text-sm">
              <div>Jul 30, 2015 Joined</div>
              <div>9 Friends</div>
              <div>52 Views</div>
              <div className="text-green-500">Online now</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gray-700">
        <div className="flex">
          {["Overview", "Games", "Stats", "Friends", "Awards", "Clubs"].map(
            (tab) => (
              <button
                key={tab}
                className={`px-6 py-3 font-medium ${
                  tab === "Games" ? "border-b-2 border-green-500" : ""
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Game history section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            Game History <span className="text-gray-400 text-lg">(3,034)</span>
          </h2>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-white">
              <History size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            {["Recent", "Daily", "Live", "Bot"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-3 font-medium ${
                  activeTab === tab.toLowerCase()
                    ? "border-b-2 border-white"
                    : "text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Game list */}
        <div>
          {/* Headers */}
          <div className="grid grid-cols-12 py-3 border-b border-gray-700 text-gray-400 text-sm">
            <div className="col-span-5 pl-10">Players</div>
            <div className="col-span-1 text-center">Result</div>
            <div className="col-span-2 text-center">Accuracy</div>
            <div className="col-span-1 text-center">Moves</div>
            <div className="col-span-2 text-center">Date</div>
            <div className="col-span-1 text-center"></div>
          </div>

          {/* Game rows */}
          {games.map((game) => (
            <div
              key={game.id}
              className="grid grid-cols-12 py-4 border-b border-gray-700 items-center hover:bg-[#252525]"
            >
              {/* Clock icon */}
              <div className="col-span-1 flex justify-center">
                <Clock className="text-green-500" size={20} />
              </div>

              {/* Players */}
              <div className="col-span-4">
                <div className="flex items-center mb-1">
                  <div className="w-4 h-4 bg-white mr-2"></div>
                  <span className="font-medium">{game.player1.name}</span>
                  <span className="text-gray-400 ml-2">
                    ({game.player1.rating})
                  </span>
                  <img
                    src={`/placeholder.svg?height=15&width=20`}
                    alt={`${game.player1.country} flag`}
                    className="ml-2 h-3"
                  />
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-black border border-white mr-2"></div>
                  <span className="font-medium">{game.player2.name}</span>
                  <span className="text-gray-400 ml-2">
                    ({game.player2.rating})
                  </span>
                  <img
                    src={`/placeholder.svg?height=15&width=20`}
                    alt={`${game.player2.country} flag`}
                    className="ml-2 h-3"
                  />
                </div>
              </div>

              {/* Result */}
              <div className="col-span-1 text-center">
                {game.result === "1-0" ? (
                  <div className="flex flex-col items-center">
                    <span className="text-green-500">1</span>
                    <span className="text-red-500">0</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-red-500">0</span>
                    <span className="text-green-500">1</span>
                  </div>
                )}
              </div>

              {/* Accuracy */}
              <div className="col-span-2 text-center">
                {typeof game.accuracy === "string" ? (
                  <span className="text-blue-400 hover:underline cursor-pointer">
                    {game.accuracy}
                  </span>
                ) : (
                  <div className="flex flex-col">
                    <span>{game.accuracy.player1}</span>
                    <span>{game.accuracy.player2}</span>
                  </div>
                )}
              </div>

              {/* Moves */}
              <div className="col-span-1 text-center">{game.moves}</div>

              {/* Date */}
              <div className="col-span-2 text-center">{game.date}</div>

              {/* Checkbox */}
              <div className="col-span-1 flex justify-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
