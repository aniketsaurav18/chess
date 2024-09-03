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
        className={`h-screen w-[200px] fixed flex flex-col items-center justify-start z-10 top-0 left-0 bg-[#111] overflow-x-hidden transition-transform duration-300 ease-in-out transform            ${
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
        <div className="sidebar-content">
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

        {user.user === "guest" ? (
          <div className="user-functions">
            <Link to="/login" className="sidebar-link userfn-btn sidebar-text">
              Login
            </Link>
            <Link to="/signup" className="sidebar-link userfn-btn sidebar-text">
              Signup
            </Link>
          </div>
        ) : (
          <div className="user-container">
            <div className="user-details">
              <img src="./default_user.jpg" alt="" className="user-image" />
              <div className="user-details-text">
                <h4 className="sidebar-text">{user?.username}</h4>
                <p className="sidebar-text">{user?.email}</p>
              </div>
            </div>
            <button className="logout-btn">Logout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
