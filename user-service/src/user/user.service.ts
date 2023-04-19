import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User } from "./user.schema"
import * as bcrypt from "bcryptjs"

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new this.userModel({ name, email, password: hashedPassword })
    return await user.save()
  }

  async findUserByEmail(email: string): Promise<User|null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findUserByid(id: string): Promise<User|null> {
    return await this.userModel.findById(id).exec();
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.findUserByEmail(email)
    if (!user) return false
    return await bcrypt.compare(password, user.password)
  }

}

// @Injectable()
// export class MySingletonService {
//   private readonly id: string;

//   constructor() {
//     this.id = Math.random.toString().substring(2,15)
//     console.log(`MySingletonService creawted with ID ${this.id}`)
//   }

//   getId() {
//     return this.id;
//   }
// }

// @Injectable()
// export class OrderService {
//   constructor(private readonly eventEmittter: EventEmitter2) {}

//   async placeOrder(order: Order): Promise<void> {
//     this.eventEmittter.emit('orderPlaced', order)
//   }
// }

// @Injectable()
// export class EmailNotificatioinService {
//   constructor(private readonly eventEmitter: EventEmitter2) {
//     this.eventEmitter.on('orderPlaced', (order: Order) => {
//       this.sendEmailNotification(order)  
//     })
//   }

//   async sendEmailNotification(order: Order): Promise<void> {

//   }
// }