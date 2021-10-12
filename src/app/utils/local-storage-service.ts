import { SavedSimulationResults } from "../components/QuickStartBar/utils/types";

export enum CacheKey {
  LAST_PATH = "LAST_PATH",
  RESULTS_BY_KEY = "RESULTS_BY_KEY",
}

interface CacheValues {
  [CacheKey.LAST_PATH]: string;
  [CacheKey.RESULTS_BY_KEY]: SavedSimulationResults;
}

class LocalStorageService {
  private localStorage: Storage;

  constructor() {
    this.localStorage = window.localStorage;
  }

  setItem<T extends CacheKey>(key: T, value: CacheValues[T]): void {
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T extends CacheKey>(
    key: T,
    fallback?: CacheValues[T]
  ): CacheValues[T] | null {
    const item = this.localStorage.getItem(key);

    // key not initialized yet
    if (item === null && fallback != null) {
      return fallback;
    }

    return JSON.parse(item);
  }

  removeItem<T extends CacheKey>(key: T) {
    this.localStorage.removeItem(key);
  }
}

export default new LocalStorageService();
