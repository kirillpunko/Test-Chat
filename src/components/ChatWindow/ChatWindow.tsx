import React, { useMemo } from 'react'
import type { Chat, Message } from '../../types'
import { useChatWindow } from './useChatWindow'
import { t } from '../../hooks/useTranslation'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
  chat: Chat | null
  messages: Message[]
  onSendMessage: (text: string) => Promise<void>
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  onSendMessage,
}) => {
  const {
    inputText,
    setInputText,
    isSending,
    errorMessage,
    clearError,
    messagesEndRef,
    handleSend,
  } = useChatWindow({ messages, onSendMessage })

  const avatarInitials = useMemo(
    () => chat?.phoneNumber.slice(0, 2).toUpperCase() ?? '',
    [chat?.phoneNumber]
  )

  if (!chat) {
    return (
      <main className={`${styles.chatWindow} ${styles.empty}`}>
        <div className={styles.emptyState}>
          <p>{t.chat.emptyState}</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderAvatar}>
          {avatarInitials}
        </div>
        <div className={styles.chatHeaderDetails}>
          <h2>{chat.phoneNumber}</h2>
          <span className={styles.chatHeaderSub}>{t.chat.subtitle}</span>
        </div>
      </div>

      {errorMessage && (
        <div className={styles.errorBanner}>
          <span>{errorMessage}</span>
          <button type="button" onClick={clearError}>
            ✕
          </button>
        </div>
      )}

      <div className={styles.messagesArea}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>
            <span>{t.chat.noMessages}</span>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${
                msg.sender === 'me' ? styles.outgoing : styles.incoming
              }`}
            >
              <div className={styles.messageBubble}>
                <div className={styles.messageText}>{msg.text}</div>
                <div className={styles.messageTime}>{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className={styles.messageInputForm}>
        <input
          type="text"
          placeholder={t.chat.inputPlaceholder}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending}
        />
        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={!inputText.trim() || isSending}
        >
          {isSending ? t.chat.sending : t.chat.sendButton}
        </button>
      </form>
    </main>
  )
}
