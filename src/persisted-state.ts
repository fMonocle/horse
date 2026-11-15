import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const PREFIX = "horse-data:";

export function usePersistedState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(PREFIX + key);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      return;
    }
  }, [key, value]);

  return [value, setValue];
}

export function clearPersistedState() {
  Object.keys(sessionStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => sessionStorage.removeItem(key));
}
