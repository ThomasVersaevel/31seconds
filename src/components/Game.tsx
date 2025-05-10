import React, { useEffect, useState } from "react";
import ReadyScreen from "./GameComponents/ReadyScreen";
import { useTeams } from "../context/TeamContext";
import { useNavigate } from "react-router-dom";

export function Game() {
  const navigate = useNavigate();
  const { teams } = useTeams();

  const [teamIndex, setTeamIndex] = useState(0);
  const [playerIndices, setPlayerIndices] = useState<{ [key: number]: number }>(
    {}
  );

  // Initialize player indices once teams are loaded
  useEffect(() => {
    if (teams.length) {
      const initialPlayerIndices: { [key: number]: number } = {};
      teams.forEach((_, idx) => {
        initialPlayerIndices[idx] = 0;
      });
      setPlayerIndices(initialPlayerIndices);
    }
  }, [teams]);

  const nextUp = () => {
    const currentTeam = teams[teamIndex];
    const currentPlayerIndex = playerIndices[teamIndex] ?? 0;
    const nextPlayerIndex =
      (currentPlayerIndex + 1) % currentTeam.players.length;

    // Update player index for current team
    setPlayerIndices((prev) => ({
      ...prev,
      [teamIndex]: nextPlayerIndex,
    }));

    setTeamIndex((prev) => (prev + 1) % teams.length);
    navigate("/game/card", {
      state: {
        currentTeamIndex: teamIndex,
      },
    });
  };

  // Get current player and team
  const currentTeam = teams[teamIndex];
  const currentPlayerIndex = playerIndices[teamIndex] ?? 0;
  const currentPlayer = currentTeam?.players?.[currentPlayerIndex] ?? "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-500 px-4">
      <ReadyScreen
        currentPlayer={currentPlayer}
        currentTeam={currentTeam?.name || ""}
        onReady={nextUp}
      />
    </div>
  );
}
