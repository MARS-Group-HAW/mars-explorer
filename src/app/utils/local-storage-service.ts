export enum CacheKey {
  LAST_PATH = "LAST_PATH",
}

interface CacheValues {
  [CacheKey.LAST_PATH]: string;
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
}

export default new LocalStorageService();
