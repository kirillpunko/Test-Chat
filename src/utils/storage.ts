export const STORAGE_KEYS = {
  CREDENTIALS: 'green_api_credentials',
  CHATS: 'green_api_chats',
  MESSAGES: 'green_api_messages',
} as const

class LocalStorageService {
  get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : fallback
    } catch {
      return fallback
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }
}

export const Storage = new LocalStorageService()