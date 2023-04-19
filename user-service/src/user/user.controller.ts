import { Body, Controller, Get, Post, Param, UseGuards } from "@nestjs/common"
import { UserService } from "./user.service"
import { JwtAuthGuard } from "../auth/auth.guard"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async getUserByEmail(
    @Body()
    email: string
  ) {
    const user = await this.userService.findUserByEmail(email)
    if (!user) throw new Error("User not found")

    return { email: user.email }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findUserByid(id)
    if (!user) throw new Error("User not found")
  }

}