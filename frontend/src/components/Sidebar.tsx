import { Link } from "react-router-dom";
import "./Sidebar.css";
const Sidebar = ({
  sidebar,
  windowSize,
}: {
  sidebar: boolean;
  windowSize: number;
}) => {
  return (
    <div
      className="sidebar"
      style={{
        display: windowSize < 1250 ? (sidebar ? "block" : "none") : "block",
      }}
    >
      <div className="sidebar-header">
        <h1>Chess</h1>
      </div>
      <div className="sidebar-content">
        <Link to="/">Home</Link>
        <Link to="/game">Play</Link>
        <Link to="/analysis">Analysis</Link>
        <Link to="/about">About</Link>
      </div>
      <div className="user-functions">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
};

export default Sidebar;
