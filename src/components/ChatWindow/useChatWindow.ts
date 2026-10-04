import { useState, useRef, useEffect, useCallback } from 'react'
import type { Message } from '../../types'
import { t } from '../../hooks/useTranslation'

interface UseChatWindowProps {
  messages: Message[]
  onSendMessage: (text: string) => Promise<void>
}

export function useChatWindow({ messages, onSendMessage }: UseChatWindowProps) {
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const clearError = useCallback(() => {
    setErrorMessage(null)
  }, [])

  const handleSend = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed || isSending) return

    setIsSending(true)
    setErrorMessage(null)

    try {
      await onSendMessage(trimmed)
      setInputText('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.chat.sendError
      setErrorMessage(message)
    } finally {
      setIsSending(false)
    }
  }

  return {
    inputText,
    setInputText,
    isSending,
    errorMessage,
    clearError,
    messagesEndRef,
    handleSend,
  }
}
