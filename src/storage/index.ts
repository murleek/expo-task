import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({
  id: "social-feed",
});

export function getJSON<T>(key: string): T | undefined {
  const raw = storage.getString(key);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function setJSON<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}
