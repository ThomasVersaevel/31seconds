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
                <div className="bg-gradient-to-t from-sky-800 to-sky-700 w-full mx-auto p-6 shadow-xl flex flex-col justify-center items-center text-center min-h-screen flex flex-col justify-between">
                  <meta name="apple-mobile-web-app-capable" content="yes" />
                  <div className="blob"> </div>
                  <div className="flex-grow flex flex-col items-center justify-center px-4">
                    <h1 className="text-4xl font-semibold text-center text-orange-500 mb-6">
                      31 Seconds
                    </h1>
                    <div className="z-1 flex flex-col items-center space-y-4">
                      <button
                        className="pw-full px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-50"
                        onClick={() => navigate("/teamsetup")}
                      >
                        Start Game
                      </button>
                      <button
                        className="w-full px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-50"
                        onClick={() => navigate("/settings")}
                      >
                        Settings
                      </button>
                    </div>
                    <footer className="text-center py-4 text-gray-300  text-sm">
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
            <Route
              path="/game/ready"
              element={
                <ReadyScreen
                  currentPlayer={""}
                  currentTeam={""}
                  onReady={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              }
            />
            <Route path="/game/winner" element={<Winner teamName={""} />} />
          </Routes>
        </WordsProvider>
      </TeamProvider>
    </GameSettingsProvider>
  );
}
