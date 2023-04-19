import { ElasticsearchModule } from "@nestjs/elasticsearch"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      inject: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          node: configService.get<string>('ELASTICSEARCH_URL')
        }
      }
    })
  ],
  exports: [ElasticsearchModule]
})
export class AppElasticsearchModule {}