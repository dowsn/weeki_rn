export type MessageSender = 'me' | 'other';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: number; // Unix timestamp
}

export interface NewMessage {
  text: string;
  sender: MessageSender;
}
