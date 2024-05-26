import "./Topbar.css";

const Topbar = ({
  setSidebarOpen,
  sidebar,
}: {
  setSidebarOpen: (val: boolean) => void;
  sidebar: boolean;
}) => {
  const openSidebar = () => {
    if (sidebar) {
      setSidebarOpen(false);
      return;
    }
    setSidebarOpen(true);
  };

  return (
    <div className="topbar">
      <button onClick={openSidebar}>open</button>
      <h1>Chess</h1>
    </div>
  );
};

export default Topbar;
