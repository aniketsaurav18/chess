import { Link } from "react-router-dom";
import Topbar from "./Topbar";
import { useEffect, useState } from "react";
import { viewportWidthBreakpoint } from "../utils/config";
import { Button } from "@nextui-org/button";
import {
  FaHome,
  FaChessKnight,
  FaInfoCircle,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { RiRobot2Fill } from "react-icons/ri";
import { User } from "@nextui-org/user";

const Sidebar = ({ windowSize, user }: { windowSize: number; user: any }) => {
  const [sidebar, setSidebar] = useState(true);

  useEffect(() => {
    if (windowSize > viewportWidthBreakpoint) {
      setSidebar(true);
    } else {
      setSidebar(false);
    }
  }, [windowSize]);

  const setSidebarOpen = () => {
    setSidebar((d) => !d);
  };

  const handleLinkClick = () => {
    if (windowSize <= viewportWidthBreakpoint) {
      setSidebar(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <Topbar setSidebarOpen={setSidebarOpen} />
      <div
        id="sidebar"
        className={`h-screen w-[200px] fixed flex flex-col items-center justify-start z-20 top-0 left-0 bg-[#121212] border-r border-[#2e2e2e] overflow-x-hidden transition-transform duration-300 ease-in-out transform ${
          sidebar ? "-translate-x-0" : "-translate-x-full"
        }`}
      >
        {windowSize <= viewportWidthBreakpoint && (
          <div className="absolute top-4 right-4">
            <button onClick={() => setSidebar(false)}>
              <svg
                className="text-white w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="my-8">
          <img
            src="/Chess-logo-2.png"
            alt="chess-logo"
            className="w-24 h-auto"
          />
        </div>
        <div className="flex flex-col items-center justify-start w-full flex-grow space-y-2">
          <Link
            to="/"
            className="block w-[90%] text-left"
            onClick={handleLinkClick}
          >
            <Button
              startContent={<FaHome />}
              className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#2e2e2e] text-base text-gray-300 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Home
            </Button>
          </Link>
          <Link to="/game" className="block w-[90%] text-left">
            <Button
              startContent={<FaChessKnight />}
              className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#2e2e2e] text-base text-gray-300 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Play
            </Button>
          </Link>
          <Link to="/computer" className="block w-[90%] text-left">
            <Button
              startContent={<RiRobot2Fill />}
              className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#2e2e2e] text-base text-gray-300 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Play with AI
            </Button>
          </Link>
          <Link to="/profile" className="block w-[90%] text-left">
            <Button
              startContent={<FaUser />}
              className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#2e2e2e] text-base text-gray-300 px-4 rounded-md transition duration-300 ease-in-out"
            >
              My Profile
            </Button>
          </Link>
          <Link to="/analysis" className="block w-[90%] text-left">
            <Button
              startContent={<FaMagnifyingGlass />}
              className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#2e2e2e] text-base text-gray-300 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Analysis
            </Button>
          </Link>
          <Link to="/about" className="block w-[90%] text-left">
            <Button
              startContent={<FaInfoCircle />}
              className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#2e2e2e] text-base text-gray-300 px-4 rounded-md transition duration-300 ease-in-out"
            >
              About
            </Button>
          </Link>
        </div>

        <div className="w-full h-auto p-4 bg-[#1a1a1a] border-t border-[#2e2e2e]">
          {user.type === "guest" ? (
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <Link
                to="/login"
                className="h-10 w-full flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="h-10 w-full flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 text-white"
              >
                Signup
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full items-start">
              <User
                name={user.name}
                avatarProps={{
                  radius: "sm",
                  src: "/default-user.jpg",
                }}
                className="text-white"
              />
              <Link to="/profile" className="w-full">
                <Button
                  startContent={<FaUser />}
                  className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#2e2e2e] text-sm text-gray-300 pl-2 pr-4 py-0 h-9 rounded-md transition duration-300 ease-in-out"
                >
                  Profile
                </Button>
              </Link>
              <Button
                startContent={<FaSignOutAlt />}
                className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#2e2e2e] text-sm text-gray-300 pl-2 pr-4 h-9 rounded-md transition duration-300 ease-in-out"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
