import { useEffect, useState } from "react";

export const useDebounce = <T>(
  value: T,
  delayMs: number,
): [T, (value: T) => void] => {
  const [debounce, setDebounce] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounce(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return [debounce, setDebounce];
};
