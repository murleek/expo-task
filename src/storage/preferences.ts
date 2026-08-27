import { storage } from ".";

const SEARCH_KEY = "pref:last-search";

export const preferences = {
  getLastSearch(): string {
    return storage.getString(SEARCH_KEY) ?? "";
  },
  setLastSearch(value: string): void {
    storage.set(SEARCH_KEY, value);
  },
};
