import ReadyScreen from "./GameComponents/ReadyScreen";
import { useTeams } from "../context/TeamContext";
import { useNavigate } from "react-router-dom";
import { useGameSettings } from "../context/GameSettingsContext";
import { useEffect } from "react";

export function Game() {
  const navigate = useNavigate();
  const { teams, currentTeamIndex } = useTeams();
  const { targetScore } = useGameSettings();

  useEffect(() => {
    teams.forEach((team) => {
      if (team.points >= targetScore) {
        navigate("/game/winner", {
          state: {
            teamName: team.name,
          },
        });
      }
    });
  }, [teams, targetScore, navigate]);

  const nextUp = () => {
    navigate("/game/card", {
      state: {
        currentTeamIndex: currentTeamIndex,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ReadyScreen
        currentPlayer={
          teams[currentTeamIndex].players[teams[currentTeamIndex].nextUpIndex]
        }
        currentTeam={teams[currentTeamIndex].name}
        onReady={nextUp}
      />
    </div>
  );
}
