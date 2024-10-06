export type MessageSender = 'me' | 'assistant';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  data_created: string; // Unix timestamp
}

export interface NewMessage {
  text: string;
  sender: MessageSender;
}
