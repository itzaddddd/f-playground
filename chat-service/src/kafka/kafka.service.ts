import { Injectable, Inject } from "@nestjs/common"
import { Kafka } from "kafkajs"

@Injectable()
export class KafkaService {
  private producer

  constructor(@Inject('KAFKA') private readonly kafka: Kafka) {
    this.producer = this.kafka.producer()
  }

  async sendMessage(topic: string, message: object) {
    await this.producer.connect()
    await this.producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message)}]
    })
    await this.producer.disconnect()
  }

}