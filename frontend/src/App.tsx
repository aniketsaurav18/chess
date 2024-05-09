import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Game } from "./screens/Game";
import Landing from "./screens/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game boardWidth={700} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
