import { GiHamburgerMenu } from "react-icons/gi";

const Topbar = ({ setSidebarOpen }: { setSidebarOpen: () => void }) => {
  return (
    <div className="justify-between items-center h-[50px] w-full bg-[#1a1a1a] text-white sticky top-0 z-10 px-4 shadow-md border-b border-[#2e2e2e] hidden lg:flex mb-4">
      {/* Sidebar Toggle Button */}
      <button
        onClick={setSidebarOpen}
        className="flex items-center justify-center bg-transparent border-none text-white cursor-pointer text-[1.5rem] h-full p-2 hover:text-green-400 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <GiHamburgerMenu />
      </button>

      {/* Title */}
      <h1
        className="text-lg font-bold tracking-wide text-white hover:cursor-pointer"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Chess
      </h1>
      <div className="flex items-center gap-4">
        {/* Example of a Profile Icon or Notification Bell */}
        {/* This space can be used to add icons or elements in the future */}
      </div>
    </div>
  );
};

export default Topbar;
