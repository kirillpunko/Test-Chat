import { useState } from 'react'
import type { Chat } from '../../types'
import { formatChatId, formatPhoneDisplay, findExistingChat } from '../../api'

interface UseNewChatFormProps {
  chats: Chat[]
  onSelectChat: (chatId: string) => void
  onCreateChat: (chat: Chat) => void
}

export function useNewChatForm({
  chats,
  onSelectChat,
  onCreateChat,
}: UseNewChatFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleCreateChat = (e: React.SubmitEvent) => {
    e.preventDefault()
    const clean = phoneNumber.trim()
    if (!clean) return

    const chatId = formatChatId(clean)
    const existing = findExistingChat(chats, chatId, clean)

    if (existing) {
      onSelectChat(existing.id)
      setPhoneNumber('')
      return
    }

    const newChat: Chat = {
      id: chatId,
      phoneNumber: formatPhoneDisplay(chatId),
    }

    onCreateChat(newChat)
    setPhoneNumber('')
  }

  return {
    phoneNumber,
    setPhoneNumber,
    handleCreateChat,
  }
}
