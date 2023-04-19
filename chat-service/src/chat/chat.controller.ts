import { Controller, Post, Body } from "@nestjs/common"
import { ChatService } from "./chat.service"

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async postMessage(
    @Body() messageDto: { chatRoomId: string, content: string }
  ) {
    const { chatRoomId, content } = messageDto;
    await this.chatService.postMessage(chatRoomId, content);
  }
}