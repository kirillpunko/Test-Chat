import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import type { Chat } from '../types'
import { findExistingChat, formatChatId, formatPhoneDisplay } from '../api'
import { Storage, STORAGE_KEYS } from '../utils/storage'

export function useChats() {
  const [chats, setChats] = useState<Chat[]>(() =>
    Storage.get(STORAGE_KEYS.CHATS, [])
  )
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const chatsRef = useRef(chats)

  useEffect(() => {
    chatsRef.current = chats
    Storage.set(STORAGE_KEYS.CHATS, chats)
  }, [chats])

  const activeChat = useMemo(() => {
    if (!activeChatId) return null
    return chats.find((c) => c.id === activeChatId) || null
  }, [chats, activeChatId])

  const selectChat = useCallback((chatId: string | null) => {
    setActiveChatId(chatId)
  }, [])

  const createChat = useCallback((newChat: Chat) => {
    setChats((prev) => {
      const existing = findExistingChat(prev, newChat.id, newChat.phoneNumber)
      if (existing) {
        return prev
      }
      return [newChat, ...prev]
    })
    setActiveChatId(newChat.id)
  }, [])

  const deleteChat = useCallback((chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId))
    setActiveChatId((current) => (current === chatId ? null : current))
  }, [])

  const upsertIncomingChat = useCallback(
    (rawChatId: string, senderPhoneNumber?: string | number, chatName?: string): string => {
      const existing = findExistingChat(chatsRef.current, rawChatId, senderPhoneNumber)
      const targetChatId = existing
        ? existing.id
        : senderPhoneNumber
          ? formatChatId(String(senderPhoneNumber))
          : rawChatId

      let displayName = chatName || formatPhoneDisplay(rawChatId)
      if (senderPhoneNumber) {
        displayName = formatPhoneDisplay(String(senderPhoneNumber))
      }

      setChats((prev) => {
        const found = findExistingChat(prev, rawChatId, senderPhoneNumber)

        if (found) {
          const updatedChat: Chat = {
            ...found,
            apiChatId: rawChatId,
          }
          const otherChats = prev.filter(
            (c) => c.id !== found.id && c.id !== rawChatId
          )
          return [updatedChat, ...otherChats]
        }

        const newChat: Chat = {
          id: targetChatId,
          phoneNumber: displayName,
          apiChatId: rawChatId,
        }

        const otherChats = prev.filter((c) => c.id !== rawChatId)
        return [newChat, ...otherChats]
      })

      return targetChatId
    },
    []
  )

  return {
    chats,
    activeChat,
    activeChatId,
    selectChat,
    createChat,
    deleteChat,
    upsertIncomingChat,
  }
}
