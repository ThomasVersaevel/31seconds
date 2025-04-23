// src/context/TeamContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TeamContextType {
  teamName: string;
  setTeamName: (name: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamName, setTeamName] = useState("Team A"); // default name

  return (
    <TeamContext.Provider value={{ teamName, setTeamName }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) throw new Error("useTeam must be used within a TeamProvider");
  return context;
};
