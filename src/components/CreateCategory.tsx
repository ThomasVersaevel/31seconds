import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCategory() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [wordInput, setWordInput] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const loadExistingCategories = () => {
    setExistingCategories(
      Object.keys(localStorage)
        .filter((key) => key.endsWith(".csv") && key !== "banned.csv")
        .map((key) => key.replace(".csv", ""))
        .sort()
    );
  };

  const editCategory = (category: string) => {
    const csv = localStorage.getItem(`${category}.csv`);
    if (!csv) return;

    setEditingCategory(category);
    setCategoryName(category);
    setWords(csv.split(",").map((word) => word.trim()).filter(Boolean));
    setWordInput("");
  };

  useEffect(() => {
    loadExistingCategories();
  }, []);

  const handleWordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Check for comma or Enter
    if (value.endsWith(",") || value.endsWith("\n")) {
      const trimmed = value.replace(/,|\n/g, "").trim();
      if (trimmed && !words.includes(trimmed)) {
        setWords([...words, trimmed]);
      }
      setWordInput("");
    } else {
      setWordInput(value);
    }
  };

  const removeWord = (wordToRemove: string) => {
    setWords(words.filter((word) => word !== wordToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = categoryName.trim().toLocaleLowerCase();
    if (!trimmedName || words.length === 0) {
      alert("Please provide a category name and at least one word.");
      return;
    }
    const csv = words.join(",");
    try {
      localStorage.setItem(`${trimmedName}.csv`, csv);
      setEditingCategory(null);
      loadExistingCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category. Please try again.");
    }

    // Clean up state
    setCategoryName("");
    setWords([]);
    setWordInput("");
  };

  return (
    <div className="w-full h-screen p-6 bg-sky-800 flex flex-col justify-center">
      <h2 className="text-3xl text-sky-300 font-bold text-center mb-auto">
        {editingCategory ? `Edit ${editingCategory}` : "Add New Category"}
      </h2>
      <div className="mb-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            disabled={Boolean(editingCategory)}
            className="p-3 rounded bg-sky-200 text-black"
          />

          <div className="p-3 rounded bg-sky-200 text-black min-h-[60px] flex flex-wrap gap-2 items-center">
            {words.map((word) => (
              <div
                key={word}
                className="flex items-center bg-sky-500 text-white rounded-full px-3 py-1 text-sm"
              >
                {word}
                <button
                  type="button"
                  onClick={() => removeWord(word)}
                  className="ml-2 text-white hover:text-gray-300"
                >
                  &times;
                </button>
              </div>
            ))}
            <input
              type="text"
              value={wordInput}
              onChange={handleWordInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault(); // prevent newline
              }}
              placeholder="Add words (comma or enter)"
              className="flex-grow min-w-[100px] bg-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-5 bg-emerald-400 text-white font-bold py-2 px-4 rounded hover:bg-emerald-600"
          >
            Save Category
          </button>
        </form>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {existingCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => editCategory(category)}
            className={`bg-sky-300 text-sky-900 px-4 py-2 rounded-full hover:bg-sky-200 ${
              editingCategory === category ? "ring-2 ring-orange-400" : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>

  

      <button
        type="submit"
        className="mt-5 bg-sky-500 text-white font-bold py-2 px-4 rounded hover:bg-sky-600"
        onClick={() => navigate("/settings")}
      >
        Save Category
      </button>
    </div>
  );
}
