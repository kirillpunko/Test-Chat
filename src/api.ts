import axios from 'axios'
import type {
  Chat,
  NotificationResponse,
  StateInstanceResponse,
  SendMessageResponse,
  DeleteNotificationResponse,
} from './types'

export const api = axios.create({
  baseURL: import.meta.env.DEV ? '/green-api' : 'https://api.green-api.com',
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.response?.data || err.message
    return Promise.reject(new Error(typeof msg === 'string' ? msg : err.message))
  }
)

const getPath = (id: string, token: string, method: string) =>
  `/waInstance${id}/${method}/${token}`

export function formatChatId(input: string): string {
  const clean = input.trim()
  if (!clean || clean.includes('@')) return clean

  const digits = clean.replace(/\D/g, '')
  return digits ? `${digits}@c.us` : clean
}

export function normalizePhone(input?: string | number | null): string {
  return String(input ?? '').replace('@c.us', '').replace(/\D/g, '')
}

export function formatPhoneDisplay(input?: string | number | null): string {
  return normalizePhone(input) || String(input ?? '').replace('@c.us', '').trim()
}

export function isSamePhoneNumber(
  a?: string | number | null,
  b?: string | number | null
): boolean {
  const normA = normalizePhone(a);
  const normB = normalizePhone(b);
  return Boolean(normA && normB && normA === normB)
}

export function findExistingChat(
  chats: Chat[],
  rawChatId: string,
  senderPhoneNumber?: string | number
): Chat | undefined {
  const matches = (c: Chat, target?: string | number) =>
    Boolean(
      target &&
      (c.id === target ||
        c.apiChatId === target ||
        isSamePhoneNumber(c.id, target) ||
        isSamePhoneNumber(c.phoneNumber, target) ||
        isSamePhoneNumber(c.apiChatId, target))
    )

  return (
    (senderPhoneNumber && chats.find((c) => matches(c, senderPhoneNumber))) ||
    (rawChatId && chats.find((c) => matches(c, rawChatId))) ||
    undefined
  )
}

export async function getStateInstance(
  idInstance: string,
  apiTokenInstance: string
): Promise<StateInstanceResponse> {
  const { data } = await api.get<StateInstanceResponse>(
    getPath(idInstance, apiTokenInstance, 'getStateInstance')
  )
  return data
}

export async function sendMessage(
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
  message: string
): Promise<SendMessageResponse> {
  const { data } = await api.post<SendMessageResponse>(
    getPath(idInstance, apiTokenInstance, 'sendMessage'),
    { chatId, message }
  )
  return data
}

export async function receiveNotification(
  idInstance: string,
  apiTokenInstance: string
): Promise<NotificationResponse | null> {
  const { data } = await api.get<NotificationResponse | null>(
    getPath(idInstance, apiTokenInstance, 'receiveNotification')
  )
  return data || null
}

export async function deleteNotification(
  idInstance: string,
  apiTokenInstance: string,
  receiptId: number
): Promise<DeleteNotificationResponse> {
  const { data } = await api.delete<DeleteNotificationResponse>(
    `${getPath(idInstance, apiTokenInstance, 'deleteNotification')}/${receiptId}`
  )
  return data
}

