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
    <div className="bg-sky-800 w-full h-screen mx-auto p-6 flex flex-col justify-center items-center text-center space-y-4">
      <h2 className="text-xl font-bold text-sky-300 mb-auto">
        {teams[currentTeamIndex].name} Scoring
      </h2>
      <div className="bg-blue-100 rounded-lg rounded-lg p-3 shadow-sm w-75">
        {words.map((word, index) => (
          <label
            key={index}
            className="flex items-center space-x-3 bg-blue-100 text-black px-4 py-2 text-lg font-medium "
          >
            <input
              type="checkbox"
              checked={checkedWords.includes(word)}
              onChange={() => toggleWord(word)}
              className="form-checkbox h-8 w-10"
            />
            <span>{word}</span>
          </label>
        ))}
      </div>
      <div className="mt-auto text-lg font-semibold mt-4 space-y-1">
        {teams.map((team, index) => (
          <div key={index}>
            <span className="text-slate-400">{team.name}:</span> <span className="text-slate-300">{team.points} points</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="w-full px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => submitScore(score)}
      >
        Next
      </button>
    </div>
  );
}
