import "./Topbar.css";

const Topbar = ({ setSidebarOpen }: { setSidebarOpen: () => void }) => {
  return (
    <div className="justify-between items-center h-[35px] w-full text-[#555] sticky top-0 z-5 px-4 hidden lg:flex sm:h-[30px]">
      <button
        onClick={setSidebarOpen}
        className="bg-transparent border-none text-[#555] cursor-pointer text-[1.2rem] h-full"
      >
        <svg
          className="flex items-center h-full"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_429_11066)">
            <path
              d="M3 6.00092H21M3 12.0009H21M3 18.0009H21"
              stroke="#ffffff"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_429_11066">
              <rect
                width="24"
                height="24"
                fill="white"
                transform="translate(0 0.000915527)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>
      <h1>Chess</h1>
    </div>
  );
};

export default Topbar;
