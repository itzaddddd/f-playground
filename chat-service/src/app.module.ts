import { Module } from "@nestjs/common"
import { AppElasticsearchModule } from "./elasticsearch/elasticsearch.module"
import { RabbitMQModule } from "@nestjs-plus/rabbitmq"

@Module({
  imports: [
    AppElasticsearchModule,
    RabbitMQModule.forRoot({
      exchanges: [
        { name: 'exchange1', type: 'direct' },
        { name: 'exchange2', type: 'topic' }
      ],
      uri: <string>process.env.RABBITMQ_URI
    })
  ]
  
})

export class AppModule {}