// src/context/TeamContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

export interface Team {
  name: string;
  players: string[];
  points: number;
  nextUpIndex: 0;
}

interface TeamContextType {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  currentTeamIndex: number;
  advanceTeamIndex: (points: number) => void;
  resetPoints: () => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  const advanceTeamIndex = (points: number) => {
    advancePlayerIndex(currentTeamIndex, points);
    setCurrentTeamIndex((prev) => (prev + 1) % teams.length);
  };

  // Iterate over players of the current team and save the index of the next up player
  const advancePlayerIndex = (teamIndex: number, score: number) => {
    const updatedNextUpIndex =
      (teams[teamIndex].nextUpIndex + 1) % teams[teamIndex].players.length;

    const updatedTeams = teams.map((team, index) =>
      index === teamIndex
        ? {
            ...team,
            nextUpIndex: updatedNextUpIndex,
            points: team.points + score,
          }
        : team
    ) as Team[];

    setTeams(updatedTeams);
  };

  const resetPoints = () => {
    const resetTeams = teams.map((team) => ({
      ...team,
      points: 0,
      nextUpIndex: 0,
    })) as Team[];
    setTeams(resetTeams);
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        setTeams,
        currentTeamIndex,
        advanceTeamIndex,
        resetPoints,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTeams = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeams must be used within a TeamProvider");
  }
  return context;
};
