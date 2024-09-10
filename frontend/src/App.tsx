import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Game } from "./screens/Game";
import { LoginPage } from "./screens/UserLogin";
import { SignupPage } from "./screens/UserSignup";
import LandingPage from "./screens/Landing";
import ComputerPlay from "./screens/ComputerGame";
import ComputerPlay2 from "./screens/ComputerGame2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/engine" element={<ComputerPlay />} />
        <Route path="/engine-test" element={<ComputerPlay2 />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
