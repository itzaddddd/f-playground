import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "../user/user.service"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService  
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email)
    if (user) return user
    return null
  }

}