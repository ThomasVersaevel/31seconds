/* Create teams with names and add player names in the teams. Then put them in a rotation */
import React, { useState } from "react";

interface Team {
  name: string;
  players: string[];
}

const TeamSetup: React.FC = () => {
  const [numTeams, setNumTeams] = useState(2);
  const [teams, setTeams] = useState<Team[]>(
    Array(2).fill({ name: "", players: [""] })
  );

  // Update number of teams
  const handleTeamCountChange = (count: number) => {
    setNumTeams(count);
    const updatedTeams = Array(count)
      .fill(null)
      .map((_, i) => teams[i] || { name: `Team ${i + 1}`, players: [""] });
    setTeams(updatedTeams);
  };

  // Update team name
  const handleTeamNameChange = (index: number, name: string) => {
    const updated = [...teams];
    updated[index].name = name;
    setTeams(updated);
  };

  // Update player name
  const handlePlayerChange = (teamIndex: number, playerIndex: number, name: string) => {
    const updated = [...teams];
    updated[teamIndex].players[playerIndex] = name;
    setTeams(updated);
  };

  // Add player to team
  const handleAddPlayer = (teamIndex: number) => {
    const updated = [...teams];
    updated[teamIndex].players.push("");
    setTeams(updated);
  };

  // Remove player from team
  const handleRemovePlayer = (teamIndex: number, playerIndex: number) => {
    const updated = [...teams];
    updated[teamIndex].players.splice(playerIndex, 1);
    setTeams(updated);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Team Setup</h2>

      <label className="block mb-4">
        <span className="text-gray-700 font-medium">Number of Teams:</span>
        <input
          type="number"
          min={1}
          max={10}
          value={numTeams}
          onChange={(e) => handleTeamCountChange(Number(e.target.value))}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </label>

      {teams.map((team, teamIndex) => (
        <div key={teamIndex} className="mb-6 border p-4 rounded-lg bg-gray-50">
          <label className="block mb-2">
            <span className="text-gray-700">Team {teamIndex + 1} Name:</span>
            <input
              type="text"
              value={team.name}
              onChange={(e) => handleTeamNameChange(teamIndex, e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
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
                  className="flex-1 rounded-lg border-gray-300 shadow-sm"
                  placeholder={`Player ${playerIndex + 1}`}
                />
                <button
                  onClick={() => handleRemovePlayer(teamIndex, playerIndex)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  disabled={team.players.length <= 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddPlayer(teamIndex)}
              className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded"
            >
              Add Player
            </button>
          </div>
        </div>
      ))}

      <button
        className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg font-medium"
        onClick={() => console.log("Save teams to context or backend:", teams)}
      >
        Save Teams
      </button>
    </div>
  );
};

export default TeamSetup;
