import { 
  SubscribeMessage, 
  WebSocketGateway, 
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { ChatService } from "./chat.service"
import { ChatMessage } from "./chat.interface"

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  
  @WebSocketServer()
  server!: Server

  async handleConnection(socket: Socket) {
    const roomId = socket.handshake.query.roomId as string
    socket.join(roomId)
    const messages = await this.chatService.getChatRoomMessages(roomId)
    socket.emit('chat-history', messages)
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    socket.leave(roomId)
  }

  @SubscribeMessage('chat')
  async handleMessage(client: Socket, payload: ChatMessage): Promise<void> {
    const roomId = payload.roomId
    const data = payload.text
    const message = await this.chatService.sendMessage(payload)
    this.server.to(roomId).emit('chat', message)
  } 

}