import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

// Raw imports
import boysCategory from "../assets/categories/boys.csv?raw";
import funnyCategory from "../assets/categories/funny.csv?raw";
import peopleCategory from "../assets/categories/people.csv?raw";
import placesCategory from "../assets/categories/places.csv?raw";
import wordsCategory from "../assets/categories/words.csv?raw";
import animalsCategory from "../assets/categories/animals.csv?raw";
import bannedCategory from "../assets/categories/banned.csv?raw";

export type Category = string; // Changed from union type to support dynamic custom categories

interface WordsContextType {
  getWords: (categories: Category[]) => string[];
  resetWords: () => void;
  selectedCategories: Category[];
  allCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
  refreshCategories: () => void;
  getWordCategory: (word: string) => Category | undefined;
  getBannedWords: () => string[];
  editWord: (word: string, replacement: string) => boolean;
  deleteWord: (word: string) => void;
}

const NR_WORDS = 5;

const WordsContext = createContext<WordsContextType | undefined>(undefined);

const builtInCategories: Category[] = [
  "boys",
  "funny",
  "people",
  "places",
  "words",
  "animals",
];

const categoryStorageKey = (category: Category) => `${category}.csv`;

export const WordsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    "boys",
    "funny",
    "people",
    "places",
    "words",
    "animals",
  ]);

  const [allCategories, setAllCategories] = useState<Category[]>([
    ...builtInCategories,
  ]);

  const [wordPools, setWordPools] = useState<Record<Category, string[]>>({
    boys: loadCategory("boys", boysCategory),
    funny: loadCategory("funny", funnyCategory),
    people: loadCategory("people", peopleCategory),
    places: loadCategory("places", placesCategory),
    words: loadCategory("words", wordsCategory),
    animals: loadCategory("animals", animalsCategory),
    banned: loadCategory("banned", bannedCategory),
  });

  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const wordSources = useRef<Record<string, Category>>({});
  const categorySkipCounts = useRef<Record<Category, number>>({});

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

    const customKeys = Object.keys(customPools).filter(
      (category) => category.toLowerCase() !== "banned"
    );
    setSelectedCategories((prev) => [...new Set([...prev, ...customKeys])]);
    setAllCategories((prev) => [...new Set([...prev, ...customKeys])]);
  }, []);

  const getWords = (categories: Category[] = selectedCategories): string[] => {
    const selectedWords: string[] = [];

    // Build available pools (excluding used words)
    const availablePools = categories.map(
      (cat) => wordPools[cat]?.filter((word) => !usedWords.has(word)) || []
    );

    // Moderate list-size differences so skipped categories get a soft boost.
    const weights = availablePools.map((pool, index) => {
      const category = categories[index];
      const sizeWeight = Math.sqrt(pool.length);
      const skipBoost = 1 + (categorySkipCounts.current[category] || 0) * 0.35;
      return sizeWeight * skipBoost;
    });
    const selectedCategoriesThisRound = new Set<Category>();

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
      wordSources.current[word] = categories[catIndex];
      selectedCategoriesThisRound.add(categories[catIndex]);
      usedWords.add(word);

      // Update the weight for that pool since it shrank
      weights[catIndex] = Math.sqrt(pool.length) *
        (1 + (categorySkipCounts.current[categories[catIndex]] || 0) * 0.35);
    }

    categories.forEach((category) => {
      if (selectedCategoriesThisRound.has(category)) {
        categorySkipCounts.current[category] = 0;
      } else if (availablePools[categories.indexOf(category)]?.length) {
        categorySkipCounts.current[category] = Math.min(
          (categorySkipCounts.current[category] || 0) + 1,
          3
        );
      }
    });

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

    setAllCategories([...builtInCategories, ...customKeys.filter((key) => key.toLowerCase() !== "banned")]);
  };

  const resetWords = () => setUsedWords(new Set());

  const getBannedWords = () => wordPools.banned || [];

  const getWordCategory = (word: string) =>
    wordSources.current[word] ||
    (Object.entries(wordPools).find(
      ([category, words]) => category !== "banned" && words.includes(word)
    )?.[0] as Category | undefined);

  const editWord = (word: string, replacement: string) => {
    const category = getWordCategory(word);
    if (!category) return false;
    const replacementExists = Object.entries(wordPools).some(
      ([poolCategory, words]) =>
        poolCategory !== "banned" && words.includes(replacement) && replacement !== word
    );
    if (replacementExists) return false;

    setWordPools((prev) => {
      const updatedWords = prev[category].map((currentWord) =>
        currentWord === word ? replacement : currentWord
      );
      localStorage.setItem(categoryStorageKey(category), updatedWords.join(","));
      wordSources.current[replacement] = category;
      delete wordSources.current[word];
      return { ...prev, [category]: updatedWords };
    });
    return true;
  };

  const deleteWord = (word: string) => {
    const category = getWordCategory(word);
    if (!category) return;

    setWordPools((prev) => {
      const updatedWords = prev[category].filter((currentWord) => currentWord !== word);
      const bannedWords = [...(prev.banned || []), word];
      localStorage.setItem(categoryStorageKey(category), updatedWords.join(","));
      localStorage.setItem(categoryStorageKey("banned"), bannedWords.join(","));
      delete wordSources.current[word];
      return { ...prev, [category]: updatedWords, banned: bannedWords };
    });
  };

  return (
    <WordsContext.Provider
      value={{
        getWords,
        resetWords,
        selectedCategories,
        allCategories,
        setSelectedCategories,
        refreshCategories,
        getWordCategory,
        getBannedWords,
        editWord,
        deleteWord,
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

const loadCategory = (category: Category, fallback: string): string[] => {
  const saved = localStorage.getItem(categoryStorageKey(category));
  return parseCSV(saved ?? fallback);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWords = () => {
  const context = useContext(WordsContext);
  if (!context) throw new Error("useWords must be used within a WordsProvider");
  return context;
};
