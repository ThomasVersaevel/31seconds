// Holds globals for the game settings
import { createContext, useContext, useState, ReactNode } from "react";

interface GameSettings {
  targetScore: number;
  setTargetScore: (score: number) => void;
  countdownTime: number;
  setCountdownTime: (time: number) => void;
}

const GameSettingsContext = createContext<GameSettings | undefined>(undefined);

export const GameSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [targetScore, setTargetScore] = useState<number>(31);
  const [countdownTime, setCountdownTime] = useState<number>(31);

  return (
    <GameSettingsContext.Provider value={{ targetScore, setTargetScore, countdownTime, setCountdownTime}}>
      {children}
    </GameSettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error("useGameSettings must be used within a GameSettingsProvider");
  }
  return context;
};
