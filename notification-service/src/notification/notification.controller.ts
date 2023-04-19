import { Body, Controller, Get, Post, Param } from "@nestjs/common"
import { UserService } from "./notification.service"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async register(
    @Body("name")
    name: string,

    @Body("email")
    email: string,
    
    @Body("password")
    password: string
  ) {
    return await this.userService.createUser(name, email, password)
  }

  @Post("login")
  async login(
    @Body("email")
    email: string,

    @Body("password")
    password: string
  ) {
    const isValidPassword = await this.userService.validatePassword(email, password)
    if (!isValidPassword) throw new Error("Invalid email or password")

    return { message: "Login successful" }
  }

  @Get(":email")
  async getUserByEmail(
    @Param("email")
    email: string
  ) {
    const user = await this.userService.findUserByEmail(email)
    if (!user) throw new Error("User not found")

    return { email: user.email }
  }

}