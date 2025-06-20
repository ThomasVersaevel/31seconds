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
import CreateCategory from "./components/CreateCategory";
import DeleteCategory from "./components/DeleteCategory";
import { useEffect, useState } from "react";

export function App() {
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };

  return (
    <GameSettingsProvider>
      <TeamProvider>
        <WordsProvider>
          <Routes>
            <Route
              path="/"
              element={
                <div className="fixed inset-0 overflow-hidden bg-gradient-to-t from-sky-800 to-sky-700 mx-auto p-6 flex flex-col justify-center items-center text-center min-h-screen w-screen flex">
                  <div className="blob"> </div>
                  <div className="flex-grow flex flex-col items-center justify-center px-4">
                    <img
                      src="/icon-512x512.png"
                      alt="App Icon"
                      className="w-24 h-24 mb-4"
                    ></img>
                    <div className="z-1 flex flex-col items-center space-y-4">
                      <button
                        className="w-full px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-50"
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
                      {deferredPrompt && (
                        <button
                          className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-50"
                          onClick={handleInstallClick}
                        >
                          Install App
                        </button>
                      )}
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
            <Route path="/add-category" element={<CreateCategory />} />
            <Route path="/delete-category" element={<DeleteCategory />} />
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
            <Route path="/game/winner" element={<Winner />} />
          </Routes>
        </WordsProvider>
      </TeamProvider>
    </GameSettingsProvider>
  );
}
