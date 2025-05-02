import React from "react";
import Sidebar from "../components/Sidebar";
import useWindowDimensions from "../hooks/useWindowDimensions";
import useUser from "../hooks/useUser";
import GameHistory from "../components/game-history";

const ProfilePage = () => {
  const { width } = useWindowDimensions();
  const user = useUser();
  return (
    <>
      <Sidebar windowSize={width} user={user} />
      <GameHistory />
    </>
  );
};

export default ProfilePage;
