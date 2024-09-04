import { Link } from "react-router-dom";
import Topbar from "./Topbar";
import "./Sidebar.css";
import { useEffect, useState } from "react";
import { viewportWidthBreakpoint } from "../utils/config";
import { Button } from "@nextui-org/button";
import { FaHome } from "react-icons/fa";
import { FaChessKnight } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { User } from "@nextui-org/user";

const Sidebar = ({ windowSize, user }: { windowSize: number; user: any }) => {
  const [sidebar, setSidebar] = useState(true);

  useEffect(() => {
    console.log("Window size:", windowSize);
    // Ensure sidebar is open on large screens by default
    if (windowSize > viewportWidthBreakpoint) {
      setSidebar(true);
    } else {
      setSidebar(false);
    }
  }, [windowSize]);

  const setSidebarOpen = () => {
    console.log("setSidebarOpen");
    setSidebar((d) => !d);
  };

  const handleLinkClick = () => {
    // Collapse sidebar only on small devices
    if (windowSize <= viewportWidthBreakpoint) {
      setSidebar(false);
    }
  };

  return (
    <>
      <Topbar setSidebarOpen={setSidebarOpen} />
      <div
        id="sidebar"
        className={`h-screen w-[200px] fixed flex flex-col items-center justify-start z-10 top-0 left-0 bg-[#111] overflow-x-hidden transition-transform duration-300 ease-in-out transform ${
          sidebar ? "-translate-x-0" : "-translate-x-full"
        }`}
      >
        {windowSize <= viewportWidthBreakpoint && (
          <div className="sidebar-close-btn">
            <button onClick={() => setSidebar(false)}>
              <svg
                className="sidebar-close"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ width: "2rem", height: "2rem" }}
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
        <div className="sidebar-header">
          <img src="/Chess-logo-2.png" alt="chess-logo" />
        </div>
        <div className="flex flex-col items-center justify-start w-full flex-grow">
          <Link
            to="/"
            className="block w-[90%] text-left"
            onClick={handleLinkClick}
          >
            <Button
              startContent={<FaHome />}
              className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#444] text-base text-gray-300 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Home
            </Button>
          </Link>
          <Link to="/game" className="block w-[90%] text-left">
            <Button
              startContent={<FaChessKnight />}
              className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#444] text-base text-gray-300 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Play
            </Button>
          </Link>
          <Link to="/analysis" className="block w-[90%] text-left">
            <Button
              startContent={<FaMagnifyingGlass />}
              className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#444] text-base text-gray-300 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Analysis
            </Button>
          </Link>
          <Link to="/about" className="block w-[90%] text-left">
            <Button
              startContent={<FaInfoCircle />}
              className="flex items-center justify-start w-full text-left bg-transparent hover:text-green-400 hover:bg-[#444] text-base text-gray-300 px-4 rounded-md transition duration-300 ease-in-out"
            >
              About
            </Button>
          </Link>
        </div>

        <div className="w-full h-auto p-2">
          {user.type === "guest" ? (
            <div className="flex flex-col items-center justify-center gap-2 w-full my-4">
              <Link
                to="/login"
                className="h-8 w-full flex items-center justify-center rounded-sm bg-[#2ea44f] hover:bg-[#2c974b]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="h-8 w-full flex items-center justify-center rounded-sm bg-[#2ea44f] hover:bg-[#2c974b]"
              >
                Signup
              </Link>
            </div>
          ) : (
            <User
              name="Jane Doe"
              description="Product Designer"
              avatarProps={{
                radius: "sm",
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
