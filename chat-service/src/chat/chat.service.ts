import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
// import { KafkaService } from "../kafka/kafka.provider"
import { ElasticsearchService } from "@nestjs/elasticsearch"
import { ChatMessage } from "./chat.interface"
import { RabbitSubscribe, RabbitMQService } from "@nestjs-plus/rabbitmq"
import { ClientProxy } from "@nestjs/microservices/client"
import { v4 as uuidv4 } from 'uuid'


@Injectable()
export class ChatService {
  constructor(

    // private readonly kafkaService: KafkaService,
    private readonly elasticsearchService: ElasticsearchService,
    // private readonly notificationServiceClient: ClientProxy 
    private readonly rabbitMQService: RabbitMQService
  ) {}

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'chat.message',
    queue: 'chat_message_queue'
  })
  handleMessage(message: any) {
    console.log('Recevied message:', message)
  }

  async postMessage(chatRoomId: string, content: any) {
    // Save this message to db
    // await this.elasticsearchService.index({
    //   index: 'chat-messages',
    //   body: {
    //     ...content,
    //     timestamp: new Date()
    //   }
    // })

    // // Send a notification to the notification service
    // const topic = 'chat-message-notification';
    // const notification = { chatRoomId, content }

    // this.kafkaService.sendMessage(topic, notification)
  }

  async getChatRoomMessages(roomId: string): Promise<ChatMessage[]> {
    const cachedChatHistory = await this.cacheService.get(`chat-${roomId}`)
    if (cachedChatHistory) return cachedChatHistory

    const chatHistory = await this.elasticsearchService.search<ChatMessage>({
      index: 'chat',
      body: {
        query: {
          match: { roomId }
        },
        sort: [
          { timestamp: { order: 'asc' } }
        ]
      }
    })

    await this.cacheService.set(`chat-${roomId}`, chatHistory)
    return chatHistory.hits.hits.map(hit => hit._source!)
  }

  async sendMessage(message: ChatMessage): Promise<ChatMessage> {
    // save message document to elasticsearch
    const response = await this.elasticsearchService.index<ChatMessage>({
      index: 'chat',
      body: message
    })

    // publish message noti to rabbitmq
    const notificationMessage = {
      id: uuidv4(),
      ...message
    }
    
    this.notificationServiceClient.emit('notification_created', notificationMessage)

    return { ...message, id: response._id }
  }

  @RabbitSubscribe({
    exchange: 'notification',
    routingKey: 'notification_created',
    queue: 'notification_queue'
  })
  async handleNotificationCreated(message: ChatMessage) {
    console.log(`Received notification message: ${JSON.stringify(message)}`)
    // Send notification to connected clients via socket.io
    this.socketServer.to(message.roomId).emit('notification_created', message)
  }

  async deleteMessage(id: string): Promise<void> {
    await this.elasticsearchService.delete({
      index: 'chat',
      id
    })
  }

  async searchApi(message: string) {
    const fts = 'domain/my_index/_search?q=message:elasticsearch'
    const kw = 'domain/my_index/_search?q=message.keyword:elasticsearch'

    const url = 'http://localhost:9200/my_index_2'
    const schema = {
      setting: {
        index: {
          number_of_shards: "3",
          number_of_replicas: "1",
          analysis: {
            analyzer: {
              thai: {
                filter: ['lowercase'],
                tokenizer: "thai"
              }
            }
          }
        }
      },
      mappings: {
        properties: {
          message: {
            type: "text",
            analyzer: "thai"
          },
          user: {
            type: "text",
            analyzer: "thai",
            fields: {
              keyword: "keyword",
              ignore_above: 256
            }
          }
        }
      }
    }
    const urlRe = 'http://localhost:9200/_reindex'
    const bodyUrlRe = {
      source: {
        index: 'my_index_1'
      },
      dest: {
        index: 'my_index_2'
      }
    }

    const urlAl = 'http://localhost:9200/_aliases'
    const bodyUrlAl = {
      actions: [
        {
          remove: {
            index: 'my_index_1',
            alias: 'my_index'
          }
        },
        {
          add: {
            index: 'my_index_2',
            alias: 'my_index'
          }
        }
      ]
    }
  }

  async searchMessage(query: string) {
    const searchResult = await this.elasticsearchService.search({
      index: 'chat-messages',
      body: {
        query: {
          match: {
            message: query,
          },
        },
      },
    });

    const leafClause = {
      query: {
        bool: {
          must: [ 
            {
              terms: {
                firstname: {
                  value: ['isara','f'],
                  boost: 1.75
      
                }
              },
            },
            {
              range: {
                created_at: {
                  gte: '2023-01-01',
                  let: '2023-03-01',
                  boost: 0.75
                }
              }
            }
          ]
        },
        wildcard: {
          firstname: {
            value: 'Jo*y' 
          } 
        },
        match: {
          message: {
            query: 'solid state device'
          }
        }
      }
    }

    return searchResult.hits.hits.map((v) => v._source)
  
  }
}