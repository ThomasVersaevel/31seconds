import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Game } from "./components/Game";
import { GameSettingsProvider } from "./context/GameSettingsContext";
import ScoringScreen from "./components/GameComponents/ScoringScreen";
import ReadyScreen from "./components/GameComponents/ReadyScreen";
import Settings from "./components/Settings";
import TeamSetup from "./components/TeamSetup";
import Card from "./components/GameComponents/Card";
import { TeamProvider } from "./context/TeamContext";
import { WordsProvider } from "./context/WordsContext";
import Winner from "./components/GameComponents/Winner";

export function App() {
  const navigate = useNavigate();

  return (
    <GameSettingsProvider>
      <TeamProvider>
        <WordsProvider>
          <Routes>
            <Route
              path="/"
              element={
                <div className="bg-sky-800 w-full max-w-sm mx-auto p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center min-h-screen flex flex-col justify-between">
                  <div className="flex-grow flex flex-col items-center justify-center px-4">
                    <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                      31 Seconds
                    </h1>
                    <div className="flex flex-col items-center space-y-4">
                      <button
                        className="px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onClick={() => navigate("/teamsetup")}
                      >
                        Start Game
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onClick={() => navigate("/settings")}
                      >
                        Settings
                      </button>
                    </div>
                    <footer className="text-center py-4 text-gray-500 text-sm">
                      By ThoBro
                    </footer>
                  </div>
                </div>
              }
            />
            <Route path="/teamsetup" element={<TeamSetup />} />
            <Route path="/game" element={<Game />} />
            <Route path="/game/card" element={<Card />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/game/scoring" element={<ScoringScreen />} />
            <Route path="/game/ready" element={<ReadyScreen currentPlayer={""} currentTeam={""} onReady={function (): void {
              throw new Error("Function not implemented.");
            } } />} />
            <Route path="/game/winner" element={<Winner teamName={""} />} />
          </Routes>
        </WordsProvider>
      </TeamProvider>
    </GameSettingsProvider>
  );
}
