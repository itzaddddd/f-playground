import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [{ name: 'chat_notification_exchange', type: 'fanout' }],
      uri: <string>process.env.AMQP_URI,
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}