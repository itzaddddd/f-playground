import { Module } from "@nestjs/common"
import { ChatController } from "./chat.controller"
import { ChatService } from "./chat.service"
// import { KafkaModule } from "../kafka/kafka.module"
import { ChatGateway } from "./chat.gateway"
import { RabbitMQModule } from "@nestjs-plus/rabbitmq"


@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [{ name: 'chat_notification_exchange', type: 'fanout' }],
      uri: <string>process.env.AMQP_URI,
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}