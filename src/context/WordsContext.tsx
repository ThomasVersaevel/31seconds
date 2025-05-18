import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Raw imports
import boysCategory from "../assets/categories/boys.csv?raw";
import funnyCategory from "../assets/categories/funny.csv?raw";
import peopleCategory from "../assets/categories/people.csv?raw";
import placesCategory from "../assets/categories/places.csv?raw";
import wordsCategory from "../assets/categories/words.csv?raw";

export type Category = string; // Changed from union type to support dynamic custom categories

interface WordsContextType {
  getWords: (categories: Category[]) => string[];
  resetWords: () => void;
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
}

const NR_WORDS = 5;

const WordsContext = createContext<WordsContextType | undefined>(undefined);

export const WordsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    "boys",
    "funny",
    "people",
    "places",
    "words",
  ]);

  const [wordPools, setWordPools] = useState<Record<Category, string[]>>({
    boys: parseCSV(boysCategory),
    funny: parseCSV(funnyCategory),
    people: parseCSV(peopleCategory),
    places: parseCSV(placesCategory),
    words: parseCSV(wordsCategory),
  });

  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    const customPools: Record<Category, string[]> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith(".csv")) {
        const name = key.replace(".csv", "");
        const csv = localStorage.getItem(key);
        if (csv) {
          customPools[name] = parseCSV(csv);
        }
      }
    }

    setWordPools((prev) => ({ ...prev, ...customPools }));

    // Optionally auto-add all custom categories to selection
    const customKeys = Object.keys(customPools);
    setSelectedCategories((prev) => [...new Set([...prev, ...customKeys])]);
  }, []);

  const getWords = (categories: Category[] = selectedCategories): string[] => {
    const selectedWords: string[] = [];
    const availablePools = categories.map((cat) =>
      wordPools[cat]?.filter((word) => !usedWords.has(word)) || []
    );

    while (
      selectedWords.length < NR_WORDS &&
      availablePools.flat().length > 0
    ) {
      const catIndex = Math.floor(Math.random() * categories.length);
      const pool = availablePools[catIndex];

      if (pool.length === 0) continue;

      const wordIndex = Math.floor(Math.random() * pool.length);
      const word = pool.splice(wordIndex, 1)[0];
      selectedWords.push(word);
      usedWords.add(word);
    }

    setUsedWords(new Set(usedWords));
    return selectedWords;
  };

  const resetWords = () => setUsedWords(new Set());

  return (
    <WordsContext.Provider
      value={{
        getWords,
        resetWords,
        selectedCategories,
        setSelectedCategories,
      }}
    >
      {children}
    </WordsContext.Provider>
  );
};

const parseCSV = (csv: string): string[] =>
  csv
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);

export const useWords = () => {
  const context = useContext(WordsContext);
  if (!context) throw new Error("useWords must be used within a WordsProvider");
  return context;
};
