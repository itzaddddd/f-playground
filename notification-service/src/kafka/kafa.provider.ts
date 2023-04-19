import { Kafka } from 'kafkajs'
import { Provider } from '@nestjs/common'

export const KafkaProvider: Provider = {
  provide: 'KAFKA',
  useFactory: () => {
    const kafka = new Kafka({
      clientId: 'notification-service',
      brokers: ['kafka-broker:9092']
    })
    return kafka
  }
}