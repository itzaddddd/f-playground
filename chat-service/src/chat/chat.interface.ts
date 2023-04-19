export interface ChatMessage {
  id?: string,
  roomId: string,
  sender: string,
  text: string,
  timestamp: Date
}