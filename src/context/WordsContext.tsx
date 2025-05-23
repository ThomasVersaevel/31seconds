import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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
  allCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
  refreshCategories: () => void;
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

  const [allCategories, setAllCategories] = useState<Category[]>([
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

    const customKeys = Object.keys(customPools);
    setSelectedCategories((prev) => [...new Set([...prev, ...customKeys])]);
    setAllCategories((prev) => [...new Set([...prev, ...customKeys])]);
  }, []);

  const getWords = (categories: Category[] = selectedCategories): string[] => {
    const selectedWords: string[] = [];

    // Build available pools (excluding used words)
    const availablePools = categories.map(
      (cat) => wordPools[cat]?.filter((word) => !usedWords.has(word)) || []
    );

    // Build weights array based on pool sizes
    const weights = availablePools.map((pool) => pool.length);

    // Flattened function to choose a category index based on weights
    const pickWeightedIndex = (weights: number[]) => {
      const total = weights.reduce((acc, w) => acc + w, 0);
      let r = Math.random() * total;
      for (let i = 0; i < weights.length; i++) {
        if (r < weights[i]) return i;
        r -= weights[i];
      }
      return 0; // fallback
    };

    while (
      selectedWords.length < NR_WORDS &&
      availablePools.flat().length > 0
    ) {
      const catIndex = pickWeightedIndex(weights);
      const pool = availablePools[catIndex];

      if (pool.length === 0) continue;

      const wordIndex = Math.floor(Math.random() * pool.length);
      const word = pool.splice(wordIndex, 1)[0];
      selectedWords.push(word);
      usedWords.add(word);

      // Update the weight for that pool since it shrank
      weights[catIndex]--;
    }

    setUsedWords(new Set(usedWords));
    return selectedWords;
  };

  const refreshCategories = () => {
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

    const customKeys = Object.keys(customPools) as Category[];
    setSelectedCategories((prev) => [...new Set([...prev, ...customKeys])]);

    const builtIn: Category[] = ["boys", "funny", "people", "places", "words"];
    setAllCategories([...builtIn, ...customKeys]);
  };

  const resetWords = () => setUsedWords(new Set());

  return (
    <WordsContext.Provider
      value={{
        getWords,
        resetWords,
        selectedCategories,
        allCategories,
        setSelectedCategories,
        refreshCategories,
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

// eslint-disable-next-line react-refresh/only-export-components
export const useWords = () => {
  const context = useContext(WordsContext);
  if (!context) throw new Error("useWords must be used within a WordsProvider");
  return context;
};
