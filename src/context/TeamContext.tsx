// src/context/TeamContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Team {
  name: string;
  players: string[];
  points: number;
  turnOrder: number;
}

interface TeamContextType {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  updateTeamPoints: (teamIndex: number, points: number) => void;
  resetTeams: () => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);

  const updateTeamPoints = (teamIndex: number, points: number) => {
    setTeams((prev) =>
      prev.map((team, index) =>
        index === teamIndex ? { ...team, points } : team
      )
    );
  };

  const resetTeams = () => {
    setTeams([]);
  };

  return (
    <TeamContext.Provider
      value={{ teams, setTeams, updateTeamPoints, resetTeams }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeams must be used within a TeamProvider");
  }
  return context;
};
