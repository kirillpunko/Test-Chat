import { useEffect, useRef } from 'react'
import type { Credentials } from '../types'
import { receiveNotification, deleteNotification } from '../api'
import { t } from './useTranslation'

export interface IncomingMessagePayload {
  rawChatId: string
  senderPhoneNumber?: string | number
  chatName?: string
  text: string
  messageId?: string
  timestamp?: number
}

interface UsePollingOptions {
  credentials: Credentials | null
  onIncomingMessage: (payload: IncomingMessagePayload) => void
}

const EMPTY_QUEUE_INTERVAL_MS = 1500
const ERROR_RETRY_INTERVAL_MS = 3000

export function usePolling({ credentials, onIncomingMessage }: UsePollingOptions) {
  const onIncomingRef = useRef(onIncomingMessage)

  useEffect(() => {
    onIncomingRef.current = onIncomingMessage
  })

  useEffect(() => {
    if (!credentials) return

    let isPolling = true

    const poll = async () => {
      while (isPolling) {
        try {
          const notification = await receiveNotification(
            credentials.idInstance,
            credentials.apiTokenInstance
          )

          if (notification && notification.receiptId) {
            const { receiptId, body } = notification

            if (
              body &&
              (body.typeWebhook === 'incomingMessageReceived' ||
                body.typeWebhook === 'incomingAPIMessageReceived')
            ) {
              const senderData = body.senderData || {}
              const rawChatId = String(senderData.chatId || senderData.sender || '')
              const senderPhoneNumber = senderData.senderPhoneNumber
              const text =
                body.messageData?.textMessageData?.textMessage ||
                body.messageData?.extendedTextMessageData?.text

              if (rawChatId && text) {
                onIncomingRef.current({
                  rawChatId,
                  senderPhoneNumber,
                  chatName: senderData.chatName,
                  text,
                  messageId: body.idMessage,
                  timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
                })
              }
            }

            await deleteNotification(
              credentials.idInstance,
              credentials.apiTokenInstance,
              receiptId
            )
          } else {
            await new Promise((resolve) => setTimeout(resolve, EMPTY_QUEUE_INTERVAL_MS))
          }
        } catch (err: unknown) {
          if (!isPolling) break
          console.warn(t.errors.pollingWarning, err)
          await new Promise((resolve) => setTimeout(resolve, ERROR_RETRY_INTERVAL_MS))
        }
      }
    }

    poll()

    return () => {
      isPolling = false
    }
  }, [credentials])
}
