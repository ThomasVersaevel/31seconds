// Handles picking the words for a card.
import { useState, useCallback } from "react";

export function useWordPool(initialWords: string[]) {
  const [pool, setPool] = useState<string[]>([...initialWords]);

  const getNextWords = useCallback((count: number) => {
    if (pool.length < count) return [];

    const selected: string[] = [];
    const updatedPool = [...pool];

    while (selected.length < count && updatedPool.length > 0) {
      const idx = Math.floor(Math.random() * updatedPool.length);
      selected.push(updatedPool[idx]);
      updatedPool.splice(idx, 1);
    }

    setPool(updatedPool);
    return selected;
  }, [pool]);

  const reset = useCallback(() => {
    setPool([...initialWords]);
  }, [initialWords]);

  const isEmpty = pool.length < 5;

  return { getNextWords, reset, isEmpty };
}
