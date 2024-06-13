import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Game } from "./screens/Game";
import Landing from "./screens/Landing";
import UserLogin from "./screens/UserLogin";
import UserSignup from "./screens/UserSignup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
