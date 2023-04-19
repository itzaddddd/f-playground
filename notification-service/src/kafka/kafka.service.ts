import { Injectable, Inject } from "@nestjs/common"
import { Kafka } from "kafkajs"

@Injectable()
export class KafkaService {
  private consumer

  constructor(@Inject('KAFKA') private readonly kafka: Kafka) {
    this.consumer = this.kafka.consumer({ groupId: 'notification-service' })
  }

  async consumeMessages(topic: string, onMessage: (message: any) => void) {
    await this.consumer.connect()
    await this.consumer.subscribe({ topic, fromBeginning: true })
    await this.consumer.run({ 
      eachMessage: async ({ message }) => onMessage(message) 
    })
  }
}