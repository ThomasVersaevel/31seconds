
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Import CSV files as raw strings
import boysCategory from "../assets/categories/boys.csv?raw";
import funnyCategory from "../assets/categories/funny.csv?raw";
import peopleCategory from "../assets/categories/people.csv?raw";
import placesCategory from "../assets/categories/places.csv?raw";
import wordsCategory from "../assets/categories/words.csv?raw";

type Category = "boys" | "funny" | "people" | "places" | "words";

interface WordsContextType {
  getWords: (categories: Category[]) => string[];
  resetWords: () => void;
}

const NR_WORDS = 5;

const WordsContext = createContext<WordsContextType | undefined>(undefined);

export const WordsProvider = ({ children }: { children: ReactNode }) => {
  const wordPools: Record<Category, string[]> = {
    boys: boysCategory
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean),
    funny: funnyCategory
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean),
    people: peopleCategory
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean),
    places: placesCategory
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean),
    words: wordsCategory
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean),
  };

  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  const getWords = (categories: Category[]): string[] => {
    const selectedWords: string[] = [];
    const availablePools = categories.map((cat) =>
      wordPools[cat].filter((word) => !usedWords.has(word))
    );

    while (selectedWords.length < NR_WORDS && availablePools.flat().length > 0) {
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
    <WordsContext.Provider value={{ getWords, resetWords }}>
      {children}
    </WordsContext.Provider>
  );
};

export const useWords = () => {
  const context = useContext(WordsContext);
  if (!context) throw new Error("useWords must be used within a WordsProvider");
  return context;
};
