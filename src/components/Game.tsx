import ReadyScreen from "./GameComponents/ReadyScreen";
import { useTeams } from "../context/TeamContext";
import { useNavigate } from "react-router-dom";

export function Game() {
  const navigate = useNavigate();
  const { teams, currentTeamIndex } = useTeams();

  const nextUp = () => {
    navigate("/game/card", {
      state: {
        currentTeamIndex: currentTeamIndex,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-500 px-4">
      <ReadyScreen
        currentPlayer={teams[currentTeamIndex].players[teams[currentTeamIndex].nextUpIndex]}
        currentTeam={teams[currentTeamIndex].name}
        onReady={nextUp}
      />
    </div>
  );
}
