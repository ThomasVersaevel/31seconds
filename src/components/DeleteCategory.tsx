import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DeleteCategory = () => {
  const navigate = useNavigate();
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.endsWith(".csv")
    );
    const names = keys.map((key) => key.replace(".csv", ""));
    setCustomCategories(names);
  }, []);

  const handleDelete = (categoryName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${categoryName}"?`
    );
    if (confirmed) {
      localStorage.removeItem(`${categoryName}.csv`);
      setCustomCategories((prev) =>
        prev.filter((name) => name !== categoryName)
      );
    }
  };

  return (
    <div className="w-full h-screen p-6 bg-sky-800 justify-center flex flex-col">
      <h2 className="text-3xl text-sky-300 mb-5 font-bold text-center mb-auto">
        Delete Custom Categories
      </h2>

      {customCategories.length === 0 ? (
        <p className="text-gray-300">No custom categories found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {customCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleDelete(category)}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
            >
              Delete "{category}"
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="w-full mt-auto px-4 py-2 mt-6 bg-sky-500 text-white rounded-lg hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-opacity-50"
        onClick={() => navigate("/settings")}
      >
        Back to Settings
      </button>
    </div>
  );
};

export default DeleteCategory;
