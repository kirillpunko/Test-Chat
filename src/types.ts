export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

export interface Message {
  id: string
  chatId: string
  sender: 'me' | 'them'
  text: string
  timestamp: number
}

export interface Chat {
  id: string
  phoneNumber: string
  apiChatId?: string
}

export interface SenderData {
  chatId?: string
  sender?: string
  chatName?: string
  senderName?: string
  senderPhoneNumber?: string | number
}

export interface MessageData {
  typeMessage?: string
  textMessageData?: {
    textMessage?: string
  }
  extendedTextMessageData?: {
    text?: string
    description?: string
    title?: string
    previewImageUrl?: string
    jpegThumbnail?: string
  }
  fileMessageData?: {
    downloadUrl?: string
    caption?: string
    fileName?: string
    mimeType?: string
  }
}

export interface NotificationBody {
  typeWebhook: string
  instanceData?: {
    idInstance: number
    wid: string
    typeInstance: string
  }
  timestamp?: number
  idMessage?: string
  senderData?: SenderData
  messageData?: MessageData
}

export interface NotificationResponse {
  receiptId: number
  body: NotificationBody
}

export interface StateInstanceResponse {
  stateInstance:
  | 'notAuthorized'
  | 'authorized'
  | 'blocked'
  | 'sleepMode'
  | 'starting'
  | 'yellowState'
  | string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface DeleteNotificationResponse {
  result: boolean
}

