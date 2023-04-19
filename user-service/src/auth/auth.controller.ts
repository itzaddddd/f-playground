import { Body, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body()
    email: string,

    @Body()
    password: string
  ) {
    
  }
}