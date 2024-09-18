import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./screens/UserLogin";
import { SignupPage } from "./screens/UserSignup";
import LandingPage from "./screens/Landing";
import EvalBarPage from "./screens/Evalbartest";
import { Suspense, lazy } from "react";

// Lazy loading the Game and ComputerPlay2 components
const Game = lazy(() => import("./screens/Game"));
const ComputerPlay2 = lazy(() => import("./screens/ComputerGame2"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/game"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Game />
            </Suspense>
          }
        />
        <Route
          path="/engine-test"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ComputerPlay2 />
            </Suspense>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/evalbar" element={<EvalBarPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
