import { useState, useCallback } from 'react'
import type { Credentials } from '../types'
import { Storage, STORAGE_KEYS } from '../utils/storage'

export function useAuth() {
  const [credentials, setCredentials] = useState<Credentials | null>(() =>
    Storage.get(STORAGE_KEYS.CREDENTIALS, null)
  )

  const login = useCallback((creds: Credentials) => {
    setCredentials(creds)
    Storage.set(STORAGE_KEYS.CREDENTIALS, creds)
  }, [])

  const logout = useCallback(() => {
    setCredentials(null)
    Storage.remove(STORAGE_KEYS.CREDENTIALS)
  }, [])

  return {
    credentials,
    isAuthenticated: Boolean(credentials),
    login,
    logout,
  }
}
