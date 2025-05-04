import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import useWindowDimensions from "../hooks/useWindowDimensions";
import useUser from "../hooks/useUser";
import GameHistory from "../components/game-history";
import { viewportWidthBreakpoint } from "../utils/config";

const ProfilePage = () => {
  const windowDimensions = useWindowDimensions();
  const user = useUser();
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
  return (
    <>
      <Sidebar
        windowSize={windowDimensions.width ? windowDimensions.width : 1251}
        user={user}
      />
      <main
        id="main"
        className="flex flex-col items-center justify-center flex-grow overflow-auto h-screen m-0 p-4 md:p-1 box-border lg:h-auto lg:flex-col lg:relative lg:w-full lg:gap-5 lg:overflow-auto"
      >
        <GameHistory />
      </main>
    </>
  );
};

export default ProfilePage;
