import { useState } from 'react'
import type { Credentials } from '../../types'
import { getStateInstance } from '../../api'
import { t } from '../../hooks/useTranslation'

interface UseLoginFormProps {
  onLogin: (credentials: Credentials) => void
}

export function useLoginForm({ onLogin }: UseLoginFormProps) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleIdChange = (value: string) => {
    setIdInstance(value)
    if (error) setError(null)
  }

  const handleTokenChange = (value: string) => {
    setApiTokenInstance(value)
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    const trimmedId = idInstance.trim()
    const trimmedToken = apiTokenInstance.trim()

    if (!trimmedId || !trimmedToken) {
      setError(t.login.validationError)
      return
    }

    if (!/^\d+$/.test(trimmedId)) {
      setError(t.login.idFormatError)
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await getStateInstance(trimmedId, trimmedToken)
      onLogin({
        idInstance: trimmedId,
        apiTokenInstance: trimmedToken,
      })
    } catch {
      setError(t.login.authError)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    idInstance,
    apiTokenInstance,
    isLoading,
    error,
    setIdInstance: handleIdChange,
    setApiTokenInstance: handleTokenChange,
    handleSubmit,
  }
}

