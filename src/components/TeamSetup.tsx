import React, { useState } from "react";
import { Team, useTeams } from "../context/TeamContext";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/16/solid";

const TeamSetup: React.FC = () => {
  const { setTeams: setGlobalTeams } = useTeams();

  const [teams, setTeams] = useState<Team[]>([
    { name: "Team 1", players: [""], points: 0, nextUpIndex: 0 },
    { name: "Team 2", players: [""], points: 0, nextUpIndex: 0 },
  ]);
  const navigate = useNavigate();

  sessionStorage.removeItem("gameWords");
  sessionStorage.removeItem("timeLeft");

  const handleAddTeam = () => {
    setTeams((prevTeams) => [
      ...prevTeams,
      {
        name: `Team ${prevTeams.length + 1}`,
        players: [""],
        points: 0,
        turnOrder: prevTeams.length,
        nextUpIndex: 0,
      },
    ]);
  };

  const handleRemoveTeam = (teamIndex: number) => {
    if (teams.length <= 2) return; // Prevent removing the last two teams
    const newTeams = [...teams];
    newTeams.splice(teamIndex, 1);
    setTeams(newTeams);
  };

  const handleTeamNameChange = (index: number, name: string) => {
    const updated = [...teams];
    updated[index].name = name;
    setTeams(updated);
  };

  const handlePlayerChange = (
    teamIndex: number,
    playerIndex: number,
    name: string
  ) => {
    const updated = [...teams];
    updated[teamIndex].players[playerIndex] = name;
    setTeams(updated);
  };

  const handleAddPlayer = (teamIndex: number) => {
    const updated = [...teams];
    updated[teamIndex].players.push("");
    setTeams(updated);
  };

  const handleRemovePlayer = (teamIndex: number, playerIndex: number) => {
    const updated = [...teams];
    updated[teamIndex].players.splice(playerIndex, 1);
    setTeams(updated);
  };

  const saveTeams = () => {
    setGlobalTeams(teams);
    navigate("/game");
  };

  return (
    <div className="w-full h-full p-6 bg-sky-800 min-h-screen flex flex-col">
      <h2 className="text-3xl text-sky-300 font-bold text-center mb-4">
        Team Setup
      </h2>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-gray-500 text-center text-xl">Teams: {teams.length}</span>
        <button
          className="flex items-center text-center px-3 justify-start py-2 bg-gradient-to-t from-emerald-400 to-emerald-500 text-slate-200 rounded-lg font-medium"
          onClick={handleAddTeam}
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          <span>Add Team</span>
        </button>
      </div>

      {teams.map((team, teamIndex) => (
        <div
          key={teamIndex}
          className="mb-6 border p-4 rounded-lg bg-gradient-to-t from-sky-100 to-sky-200"
        >
          <label className="block mb-2">
            <button
              onClick={() => handleRemoveTeam(teamIndex)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded disabled:bg-gray-300"
              disabled={teams.length <= 2}
            >
              ✕
            </button>
            <span className="px-2 text-gray-700">
              Team {teamIndex + 1} Name:
            </span>

            <input
              type="text"
              value={team.name}
              onChange={(e) => handleTeamNameChange(teamIndex, e.target.value)}
              className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
            />
          </label>

          <div>
            <span className="text-gray-700 font-medium">Players:</span>
            {team.players.map((player, playerIndex) => (
              <div key={playerIndex} className="flex items-center mb-2">
                <input
                  type="text"
                  value={player}
                  onChange={(e) =>
                    handlePlayerChange(teamIndex, playerIndex, e.target.value)
                  }
                  className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                  placeholder={`Player ${playerIndex + 1}`}
                />
                <button
                  onClick={() => handleRemovePlayer(teamIndex, playerIndex)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded disabled:bg-gray-300"
                  disabled={team.players.length <= 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddPlayer(teamIndex)}
              className="mt-2 px-3 py-1 text-sm bg-sky-500 text-white rounded"
            >
              Add Player
            </button>
          </div>
        </div>
      ))}

      <button
        className="w-full mt-auto mt-4 py-2 bg-sky-600 text-white focus:ring-sky-300 hover:bg-sky-200 rounded-lg font-medium "
        onClick={saveTeams}
      >
        Save Teams
      </button>
    </div>
  );
};

export default TeamSetup;
