import React from "react";
import { useGameSettings } from "../context/GameSettingsContext";
import { useWords } from "../context/WordsContext";
import { useNavigate } from "react-router-dom";
import { Category } from "../context/WordsContext";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";

const Settings: React.FC = () => {
  const { countdownTime, setCountdownTime, targetScore, setTargetScore } =
    useGameSettings();
  const { allCategories, selectedCategories, setSelectedCategories } =
    useWords();
  const navigate = useNavigate();

  const toggleCategory = (key: Category) => {
    const newCategories = selectedCategories.includes(key)
      ? selectedCategories.filter((c) => c !== key)
      : [...selectedCategories, key];
    setSelectedCategories(newCategories);
  };

  const sortedCategories = allCategories
    .map((cat) => ({
      key: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    }))
    .sort((a, b) => {
      const aActive = selectedCategories.includes(a.key);
      const bActive = selectedCategories.includes(b.key);
      return Number(bActive) - Number(aActive);
    });

  return (
    <div className="w-full h-screen p-6 bg-sky-800 flex flex-col justify-center">
      <h2 className="text-3xl text-sky-300 font-bold text-center mb-auto">
        Game Settings
      </h2>

      <form className="space-y-8">
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="targetScore"
                className="text-lg font-medium text-sky-200 text-center"
              >
                Total points
              </label>
              <input
                id="targetScore"
                type="number"
                min={1}
                value={targetScore}
                onChange={(e) => setTargetScore(parseInt(e.target.value))}
                className="bg-sky-200 focus:border-grey-800 border border-gray-800 text-gray-900 text-xl rounded-lg w-full p-2.5 text-center"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="roundTime"
                className="text-lg font-medium text-sky-200 text-center"
              >
                Round Time
              </label>
              <input
                id="roundTime"
                type="number"
                min={5}
                value={countdownTime}
                onChange={(e) => setCountdownTime(parseInt(e.target.value))}
                className="bg-sky-200 focus:border-grey-800 border-gray-800 text-gray-900 text-xl rounded-lg w-full p-2.5 text-center"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-center block text-1xl font-medium text-sky-200 mb-2">
            Select Categories to use in the game
          </label>
          <div className="grid grid-cols-3 gap-2">
            {sortedCategories.map((cat) => {
              const active = selectedCategories.includes(cat.key as Category);
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => toggleCategory(cat.key as Category)}
                  className={`p-3 rounded-lg border text-xs font-semibold text-center transition-colors duration-450 ease-in-out ${
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

        <div className="grid grid-cols-3 items-start gap-4">
          <button
            type="button"
            className="flex items-center gap-2 text-left justify-start w-full px-3 py-2 mt-6 bg-orange-400 text-sm text-white rounded-lg hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-opacity-50"
            onClick={() => navigate("/add-category")}
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Create Category</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 text-left w-full px-3 py-2 mt-6 bg-rose-600 text-sm text-white rounded-lg hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-opacity-50"
            onClick={() => navigate("/delete-category")}
          >
            <MinusCircleIcon className="h-5 w-5" />
            <span>Delete Category</span>
          </button>
        </div>

        <button
          type="button"
          className="w-full mt-auto px-4 py-2 mt-6 bg-sky-500 text-white rounded-lg hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-opacity-50"
          onClick={() => navigate("/delete")}
        >
          Save and exit
        </button>
      </form>
    </div>
  );
};

export default Settings;
