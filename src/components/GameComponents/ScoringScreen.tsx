import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTeams } from "../../context/TeamContext";

interface ScoringScreenProps {
  currentTeamIndex: number;
  words: string[];
}

export default function ScoringScreen() {
  const location = useLocation();
  const { currentTeamIndex, words } = location.state as ScoringScreenProps;

  const navigate = useNavigate();
  const { teams, advanceTeamIndex } = useTeams();

  const [checkedWords, setCheckedWords] = useState<string[]>([]);

  const toggleWord = (word: string) => {
    setCheckedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const submitScore = (score: number) => {
    advanceTeamIndex(score);
    navigate("/game");
  };
  const score = checkedWords?.length || 0;

  return (
    <div className="bg-green-200 w-full max-w-sm mx-auto p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        {teams[currentTeamIndex].name} Scoring
      </h2>
      {words.map((word, index) => (
        <label
          key={index}
          className="flex items-center space-x-3 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-lg font-medium shadow-sm w-full"
        >
          <input
            type="checkbox"
            checked={checkedWords.includes(word)}
            onChange={() => toggleWord(word)}
            className="form-checkbox h-10 w-10"
          />
          <span>{word}</span>
        </label>
      ))}

      <div className="text-lg font-semibold text-green-700 mt-4 space-y-1">
        {teams.map((team, index) => (
          <div key={index}>
            {team.name}: {team.points} points
          </div>
        ))}
      </div>

      <button
        type="button"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => submitScore(score)}
      >
        Next
      </button>
    </div>
  );
}
