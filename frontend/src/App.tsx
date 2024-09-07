import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Game } from "./screens/Game";
import { LoginPage } from "./screens/UserLogin";
// import UserSignup from "./screens/UserSignup";
import { SignupPage } from "./screens/UserSignup";
import LandingPage from "./screens/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
