class LocalStorageMock {
  store = new Map<string, string>();

  clear() {
    this.store.clear();
  }

  getItem(key: string): string {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }
}

/* eslint-disable */
global["localStorage"] = new LocalStorageMock() as any;
