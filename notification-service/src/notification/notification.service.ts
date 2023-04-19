import { Injectable } from "@nestjs/common"
import { KafkaService } from "../kafka/kafka.service"

@Injectable()
export class NotificationService {
  private notification: any[] = []

  constructor(private readonly kafkaService: KafkaService) {
    this.kafkaService.consumeMessages('chat-message-notifications', async (message) => {
      const notification = JSON.parse(message.value.toString())
      this.notification.push(notification)

      // Save notification to db
    })
  }

  async getRecentNotification() {
    return this.notification.slice(-10)
  }
}