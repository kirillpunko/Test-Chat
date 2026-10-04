import { useState, useEffect, useCallback } from 'react'
import type { Credentials, Chat, Message } from '../types'
import { sendMessage as apiSendMessage } from '../api'
import { Storage, STORAGE_KEYS } from '../utils/storage'

export function useMessages(activeChatId: string | null) {
  const [messages, setMessages] = useState<Record<string, Message[]>>(() =>
    Storage.get(STORAGE_KEYS.MESSAGES, {})
  )

  useEffect(() => {
    Storage.set(STORAGE_KEYS.MESSAGES, messages)
  }, [messages])

  const activeMessages = (activeChatId && messages[activeChatId]) || []

  const addIncomingMessage = useCallback(
    (targetChatId: string, rawChatId: string, incomingMessage: Message) => {
      setMessages((prev) => {
        const currentList = prev[targetChatId] || []
        if (currentList.some((m) => m.id === incomingMessage.id)) {
          return prev
        }

        const orphanList =
          rawChatId !== targetChatId ? prev[rawChatId] || [] : []

        const updated = {
          ...prev,
          [targetChatId]: [...currentList, ...orphanList, incomingMessage],
        }

        if (rawChatId !== targetChatId && prev[rawChatId]) {
          delete updated[rawChatId]
        }

        return updated
      })
    },
    []
  )

  const sendTextMessage = useCallback(
    async (credentials: Credentials, chat: Chat, text: string) => {
      const targetChatId = chat.apiChatId || chat.id
      const tempId = `msg-${Date.now()}`

      const newMsg: Message = {
        id: tempId,
        chatId: chat.id,
        sender: 'me',
        text,
        timestamp: Date.now(),
      }

      setMessages((prev) => ({
        ...prev,
        [chat.id]: [...(prev[chat.id] || []), newMsg],
      }))

      try {
        const { idMessage } = await apiSendMessage(
          credentials.idInstance,
          credentials.apiTokenInstance,
          targetChatId,
          text
        )

        if (idMessage) {
          setMessages((prev) => ({
            ...prev,
            [chat.id]: prev[chat.id].map((m) =>
              m.id === tempId ? { ...m, id: idMessage } : m
            ),
          }))
        }
      } catch (error) {
        setMessages((prev) => ({
          ...prev,
          [chat.id]: prev[chat.id].filter((m) => m.id !== tempId),
        }))
        throw error
      }
    },
    []
  )

  const deleteMessagesForChat = useCallback((chatId: string) => {
    setMessages((prev) => {
      if (!prev[chatId]) return prev
      const { [chatId]: _, ...rest } = prev
      return rest
    })
  }, [])

  return {
    messages,
    activeMessages,
    addIncomingMessage,
    sendTextMessage,
    deleteMessagesForChat,
  }
}
