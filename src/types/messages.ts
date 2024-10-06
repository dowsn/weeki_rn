export type MessageSender = 'user' | 'assistant';

export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  data_created: string; // Unix timestamp
}

export interface NewMessage {
  content: string;
  date_created: string;
  sender: MessageSender;
}
