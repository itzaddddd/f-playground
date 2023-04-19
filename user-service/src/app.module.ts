import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UserModule } from "./user/user.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"

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
    UserModule,
    AppModule,
    JwtModule.registerAsync({
      inject: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60m' }
        }
      }
    })
  ]
})

export class AppModule {}