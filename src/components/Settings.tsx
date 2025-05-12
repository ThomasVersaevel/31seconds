import React from "react";
import { useGameSettings } from "../context/GameSettingsContext";
import { useWords } from "../context/WordsContext";
import { useNavigate } from "react-router-dom";
import { Category } from "../context/WordsContext";

const Settings: React.FC = () => {
  const { countdownTime, setCountdownTime, targetScore, setTargetScore } =
    useGameSettings();
  const { selectedCategories, setSelectedCategories } = useWords();
  const navigate = useNavigate();

  // Define available categories and display labels
  const allCategories: { key: Category; label: string }[] = [
    { key: "boys", label: "Boys" },
    { key: "funny", label: "Funny" },
    { key: "people", label: "People" },
    { key: "places", label: "Places" },
    { key: "words", label: "Words" },
  ];

  const toggleCategory = (key: Category) => {
    const newCategories = selectedCategories.includes(key)
      ? selectedCategories.filter((c) => c !== key)
      : [...selectedCategories, key];
    setSelectedCategories(newCategories);
  };

  // Sort categories: active first
  const sortedCategories = [...allCategories].sort((a, b) => {
    const aActive = selectedCategories.includes(a.key as Category);
    const bActive = selectedCategories.includes(b.key as Category);
    return Number(bActive) - Number(aActive);
  });

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-sky-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Game Settings
      </h2>

      <form className="space-y-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="targetScore"
            className="text-sm font-medium text-gray-700 dark:text-white"
          >
            Points needed to win the game
          </label>
          <input
            id="targetScore"
            type="number"
            min={1}
            value={targetScore}
            onChange={(e) => setTargetScore(parseInt(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="roundTime"
            className="text-sm font-medium text-gray-700 dark:text-white"
          >
            Round Time (seconds)
          </label>
          <input
            id="roundTime"
            type="number"
            min={5}
            value={countdownTime}
            onChange={(e) => setCountdownTime(parseInt(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Categories
          </label>
          <div className="grid grid-cols-3 gap-2">
            {sortedCategories.map((cat) => {
              const active = selectedCategories.includes(cat.key as Category);
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => toggleCategory(cat.key as Category)}
                  className={`p-3 rounded-lg border text-xs font-semibold text-center transition-colors ${
                    active
                      ? "bg-green-500 text-white border-green-600"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  } hover:opacity-80`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="w-full px-4 py-2 mt-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => navigate("/")}
        >
          Save and exit
        </button>
      </form>
    </div>
  );
};

export default Settings;
