import React from 'react'
import type { Chat } from '../../types'
import { useNewChatForm } from './useNewChatForm'
import { t } from '../../hooks/useTranslation'
import styles from './Sidebar.module.css'

interface SidebarProps {
  chats: Chat[]
  activeChatId: string | null
  onSelectChat: (chatId: string) => void
  onCreateChat: (chat: Chat) => void
  onDeleteChat?: (chatId: string) => void
  onLogout: () => void
  idInstance: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  onLogout,
  idInstance,
}) => {
  const { phoneNumber, setPhoneNumber, handleCreateChat } = useNewChatForm({
    chats,
    onSelectChat,
    onCreateChat,
  })

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.sidebar.title}</h1>
          <span className={styles.instanceId}>
            {t.app.instancePrefix}
            {idInstance}
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className={styles.btnLogout}
          title={t.sidebar.logoutTooltip}
        >
          {t.sidebar.logout}
        </button>
      </div>

      <div className={styles.newChatSection}>
        <form onSubmit={handleCreateChat} className={styles.newChatForm}>
          <input
            type="text"
            placeholder={t.sidebar.phonePlaceholder}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <button type="submit" className={styles.btnPrimarySm}>
            {t.sidebar.createChat}
          </button>
        </form>
      </div>

      <div className={styles.chatsList}>
        {chats.length === 0 ? (
          <div className={styles.noChats}>
            <span>{t.sidebar.noChats}</span>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`${styles.chatItem} ${chat.id === activeChatId ? styles.active : ''}`}
            >
              <div className={styles.chatAvatar}>
                {chat.phoneNumber.slice(0, 2).toUpperCase()}
              </div>
              <div className={styles.chatInfo}>
                <span className={styles.chatName}>{chat.phoneNumber}</span>
              </div>
              {onDeleteChat && (
                <button
                  type="button"
                  className={styles.btnDeleteChat}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat.id)
                  }}
                  title={t.sidebar.deleteChatTooltip}
                >
                  ✕
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
