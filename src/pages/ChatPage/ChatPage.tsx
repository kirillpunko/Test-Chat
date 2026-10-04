import { useCallback } from 'react'
import type { Credentials } from '../../types'
import { useChats } from '../../hooks/useChats'
import { useMessages } from '../../hooks/useMessages'
import { usePolling } from '../../hooks/usePolling'
import { Sidebar } from '../../components/Sidebar'
import { ChatWindow } from '../../components/ChatWindow'
import styles from './ChatPage.module.css'

interface ChatPageProps {
  credentials: Credentials
  onLogout: () => void
}

interface IncomingMessagePayload {
  rawChatId: string
  senderPhoneNumber?: string | number
  chatName?: string
  text: string
  messageId?: string
  timestamp?: number
}

export function ChatPage({ credentials, onLogout }: ChatPageProps) {
  const {
    chats,
    activeChat,
    activeChatId,
    selectChat,
    createChat,
    deleteChat,
    upsertIncomingChat,
  } = useChats()

  const {
    activeMessages,
    addIncomingMessage,
    sendTextMessage,
    deleteMessagesForChat,
  } = useMessages(activeChatId)

  const handleIncomingMessage = useCallback(
    ({
      rawChatId,
      senderPhoneNumber,
      chatName,
      text,
      messageId,
      timestamp,
    }: IncomingMessagePayload) => {
      const targetChatId = upsertIncomingChat(rawChatId, senderPhoneNumber, chatName)

      addIncomingMessage(targetChatId, rawChatId, {
        id: messageId || `inc-${Date.now()}`,
        chatId: targetChatId,
        sender: 'them',
        text,
        timestamp: timestamp || Date.now(),
      })
    },
    [upsertIncomingChat, addIncomingMessage]
  )

  usePolling({
    credentials,
    onIncomingMessage: handleIncomingMessage,
  })

  const handleLogout = useCallback(() => {
    selectChat(null)
    onLogout()
  }, [selectChat, onLogout])

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      deleteChat(chatId)
      deleteMessagesForChat(chatId)
    },
    [deleteChat, deleteMessagesForChat]
  )

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!activeChat) return
      await sendTextMessage(credentials, activeChat, text)
    },
    [credentials, activeChat, sendTextMessage]
  )

  return (
    <div className={styles.layout}>
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={selectChat}
        onCreateChat={createChat}
        onDeleteChat={handleDeleteChat}
        onLogout={handleLogout}
        idInstance={credentials.idInstance}
      />
      <ChatWindow
        chat={activeChat}
        messages={activeMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
