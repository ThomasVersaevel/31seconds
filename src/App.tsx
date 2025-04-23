import { useState } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Game } from "./components/Game";
import ScoringScreen from "./components/GameComponents/ScoringScreen";

export function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <h1>31 Seconds</h1>
            <div className="flex flex-col items-center space-y-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => navigate("/game")}
              >
                Start Game
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded">
                Settings
              </button>
            </div>
            <h4>By ThoBro</h4>
          </>
        }
      />
      <Route path="/game" element={<Game />} />
      <Route path="/scoring" element={<ScoringScreen />} />
    </Routes>
  );
}
