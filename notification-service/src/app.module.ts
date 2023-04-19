import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UserModule } from "./notification/notification.module"
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI')
      })
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    UserModule
  ]
})

export class AppModule {}