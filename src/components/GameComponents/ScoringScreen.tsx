import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTeams } from "../../context/TeamContext";
import { useWords } from "../../context/WordsContext";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface ScoringScreenProps {
  currentTeamIndex: number;
  words: string[];
}

export default function ScoringScreen() {
  const location = useLocation();
  const { currentTeamIndex, words } = location.state as ScoringScreenProps;

  const navigate = useNavigate();
  const { teams, advanceTeamIndex } = useTeams();
  const { editWord, deleteWord } = useWords();

  const [checkedWords, setCheckedWords] = useState<string[]>([]);
  const [displayedWords, setDisplayedWords] = useState(words);
  const [editingWord, setEditingWord] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState("");

  const toggleWord = (word: string) => {
    setCheckedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const submitScore = (score: number) => {
    advanceTeamIndex(score);
    navigate("/game");
  };

  const openEditor = (word: string) => {
    setEditingWord(word);
    setEditedValue(word);
  };

  const closeEditor = () => {
    setEditingWord(null);
    setEditedValue("");
  };

  const saveEdit = () => {
    const replacement = editedValue.trim();
    if (!editingWord || !replacement) return;

    if (!editWord(editingWord, replacement)) {
      alert("That word already exists in a category.");
      return;
    }
    setDisplayedWords((prev) =>
      prev.map((word) => (word === editingWord ? replacement : word))
    );
    setCheckedWords((prev) =>
      prev.map((word) => (word === editingWord ? replacement : word))
    );
    closeEditor();
  };

  const removeWord = () => {
    if (!editingWord) return;

    deleteWord(editingWord);
    setDisplayedWords((prev) => prev.filter((word) => word !== editingWord));
    setCheckedWords((prev) => prev.filter((word) => word !== editingWord));
    closeEditor();
  };
  const score = checkedWords?.length || 0;

  return (
    <div className="bg-sky-800 w-full h-screen mx-auto p-6 flex flex-col justify-center items-center text-center space-y-4">
      <h2 className="text-xl font-bold text-sky-300 mb-auto">
        {teams[currentTeamIndex].name} Scoring
      </h2>
      <div className="bg-blue-100 rounded-lg border-solid border-3 border-orange-500 p-3 shadow-sm w-75">
        {displayedWords.map((word, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-blue-100 text-black px-4 py-2 text-lg font-medium"
          >
            <label className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <input
                type="checkbox"
                checked={checkedWords.includes(word)}
                onChange={() => toggleWord(word)}
                className="form-checkbox h-8 w-8 shrink-0 accent-orange-400"
              />
              <span className="break-words">{word}</span>
            </label>
            <button
              type="button"
              aria-label={`Edit ${word}`}
              title={`Edit ${word}`}
              onClick={() => openEditor(word)}
              className="shrink-0 rounded p-2 text-sky-700 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-auto text-lg font-semibold mt-4 space-y-1">
        {teams.map((team, index) => (
          <div key={index}>
            <span className="text-slate-400">{team.name}:</span>{" "}
            <span className="text-slate-300">{team.points} points</span>
            {teams[currentTeamIndex].name === team.name && (
              <span className="text-slate-300">
                {" + " + checkedWords.length}
              </span>
            )}
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

      {editingWord && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/70 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-word-title"
        >
          <div className="relative flex min-h-[22rem] w-full max-w-2xl flex-col rounded-xl bg-blue-100 p-8 text-left text-black shadow-2xl">
            <button
              type="button"
              aria-label="Close editor"
              title="Close editor"
              onClick={closeEditor}
              className="absolute right-4 top-4 rounded p-2 text-slate-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <XMarkIcon className="h-7 w-7" />
            </button>
            <h2 id="edit-word-title" className="pr-10 text-2xl font-bold">
              Edit word
            </h2>
            <input
              autoFocus
              value={editedValue}
              onChange={(event) => setEditedValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") saveEdit();
              }}
              className="mt-8 w-full rounded-lg border-2 border-sky-700 bg-white p-4 text-xl outline-none focus:border-orange-500"
              aria-label="Word"
            />
            <div className="mt-auto flex items-center justify-between gap-4 pt-10">
              <button
                type="button"
                onClick={removeWord}
                className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-3 font-semibold text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <TrashIcon className="h-5 w-5" />
                Delete
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={!editedValue.trim()}
                className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
